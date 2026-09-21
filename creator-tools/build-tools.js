// Generates the Creator Tools pages from tools.js.
//
//   node creator-tools/build-tools.js            -> writes into creator-tools/.out
//   require("./creator-tools/build-tools").buildInto(dir)  (used by the root build.js)
//
// Output layout (relative to the target folder):
//   index.html               the hub listing every tool
//   shared.css, shared.js    copied from creator-tools/public/
//   <slug>/index.html        one page per tool

const fs = require("fs");
const path = require("path");
const { tools } = require("./tools");

const HERE = __dirname;
const SITE = "https://tools.squareko.com"; // used for canonical links; change when the domain is known

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function fieldHtml(f, prefix = "") {
  const id = prefix + f.id;
  const hint = f.hint ? `<span class="hint">${esc(f.hint)}</span>` : "";
  const req = f.optional ? "" : " required";
  let control;
  if (f.type === "select") {
    const opts = (f.options || [])
      .map(([v, l]) => `<option value="${esc(v)}"${String(f.value ?? "") === String(v) ? " selected" : ""}>${esc(l)}</option>`)
      .join("");
    control = `<select id="${id}" name="${id}">${opts}</select>`;
  } else if (f.type === "textarea") {
    control = `<textarea id="${id}" name="${id}" rows="${f.rows || 6}" placeholder="${esc(f.placeholder || "")}"${req}></textarea>`;
  } else {
    const attrs = [
      `type="${f.type === "number" ? "number" : "text"}"`,
      `id="${id}"`,
      `name="${id}"`,
      f.placeholder != null ? `placeholder="${esc(f.placeholder)}"` : "",
      f.value != null ? `value="${esc(f.value)}"` : "",
      f.min != null ? `min="${f.min}"` : "",
      f.max != null ? `max="${f.max}"` : "",
      f.step != null ? `step="${f.step}"` : f.type === "number" ? `step="any"` : "",
      f.type === "number" ? `inputmode="decimal"` : "",
      req.trim(),
    ]
      .filter(Boolean)
      .join(" ");
    control = `<input ${attrs}>`;
  }
  return `<div class="field"><label for="${id}">${esc(f.label)}</label>${hint}${control}</div>`;
}

function formHtml(t) {
  if (t.compare) {
    const cols = t.compare.labels
      .map((label, i) => {
        const prefix = "abc"[i] + "_";
        const optional = i === 2;
        const fields = t.compare.fields.map((f) => fieldHtml(optional ? { ...f, optional: true } : f, prefix)).join("");
        return `<div class="col"><h3>${esc(label)}${optional ? " <small class=\"hint\">optional</small>" : ""}</h3>${fields}</div>`;
      })
      .join("");
    return `<div class="cols">${cols}</div>`;
  }
  return (t.inputs || []).map((f) => fieldHtml(f)).join("");
}

function buttonLabel(t) {
  if (t.compare || t.action === "compare") return "Compare";
  if (t.action === "search" || t.action === "lookalike") return "Find channels";
  if (t.api === "ai") return "Generate";
  if (t.api) return "Check";
  return "Calculate";
}

function jsonLd(t, url) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t.name,
    description: t.short,
    url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    provider: { "@type": "Organization", name: "Squareko", url: "https://squareko.com" },
  });
}

function relatedHtml(t) {
  return tools
    .filter((o) => o.platform === t.platform && o.slug !== t.slug)
    .slice(0, 6)
    .map((o) => `<a class="tool" href="../${o.slug}/"><h3>${esc(o.name)}</h3><p>${esc(o.short)}</p></a>`)
    .join("");
}

