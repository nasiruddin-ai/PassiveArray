// Domain Finder - tiny local server with no dependencies.
// Run with:  node server.js   (or double-click Start.bat)
//
// It does two things:
//   1. Serves public/index.html (the page you see in the browser)
//   2. Answers /api/check?domain=example.com using lib/check.js
//
// The same lib/check.js also powers the Netlify version (netlify/functions/check.mjs).

const http = require("http");
const fs = require("fs");
const path = require("path");
const { handleCheckRequest, loadBootstrap } = require("./lib/check");

const PORT = process.env.PORT || 3200;
const HTML_FILE = path.join(__dirname, "public", "index.html");

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/api/check") {
    const { code, body } = await handleCheckRequest(url.searchParams.get("domain"));
    res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    return res.end(JSON.stringify(body));
  }

  if (url.pathname === "/" || url.pathname === "/index.html") {
    fs.readFile(HTML_FILE, (err, buf) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("public/index.html is missing");
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(buf);
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

server.listen(PORT, () => {
  loadBootstrap(); // warm up the registry list so the first search is fast
  console.log("");
  console.log("  Domain Finder is running.");
  console.log("  Open this in your browser:  http://localhost:" + PORT);
  console.log("  Press Ctrl+C in this window to stop it.");
  console.log("");
});
