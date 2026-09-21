// Generates the Passive Array site pages from tools.js.
//
//   node creator-tools/build-tools.js            -> writes into creator-tools/.out (tools only, for server.js)
//   require("./creator-tools/build-tools").buildInto(dir)   tools hub + 35 tool pages (used by the root build.js)
//   require("./creator-tools/build-tools").homePage()       the site home page HTML
//
// Output layout (relative to the target folder):
//   index.html               the tools directory with filters
//   shared.css, shared.js, site.js
//   <slug>/index.html        one page per tool

const fs = require("fs");
const path = require("path");
const { tools } = require("./tools");

const HERE = __dirname;
// Netlify sets URL to the site's primary address at build time. Change the fallback when the domain is live.
const SITE = (process.env.URL || "https://passivearray.com").replace(/\/$/, "");
const BRAND = "Passive Array";
const TAGLINE = "Free tools for creators and brands";

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ------------------------------------------------------------------ shared chrome */
const MARK = (id) => `<svg viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="7" y1="7" x2="113" y2="113"><stop offset="0" stop-color="#2A9D8F"/><stop offset="1" stop-color="#5B6ABF"/></linearGradient></defs>${[0, 1, 2].map((r) => [0, 1, 2].map((c) => (r === 2 && c === 2 ? `<circle cx="98" cy="98" r="15" fill="#8FD3C7"/>` : `<rect x="${7 + c * 38}" y="${7 + r * 38}" width="30" height="30" rx="7" fill="url(#${id})"/>`)).join("")).join("")}</svg>`;

const ICON = {
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`,
  arrow: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
  compare: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="10" width="5" height="10" rx="1"/><rect x="10" y="4" width="5" height="16" rx="1"/><rect x="17" y="13" width="4" height="7" rx="1"/></svg>`,
  money: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h3.75a1.75 1.75 0 0 1 0 3.5H10.5a1.75 1.75 0 0 0 0 3.5H15"/></svg>`,
  create: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3"/></svg>`,
};

// <head> lines for favicons and the link preview image. Files are copied to the site root by build.js.
const HEAD = `<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#1F2A44">
<meta property="og:image" content="${SITE}/og-image-1200x630.png">
<meta name="twitter:card" content="summary_large_image">`;

function header(root, active, withSearch) {
  const link = (href, label, key) => `<a href="${root}${href}"${active === key ? ' class="active"' : ""}>${label}</a>`;
  return `<header class="site-header"><div class="wrap">
  <a class="brand" href="${root}" aria-label="${BRAND} home">${MARK("m" + Math.random().toString(36).slice(2, 6))}<span>Passive <b>Array</b></span></a>
  ${withSearch ? `<form class="hsearch" data-search role="search">${ICON.search}<label for="hq" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);margin:0">Check a channel</label><input id="hq" type="text" placeholder="Check a channel: @handle, link or twitch.tv/name" autocomplete="off"><button type="submit">Check</button></form>` : ""}
  <nav class="nav">${link("creator-tools/", "All tools", "tools")}${link("creator-tools/#compare", "Compare", "compare")}${link("creator-tools/#create", "Generators", "create")}${link("#web-tools", "Web tools", "web")}</nav>
  <button type="button" class="iconbtn" data-theme-toggle aria-label="Switch to dark mode">${ICON.moon}</button>
</div></header>`;
}

function footer(root, note) {
  return `<footer class="site-footer"><div class="wrap">
  <span>${esc(note || "Estimates use public numbers and typical industry rates. A starting point, not a guarantee.")}</span>
  <nav><a href="${root}creator-tools/">All tools</a><a href="${root}#web-tools">Web tools</a><a href="https://squareko.com" rel="noopener">Built by Squareko</a></nav>
