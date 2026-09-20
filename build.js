// Builds the "dist" folder that Netlify publishes.
// Run with:  node build.js
//
// It copies each tool's page into dist/<tool-folder>/index.html and the
// home page (home.html) into dist/index.html. The Creator Tools pack is
// generated from creator-tools/tools.js into dist/creator-tools/. Nothing else
// is published; server code stays private and the Netlify Functions in
// netlify/functions provide the /api routes on Netlify.
//
// To add a tool to the site, add a line to TOOLS below and a card to home.html.

const fs = require("fs");
const path = require("path");

// folder name -> path of the page to publish (relative to that folder)
const TOOLS = {
  "domain-finder": "public/index.html",
  "domain-age-checker": "index.html",
  "plagiarism-checker": "index.html",
  "jpg-to-pdf": "index.html",
  "seo-roi-calculator": "index.html",
};

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

fs.copyFileSync(path.join(ROOT, "home.html"), path.join(DIST, "index.html"));
console.log("home.html -> dist/index.html");

for (const [folder, page] of Object.entries(TOOLS)) {
  const src = path.join(ROOT, folder, page);
  if (!fs.existsSync(src)) {
    console.error("MISSING: " + src);
    process.exit(1);
  }
  const outDir = path.join(DIST, folder);
  fs.mkdirSync(outDir, { recursive: true });
  fs.copyFileSync(src, path.join(outDir, "index.html"));
  console.log(folder + "/" + page + " -> dist/" + folder + "/index.html");
}

// Creator Tools: many pages generated from one list.
const creatorTools = require("./creator-tools/build-tools.js");
const creatorCount = creatorTools.buildInto(path.join(DIST, "creator-tools"));
console.log("creator-tools/tools.js -> dist/creator-tools/ (" + creatorCount + " tool pages + hub)");

console.log("Build done.");
