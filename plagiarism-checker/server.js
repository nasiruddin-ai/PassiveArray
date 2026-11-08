// Plagiarism Checker - small local server with no dependencies.
// Run with:  node server.js   (or double-click Start.bat)
//
// Endpoints:
//   GET  /                 the web page (index.html)
//   GET  /api/status       tells the page whether a search API key is configured
//   POST /api/check        { text, excludeUrl }  -> checks each sentence against the web (needs Google key)
//   POST /api/compare      { textA, textB }      -> compares two texts locally (no key needed)
//   POST /api/fetch-url    { url }               -> downloads a web page and returns its plain text
//
// All the logic lives in lib/plagiarism.js, which the Netlify version also uses.

const http = require("http");
const fs = require("fs");
const path = require("path");
const lib = require("./lib/plagiarism");

const PORT = process.env.PORT || lib.config.port;
const HTML_FILE = path.join(__dirname, "index.html");

function readBody(req, limit = 2 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error("Request too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {});
      } catch (_) {
        reject(new Error("Body must be JSON"));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(obj));
}

async function route(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const p = url.pathname;

  if (req.method === "GET" && (p === "/" || p === "/index.html")) {
    fs.readFile(HTML_FILE, (err, buf) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("index.html is missing next to server.js");
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(buf);
    });
    return;
  }

  if (req.method === "GET" && p === "/api/status") {
    const { code, body } = await lib.handleRequest("status");
    return sendJson(res, code, body);
  }

  if (req.method === "POST" && (p === "/api/compare" || p === "/api/check" || p === "/api/fetch-url")) {
    const action = p.slice("/api/".length);
    const { code, body } = await lib.handleRequest(action, await readBody(req));
    return sendJson(res, code, body);
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
}

const server = http.createServer((req, res) => {
  route(req, res).catch((err) => sendJson(res, 500, { ok: false, error: err.message || "Server error" }));
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log("");
    console.log("  Plagiarism Checker is running.");
    console.log("  Open this in your browser:  http://localhost:" + PORT);
    console.log("  Web check (Google search): " + (lib.webConfigured() ? "ENABLED" : "not set up - see README.md (compare mode still works)"));
    console.log("  Press Ctrl+C in this window to stop it.");
    console.log("");
  });
}

module.exports = Object.assign({ server }, lib);