</div></footer>`;
}

/* ------------------------------------------------------------------ tool metadata */
const INTENTS = {
  check: { label: "Check an account", sub: "Live data for YouTube and Twitch, typed numbers for the rest", icon: "check" },
  compare: { label: "Compare", sub: "Two or three accounts side by side, leader marked on every row", icon: "compare" },
  estimate: { label: "Estimate money or price", sub: "Always a range, with the formula on the page", icon: "money" },
  fake: { label: "Spot fakes", sub: "Suspicion scores from the numbers on a profile", icon: "check" },
  find: { label: "Find creators", sub: "Search YouTube by niche, country or a channel you already like", icon: "check" },
  create: { label: "Create content", sub: "Hashtags, bios, ideas and a growth plan", icon: "create" },
};
function intentOf(t) {
  if (t.api === "ai") return "create";
  if (t.compare || t.action === "compare") return "compare";
  if (/fake/.test(t.slug)) return "fake";
  if (/find|search|lookalike/.test(t.slug)) return "find";
  if (/money|pricing|sponsorship|emv/.test(t.slug)) return "estimate";
  return "check";
}
const isLive = (t) => t.api === "youtube" || t.api === "twitch";
const PLATFORMS = ["YouTube", "Instagram", "TikTok", "Twitch", "X"];
const PLAT_COLOR = { YouTube: "#CC0000", Instagram: "#C13584", TikTok: "#1F2A44", Twitch: "#6441A5", X: "#5A6478" };

function toolCard(t, root) {
  return `<a class="card" href="${root}creator-tools/${t.slug}/" data-intent="${intentOf(t)}" data-platform="${t.platform}"><span class="tagline"><span class="plat ${t.platform}">${t.platform.toUpperCase()}</span>${isLive(t) ? '<span class="live">LIVE</span>' : ""}</span><h3>${esc(t.name)}</h3><p>${esc(t.short)}</p></a>`;
}

/* ------------------------------------------------------------------ form fields */
function fieldHtml(f, prefix = "", wide = false) {
  const id = prefix + f.id;
  const hint = f.hint ? `<span class="hint">${esc(f.hint)}</span>` : "";
  const req = f.optional ? "" : " required";
  let control;
  if (f.type === "select") {
    const opts = (f.options || []).map(([v, l]) => `<option value="${esc(v)}"${String(f.value ?? "") === String(v) ? " selected" : ""}>${esc(l)}</option>`).join("");
    control = `<select id="${id}" name="${id}">${opts}</select>`;
  } else if (f.type === "textarea") {
    control = `<textarea id="${id}" name="${id}" rows="${f.rows || 6}" placeholder="${esc(f.placeholder || "")}"${req}></textarea>`;
  } else {
    const attrs = [
      `type="${f.type === "number" ? "number" : "text"}"`, `id="${id}"`, `name="${id}"`,
      f.placeholder != null ? `placeholder="${esc(f.placeholder)}"` : "",
      f.value != null ? `value="${esc(f.value)}"` : "",
      f.min != null ? `min="${f.min}"` : "", f.max != null ? `max="${f.max}"` : "",
      f.step != null ? `step="${f.step}"` : f.type === "number" ? `step="any"` : "",
      f.type === "number" ? `inputmode="decimal"` : "", req.trim(),
    ].filter(Boolean).join(" ");
    control = `<input ${attrs}>`;
  }
  return `<div class="field${wide || f.type === "textarea" ? " wide" : ""}"><label for="${id}">${esc(f.label)}</label>${hint}${control}</div>`;
}

function formHtml(t) {
  if (t.compare) {
    const cols = t.compare.labels.map((label, i) => {
      const prefix = "abc"[i] + "_";
      const optional = i === 2;
      const fields = t.compare.fields.map((f) => fieldHtml(optional ? { ...f, optional: true } : f, prefix)).join("");
      return `<div class="col"><h3>${esc(label)}${optional ? ' <span class="hint" style="display:inline">optional</span>' : ""}</h3>${fields}</div>`;
    }).join("");
    return `<div class="cols">${cols}</div>`;
  }
  const inputs = t.inputs || [];
  // The first text input (the channel or topic) spans the full row when there are other fields.
  return `<div class="fields">${inputs.map((f, i) => fieldHtml(f, "", i === 0 && inputs.length > 1 && f.type === "text")).join("")}</div>`;
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
    "@context": "https://schema.org", "@type": "WebApplication", name: t.name, description: t.short, url,
    applicationCategory: "UtilitiesApplication", operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    provider: { "@type": "Organization", name: BRAND, url: SITE },
  });
}

/* ------------------------------------------------------------------ tool page */
function toolPage(template, t) {
  const root = "../../";
  const url = `${SITE}/creator-tools/${t.slug}/`;
  const same = tools.filter((o) => o.platform === t.platform && o.slug !== t.slug);
  const siblings = same.slice(0, 3).map((o) => `<a href="../${o.slug}/">${esc(o.name.replace(/^(YouTube|Instagram|TikTok|Twitch|X \(Twitter\)) /, ""))}</a>`).join("");
  const nextList = [
    ...same.filter((o) => intentOf(o) !== intentOf(t)).slice(0, 3),
    ...tools.filter((o) => o.platform !== t.platform && intentOf(o) === intentOf(t)).slice(0, 1),
  ].slice(0, 4).map((o) => `<a href="../${o.slug}/">${esc(o.short)} <b>${esc(INTENTS[intentOf(o)].label.split(" ")[0])}</b></a>`).join("");
  const clientTool = {
    slug: t.slug, name: t.name, platform: t.platform, api: t.api || null, action: t.action || null,
    compare: t.compare ? { labels: t.compare.labels, fields: t.compare.fields.map((f) => ({ id: f.id, label: f.label, type: f.type })) } : null,
    inputs: (t.inputs || []).map((f) => ({ id: f.id, label: f.label, type: f.type, optional: !!f.optional })),
  };
  return template
    .replace(/{{root}}/g, root)
    .replace(/{{name}}/g, esc(t.name))
    .replace(/{{short}}/g, esc(t.short))
    .replace(/{{intro}}/g, esc(t.intro))
    .replace(/{{platform}}/g, esc(t.platform))
    .replace(/{{platformSlug}}/g, esc(t.platform))
    .replace(/{{canonical}}/g, url)
    .replace("{{head}}", HEAD)
    .replace("{{header}}", header(root, "tools", true))
    .replace("{{footer}}", footer(root, `Data for live tools comes from the official ${t.platform === "Twitch" ? "Twitch" : "YouTube"} API. Estimates are a starting point, not a guarantee.`))
    .replace("{{jsonld}}", jsonLd(t, url))
    .replace("{{form}}", formHtml(t))
    .replace("{{button}}", buttonLabel(t))
    .replace("{{siblings}}", siblings)
    .replace("{{how}}", (t.how || []).map((h) => `<li>${esc(h)}</li>`).join(""))
    .replace("{{next}}", nextList)
    .replace("{{tooljson}}", JSON.stringify(clientTool).replace(/</g, "\\u003c"));
}

/* ------------------------------------------------------------------ directory (creator-tools/index.html) */
function directoryPage() {
  const root = "../";
  const fbtn = (filter, value, label, on, dot) => `<button type="button" class="fbtn${on ? " on" : ""}" data-filter="${filter}" data-value="${esc(value)}">${dot ? `<i style="background:${dot}"></i>` : ""}${esc(label)}</button>`;
  const groups = Object.entries(INTENTS).map(([key, meta]) => {
    const list = tools.filter((t) => intentOf(t) === key);
    if (!list.length) return "";
    return `<section class="group" id="${key}"><h2>${esc(meta.label)} <span class="sub">${esc(meta.sub)}</span></h2><div class="grid c4">${list.map((t) => toolCard(t, root)).join("")}</div></section>`;
  }).join("");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>All ${tools.length} Creator Tools | ${BRAND}</title>
<meta name="description" content="${tools.length} free tools for creators and brands: engagement rate calculators, money and pricing calculators, fake follower checks, audits, comparisons, influencer finders and content generators.">
<link rel="canonical" href="${SITE}/creator-tools/">
<meta property="og:title" content="All ${tools.length} Creator Tools | ${BRAND}">
<meta property="og:description" content="${TAGLINE}: YouTube, Instagram, TikTok, Twitch and X.">
${HEAD}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="shared.css">
<script>try{var t=localStorage.getItem("pa-theme");if(t)document.documentElement.setAttribute("data-theme",t);}catch(e){}</script>
</head>
<body data-root="${root}">
${header(root, "tools", true)}
<main class="wrap" data-directory>
  <div class="tool-head">
    <div>
      <div class="crumbs"><a href="${root}">Home</a> / All tools</div>
      <h1>All ${tools.length} tools</h1>
      <p class="intro">Pick by what you want to do, or by platform. Every tool is free and needs no account.</p>
    </div>
    <div class="search-row">${ICON.search}<label for="dq" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);margin:0">Search tools</label><input id="dq" type="search" placeholder="Search tools: engagement, money, fake, compare"></div>
  </div>
  <div class="filters">
    <div class="row"><span class="lbl">I want to</span>${fbtn("intent", "all", "Everything", true)}${Object.entries(INTENTS).map(([k, m]) => fbtn("intent", k, m.label)).join("")}</div>
    <div class="row"><span class="lbl">Platform</span>${fbtn("platform", "all", "All", true)}${PLATFORMS.map((p) => fbtn("platform", p, `${p} · ${tools.filter((t) => t.platform === p).length}`, false, PLAT_COLOR[p])).join("")}</div>
  </div>
  ${groups}
  <p class="empty" style="display:none">No tool matches. Clear a filter or try another word.</p>
</main>
${footer(root)}
<script src="site.js"></script>
</body>
</html>`;
}

