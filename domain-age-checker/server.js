// Domain Age Checker - tiny local server with no dependencies.
// Run with:  node server.js   (or double-click Start.bat)
//
// It does two things:
//   1. Serves index.html (the page you see in the browser)
//   2. Answers /api/age?domain=example.com using lib/age.js
//
// The same lib/age.js also powers the Netlify version (see ../netlify/functions/domain-age.mjs).

const http = require("http");
const fs = require("fs");
const path = require("path");
const { handleAgeRequest } = require("./lib/age");

const PORT = process.env.PORT || 3000;
const HTML_FILE = path.join(__dirname, "index.html");

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/api/age") {
    const { code, body } = await handleAgeRequest(url.searchParams.get("domain"));
    res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    return res.end(JSON.stringify(body));
  }

  if (url.pathname === "/" || url.pathname === "/index.html") {
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

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log("");
  console.log("  Domain Age Checker is running.");
  console.log("  Open this in your browser:  http://localhost:" + PORT);
  console.log("  Press Ctrl+C in this window to stop it.");
  console.log("");
});