function toolPage(template, t) {
  const url = `${SITE}/creator-tools/${t.slug}/`;
  const clientTool = {
    slug: t.slug,
    name: t.name,
    platform: t.platform,
    api: t.api || null,
    action: t.action || null,
    compare: t.compare ? { labels: t.compare.labels, fields: t.compare.fields.map((f) => ({ id: f.id, label: f.label, type: f.type })) } : null,
    inputs: (t.inputs || []).map((f) => ({ id: f.id, label: f.label, type: f.type, optional: !!f.optional })),
  };
  return template
    .replace(/{{name}}/g, esc(t.name))
    .replace(/{{short}}/g, esc(t.short))
    .replace(/{{intro}}/g, esc(t.intro))
    .replace(/{{platform}}/g, esc(t.platform))
    .replace(/{{canonical}}/g, url)
    .replace("{{jsonld}}", jsonLd(t, url))
    .replace("{{form}}", formHtml(t))
    .replace("{{button}}", buttonLabel(t))
    .replace("{{how}}", (t.how || []).map((h) => `<li>${esc(h)}</li>`).join(""))
    .replace("{{related}}", relatedHtml(t))
    .replace("{{tooljson}}", JSON.stringify(clientTool).replace(/</g, "\\u003c"));
}

const PLATFORM_ORDER = ["YouTube", "Instagram", "TikTok", "Twitch", "X"];

function hubPage() {
  const sections = PLATFORM_ORDER.map((p) => {
    const cards = tools
      .filter((t) => t.platform === p)
      .map((t) => `<a class="tool" href="${t.slug}/" data-name="${esc(t.name.toLowerCase())}"><h3>${esc(t.name)}</h3><p>${esc(t.short)}</p></a>`)
      .join("");
    return `<div class="section" data-platform="${p}"><h2>${p} <span class="badge ${p}">${tools.filter((t) => t.platform === p).length} tools</span></h2><div class="tools">${cards}</div></div>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Free Creator Tools for YouTube, Instagram, TikTok, Twitch and X | Squareko</title>
<meta name="description" content="${tools.length} free tools for creators and brands: engagement rate calculators, money and pricing calculators, fake follower checks, audits, channel comparisons, influencer finders and content generators.">
<link rel="canonical" href="${SITE}/creator-tools/">
<link rel="stylesheet" href="shared.css">
</head>
<body>
<div class="wrap">
  <div class="crumbs"><a href="../">Squareko Tools</a> / Creator Tools</div>
  <h1>Creator Tools</h1>
  <p class="sub">${tools.length} free tools for creators, brands and agencies. Live data for YouTube and Twitch, quick calculators for Instagram, TikTok and X, and generators for hashtags, bios and content ideas. No sign-up.</p>
  <div class="search"><input type="search" id="q" placeholder="Search tools, for example: engagement, money, fake, compare"></div>
  ${sections}
  <p class="foot">Estimates use public numbers and typical industry rates. Built by <a href="https://squareko.com">Squareko</a>.</p>
</div>
<script>
  var q = document.getElementById("q");
  q.addEventListener("input", function () {
    var v = q.value.trim().toLowerCase();
    document.querySelectorAll("a.tool").forEach(function (a) {
      a.style.display = !v || a.dataset.name.indexOf(v) !== -1 || a.textContent.toLowerCase().indexOf(v) !== -1 ? "" : "none";
    });
    document.querySelectorAll(".section").forEach(function (s) {
      s.style.display = Array.prototype.some.call(s.querySelectorAll("a.tool"), function (a) { return a.style.display !== "none"; }) ? "" : "none";
    });
  });
</script>
</body>
</html>`;
}

function buildInto(outDir) {
  const template = fs.readFileSync(path.join(HERE, "template.html"), "utf8");
  fs.mkdirSync(outDir, { recursive: true });
  for (const asset of ["shared.css", "shared.js"]) {
    fs.copyFileSync(path.join(HERE, "public", asset), path.join(outDir, asset));
  }
  fs.writeFileSync(path.join(outDir, "index.html"), hubPage());
  const seen = new Set();
  for (const t of tools) {
    if (seen.has(t.slug)) throw new Error("Duplicate tool slug: " + t.slug);
    seen.add(t.slug);
    const dir = path.join(outDir, t.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), toolPage(template, t));
  }
  return tools.length;
}

module.exports = { buildInto, tools };

if (require.main === module) {
  const out = path.join(HERE, ".out");
  fs.rmSync(out, { recursive: true, force: true });
  const count = buildInto(out);
  console.log(`Creator Tools: ${count} pages written to ${out}`);
}