/* ------------------------------------------------------------------ home (dist/index.html) */
const WEB_TOOLS = [
  ["domain-finder/", "Domain Finder", "Type a name idea and see which domains are free to buy right now."],
  ["domain-age-checker/", "Domain Age Checker", "Find out when a domain was first registered and how old it is."],
  ["plagiarism-checker/", "Plagiarism Checker", "Paste text, upload a file or enter a URL. Each sentence is marked plagiarised or unique."],
  ["jpg-to-pdf/", "JPG to PDF Converter", "Turn images into a PDF. Everything happens in your browser."],
  ["seo-roi-calculator/", "SEO ROI Calculator", "Estimate the traffic, conversions and revenue first-page rankings could bring."],
];

function homePage() {
  const root = "";
  const count = (fn) => tools.filter(fn).length;
  const popular = ["youtube-money-calculator", "instagram-engagement-rate-calculator", "tiktok-fake-follower-checker", "twitch-channel-comparison", "youtube-sponsorship-price-calculator", "instagram-hashtag-generator", "youtube-channel-quality-checker", "instagram-pricing-calculator"]
    .map((s) => tools.find((t) => t.slug === s)).filter(Boolean);
  const intentCard = (key, iconCls, text, countText, href) => `<a class="card intent" href="${href}"><span class="ic ${iconCls}">${ICON[INTENTS[key].icon]}</span><h3>${esc(INTENTS[key].label)}</h3><p>${esc(text)}</p><span class="count">${esc(countText)}</span></a>`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${BRAND}: Free Tools for Creators and Brands</title>
<meta name="description" content="Check any YouTube or Twitch channel in seconds, then compare, price and grow. ${tools.length} free creator tools plus web tools for domains, plagiarism and SEO. No sign-up.">
<link rel="canonical" href="${SITE}/">
<meta property="og:title" content="${BRAND}: ${TAGLINE}">
<meta property="og:description" content="Check any creator in seconds. Then know what to do next.">
${HEAD}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="creator-tools/shared.css">
<script>try{var t=localStorage.getItem("pa-theme");if(t)document.documentElement.setAttribute("data-theme",t);}catch(e){}</script>
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: BRAND, url: SITE + "/", description: TAGLINE, potentialAction: { "@type": "SearchAction", target: SITE + "/creator-tools/youtube-subscriber-count-checker/?channel={search_term_string}", "query-input": "required name=search_term_string" } })}</script>
</head>
<body data-root="${root}">
${header(root, "home", false)}
<main class="wrap">
  <section class="hero">
    <span class="eyebrow"><i></i>Free. No sign-up. Live data from official APIs.</span>
    <h1>Check any creator in seconds.<br class="desk-br">Then know what to do next.</h1>
    <p>Paste a channel link or handle. Get subscribers, engagement, earnings and a quality grade on one calm page, then compare, price or grow from there.</p>
    <form class="bigsearch" data-search role="search">
      ${ICON.search}
      <label for="q" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);margin:0">Channel link, handle or name</label>
      <input id="q" type="text" placeholder="@mkbhd, youtube.com/@veritasium or twitch.tv/shroud" autocomplete="off" autofocus>
      <button type="submit" class="btn">Check ${ICON.arrow}</button>
    </form>
    <div class="tryline">
      <span>Works with</span><span class="chip">YouTube</span><span class="chip">Twitch</span><span class="chip" style="color:var(--muted)">Instagram, TikTok, X by numbers</span>
      <span style="margin-left:8px">Try:</span>
      <a href="creator-tools/youtube-subscriber-count-checker/?channel=%40mkbhd">@mkbhd</a>
      <a href="creator-tools/youtube-subscriber-count-checker/?channel=%40veritasium">@veritasium</a>
      <a href="creator-tools/twitch-follower-count-checker/?login=shroud">shroud</a>
    </div>
  </section>

  <section class="section">
    <div class="grid c4">
      ${intentCard("check", "", "Subscribers, views, engagement rate and a quality grade from the last 10 uploads.", `${count((t) => intentOf(t) === "check")} tools, ${count(isLive)} with live data`, "creator-tools/#check")}
      ${intentCard("compare", "indigo", "Two or three creators side by side with the leader marked on every row.", `${count((t) => intentOf(t) === "compare")} comparison tools`, "creator-tools/#compare")}
      ${intentCard("estimate", "", "Ad earnings, sponsorship rates and earned media value, always shown as a range.", `${count((t) => intentOf(t) === "estimate")} calculators`, "creator-tools/#estimate")}
      ${intentCard("create", "indigo", "Hashtag sets, bios, twelve post ideas and a growth plan built from your numbers.", `${count((t) => intentOf(t) === "create")} generators, ${count((t) => intentOf(t) === "fake")} fake-follower checks`, "creator-tools/#create")}
    </div>
  </section>

  <section class="section">
    <div class="dark-band">
      <div><span class="k">NO WALLS</span><h3>Every tool works without an account</h3><p>Other sites gate the useful number behind a sign-up. Here the result loads first and stays free.</p></div>
      <div><span class="k">HONEST NUMBERS</span><h3>Ranges, not fake precision</h3><p>Earnings and prices show a low and a high, with the formula one tap away. Live data comes from the official YouTube and Twitch APIs.</p></div>
      <div><span class="k">ONE CALM PAGE</span><h3>Built for a quick look, not a dashboard</h3><p>The big number first, the grade beside it, then detail as you scroll. No banner ads between you and the answer.</p></div>
    </div>
  </section>

  <section class="section">
    <div class="section-head"><h2>Most used tools</h2><a href="creator-tools/">All ${tools.length} tools</a></div>
    <div class="grid c4">${popular.map((t) => toolCard(t, root)).join("")}</div>
  </section>

  <section class="section" id="web-tools">
    <div class="section-head"><h2>Web tools</h2><span class="sub">For websites, domains and content</span></div>
    <div class="grid c3">${WEB_TOOLS.map(([href, name, text]) => `<a class="card" href="${href}"><h3>${esc(name)}</h3><p>${esc(text)}</p></a>`).join("")}</div>
  </section>
</main>
${footer(root)}
<script src="creator-tools/site.js"></script>
</body>
</html>`;
}

/* ------------------------------------------------------------------ build */
function buildInto(outDir) {
  const template = fs.readFileSync(path.join(HERE, "template.html"), "utf8");
  fs.mkdirSync(outDir, { recursive: true });
  for (const asset of ["shared.css", "shared.js", "site.js"]) fs.copyFileSync(path.join(HERE, "public", asset), path.join(outDir, asset));
  fs.writeFileSync(path.join(outDir, "index.html"), directoryPage());
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

module.exports = { buildInto, homePage, tools, SITE };

if (require.main === module) {
  const out = path.join(HERE, ".out");
  fs.rmSync(out, { recursive: true, force: true });
  const count = buildInto(out);
  fs.writeFileSync(path.join(out, "home.html"), homePage());
  console.log(`Passive Array: ${count} tool pages + directory written to ${out}`);
}
