// Local server for the Creator Tools. Double-click Start.bat or run: node server.js
// Builds the pages into .out/ and serves them at http://localhost:3002/creator-tools/
// together with the /creator-tools/api/* routes the pages call.
//
// API keys are read from environment variables first, then from config.json
// next to this file (copy config.example.json and fill it in). Without keys
// the calculators and generators still work; only the live YouTube and Twitch
// lookups say they are not set up.

const http = require("http");
const fs = require("fs");
const path = require("path");
const { buildInto } = require("./build-tools");
const youtube = require("./lib/youtube");
const twitch = require("./lib/twitch");

const HERE = __dirname;
const OUT = path.join(HERE, ".out");
const PORT = Number(process.env.PORT) || 3002;

let cfg = {};
try {
  cfg = JSON.parse(fs.readFileSync(path.join(HERE, "config.json"), "utf8"));
} catch (_) {
  /* no config.json, use env only */
}
const env = (k) => process.env[k] || cfg[k] || "";

youtube.configure({ apiKey: env("YOUTUBE_API_KEY") || env("GOOGLE_API_KEY") });
twitch.configure({ clientId: env("TWITCH_CLIENT_ID"), clientSecret: env("TWITCH_CLIENT_SECRET") });

fs.rmSync(OUT, { recursive: true, force: true });
const count = buildInto(OUT);

const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json" };

function send(res, code, body, type) {
  res.writeHead(code, { "Content-Type": type || "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

async function api(req, res, name, url) {
  const params = Object.fromEntries(url.searchParams.entries());
  if (name === "youtube") return send(res, ...Object.values(await youtube.handleRequest(params.action, params)));
  if (name === "twitch") return send(res, ...Object.values(await twitch.handleRequest(params.action, params)));
  if (name === "ai") return send(res, 200, { ok: false, code: "no_key" }); // built-in generators are used locally
  send(res, 404, { ok: false, error: "Unknown API." });
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    let p = url.pathname;
    if (p === "/" || !p.startsWith("/creator-tools")) {
      res.writeHead(302, { Location: "/creator-tools/" });
      return res.end();
    }
    const apiMatch = /^\/creator-tools\/api\/(\w+)$/.exec(p);
    if (apiMatch) {
      try {
        return await api(req, res, apiMatch[1], url);
      } catch (e) {
        return send(res, 500, { ok: false, error: e.message });
      }
    }
    p = p.replace(/^\/creator-tools\/?/, "");
    if (p === "" || p.endsWith("/")) p += "index.html";
    const file = path.normalize(path.join(OUT, p));
    if (!file.startsWith(OUT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      const dirIndex = path.join(file, "index.html");
      if (fs.existsSync(dirIndex)) return send(res, 200, fs.readFileSync(dirIndex), TYPES[".html"]);
      return send(res, 404, "Not found", "text/plain");
    }
    send(res, 200, fs.readFileSync(file), TYPES[path.extname(file)] || "application/octet-stream");
});

// If the port is busy (another tool running), try the next few ports.
let port = PORT;
server.on("error", (err) => {
  if (err.code === "EADDRINUSE" && port < PORT + 10) {
    console.log(`Port ${port} is busy, trying ${port + 1}...`);
    port += 1;
    server.listen(port);
  } else {
    console.error("Could not start the server:", err.message);
    process.exit(1);
  }
});
server.on("listening", () => {
  const url = `http://localhost:${port}/creator-tools/`;
  console.log(`Creator Tools: ${count} pages built.`);
  console.log(`Open ${url}`);
  console.log(`YouTube key: ${env("YOUTUBE_API_KEY") || env("GOOGLE_API_KEY") ? "set" : "not set (live YouTube tools disabled)"}`);
  console.log(`Twitch app:  ${env("TWITCH_CLIENT_ID") ? "set" : "not set (live Twitch tools disabled)"}`);
  if (process.argv.includes("--open")) {
    require("child_process").exec(`start "" "${url}"`);
  }
});
server.listen(port);
