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
// Netlify sets URL, Vercel sets VERCEL_PROJECT_PRODUCTION_URL (host only). SITE_URL overrides both.
// Change the fallback when the real domain is live.
const SITE = (
  process.env.SITE_URL ||
  process.env.URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL : "") ||
  "https://passivearray.com"
).replace(/\/$/, "");
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
  chev: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`,
  create: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3"/></svg>`,
};

// <head> lines for favicons and the link preview image. Files are copied to the site root by build.js.
// Google Search Console verification. The same tag goes on every page, including
// the standalone web tools (build.js injects it there). Replace the token if the
// property is ever re-verified; an empty string leaves the tag out.
const GOOGLE_VERIFICATION = "iEH5a0QzRXb2Kg7UB2k-xXTEPeNOa-NQFCKFZ8pfG8Q";
const VERIFY_TAG = GOOGLE_VERIFICATION ? `<meta name="google-site-verification" content="${GOOGLE_VERIFICATION}">` : "";

const HEAD = `${VERIFY_TAG}
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#1F2A44">
<meta property="og:image" content="${SITE}/og-image-1200x630.png">
<meta name="twitter:card" content="summary_large_image">`;

// The tools mega-menu. Built from the tool list so it can never drift out of
// date, and grouped the way people arrive: by what they are trying to do.
function megaMenu(root) {
  const bySlug = (s) => tools.find((t) => t.slug === s);
  const col = (title, slugs, more) => `<div class="mcol"><h4>${esc(title)}</h4>${
    slugs.map((s) => {
      const t = bySlug(s);
      return t ? `<a href="${root}creator-tools/${t.slug}/">${esc(t.name.replace(/^YouTube /, ""))}</a>` : "";
    }).join("")
  }${more ? `<a class="mmore" href="${root}${more[0]}">${esc(more[1])}</a>` : ""}</div>`;

  return `<div class="mega" id="mega-tools" hidden>
    <div class="wrap mgrid">
      ${col("Check a channel", ["youtube-subscriber-count-checker", "youtube-engagement-rate-calculator", "youtube-channel-quality-checker", "youtube-channel-comparison", "twitch-follower-count-checker"], ["creator-tools/#check", "All checkers"])}
      ${col("Create content", ["youtube-title-generator", "youtube-description-generator", "youtube-video-ideas-generator", "youtube-script-outline-generator", "youtube-channel-name-generator", "youtube-thumbnail-downloader"], ["creator-tools/#create", "All generators"])}
      ${col("Rank on YouTube", ["youtube-keyword-generator", "youtube-tag-generator", "youtube-title-analyzer", "youtube-niche-finder", "youtube-hashtag-generator"], ["creator-tools/#rank", "All SEO tools"])}
      ${col("Money and pricing", ["youtube-money-calculator", "youtube-sponsorship-price-calculator", "instagram-pricing-calculator", "tiktok-money-calculator", "instagram-emv-calculator"], ["creator-tools/#estimate", "All calculators"])}
      <div class="mcol">
        <h4>Other platforms</h4>
        <a href="${root}creator-tools/#Instagram">Instagram tools</a>
        <a href="${root}creator-tools/#TikTok">TikTok tools</a>
        <a href="${root}creator-tools/#Twitch">Twitch tools</a>
        <a href="${root}creator-tools/#X">X tools</a>
        <a href="${root}#web-tools">Web and domain tools</a>
        <a class="mmore" href="${root}creator-tools/">View all ${tools.length} tools</a>
      </div>
    </div>
    <div class="mfoot"><div class="wrap">
      <span><b>Every tool is free.</b> No account, no credit card, no trial that expires.</span>
      <a href="${root}compare/">See how that compares with vidIQ and TubeBuddy</a>
    </div></div>
  </div>`;
}

function header(root, active, withSearch) {
  const link = (href, label, key) => `<a href="${root}${href}"${active === key ? ' class="active"' : ""}>${label}</a>`;
  return `<header class="site-header"><div class="wrap">
  <a class="brand" href="${root}" aria-label="${BRAND} home">${MARK("m" + Math.random().toString(36).slice(2, 6))}<span>Passive <b>Array</b></span></a>
  ${withSearch ? `<form class="hsearch" data-search role="search">${ICON.search}<label for="hq" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);margin:0">Check a channel</label><input id="hq" type="text" placeholder="Paste a link or @handle" autocomplete="off"><button type="submit">Check</button></form>` : ""}
  <nav class="nav" id="site-nav">
    <button type="button" class="navbtn${active === "tools" ? " active" : ""}" data-mega="mega-tools" aria-expanded="false" aria-controls="mega-tools">Tools ${ICON.chev}</button>
    ${link("youtube-extension/", "Extension", "extension")}${link("blog/", "Blog", "blog")}${link("compare/", "Compare", "compare")}${link("pricing/", "Pricing", "pricing")}${link("about/", "About", "about")}</nav>
  <div class="hactions">
    <button type="button" class="iconbtn" data-theme-toggle aria-label="Switch to dark mode">${ICON.moon}</button>
    <a class="hlogin" href="${root}login/" data-login-link>Log in</a>
    <a class="btn hsignup" href="${root}signup/" data-signup-link>Sign up free</a>
    <button type="button" class="iconbtn menubtn" data-menu aria-label="Open menu" aria-expanded="false" aria-controls="site-nav"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
  </div>
</div>${megaMenu(root)}</header>`;
}

const POPULAR_SLUGS = ["youtube-money-calculator", "instagram-engagement-rate-calculator", "tiktok-fake-follower-checker", "twitch-channel-comparison", "youtube-sponsorship-price-calculator", "instagram-hashtag-generator", "youtube-channel-quality-checker", "instagram-pricing-calculator"];

function footer(root, note) {
  const col = (title, links) => `<div class="fcol"><h4>${esc(title)}</h4>${links.map(([href, label]) => `<a href="${/^https?:/.test(href) ? href : root + href}">${esc(label)}</a>`).join("")}</div>`;
  const popular = POPULAR_SLUGS.slice(0, 6).map((s) => tools.find((t) => t.slug === s)).filter(Boolean).map((t) => [`creator-tools/${t.slug}/`, t.name]);
  return `<footer class="site-footer"><div class="wrap">
  <div class="fgrid">
    <div class="fbrand">
      <a class="brand" href="${root}" aria-label="${BRAND} home">${MARK("f" + Math.random().toString(36).slice(2, 6))}<span>Passive <b>Array</b></span></a>
      <p>${TAGLINE}. Live data from official APIs, the formula on every page, nothing behind a wall.</p>
      <form class="fnews" data-subscribe data-kind="newsletter" novalidate>
        <label for="fn-email">Weekly creator report</label>
        <div class="row"><input id="fn-email" type="email" name="email" placeholder="you@example.com" required autocomplete="email"><button type="submit" class="btn">Subscribe</button></div>
        <input type="text" name="website" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
        <span class="fmsg" data-msg>One email a week: benchmarks, rate changes, new tools. Unsubscribe any time.</span>
      </form>
    </div>
    ${col("Creator tools", [["creator-tools/#rank", "YouTube SEO tools"], ["creator-tools/#create", "Generators"], ["creator-tools/#check", "Channel checkers"], ["creator-tools/#estimate", "Money calculators"], ["creator-tools/#Instagram", "Instagram tools"], ["creator-tools/#TikTok", "TikTok tools"], ["creator-tools/", `All ${tools.length} tools`]])}
    ${col("Web tools", WEB_TOOLS.map(([href, name]) => [href, name]))}
    ${col("Popular", popular)}
    ${col("Compare", [["compare/", "All comparisons"], ["compare/vidiq-alternative/", "vidIQ alternative"], ["compare/tubebuddy-alternative/", "TubeBuddy alternative"], ["pricing/", "Pricing"], ["faq/", "FAQ"]])}
    ${col("Company", [["about/", "About"], ["blog/", "Blog"], ["youtube-extension/", "Chrome extension"], ["contact/", "Contact"], ["login/", "Sign in"], ["privacy/", "Privacy policy"], ["terms/", "Terms of use"]])}
  </div>
  <div class="fbottom">
    <span>&copy; ${new Date().getFullYear()} ${BRAND}. ${esc(note || "Estimates use public numbers and typical industry rates. A starting point, not a guarantee.")}</span>
    <nav><a href="${root}privacy/">Privacy</a><a href="${root}terms/">Terms</a><a href="${root}contact/">Contact</a></nav>
  </div>
</div></footer>`;
}

/* ------------------------------------------------------------------ tool metadata */
const INTENTS = {
  check: { label: "Check an account", sub: "Live data for YouTube and Twitch, typed numbers for the rest", icon: "check" },
  compare: { label: "Compare", sub: "Two or three accounts side by side, leader marked on every row", icon: "compare" },
  estimate: { label: "Estimate money or price", sub: "Always a range, with the formula on the page", icon: "money" },
  fake: { label: "Spot fakes", sub: "Suspicion scores from the numbers on a profile", icon: "check" },
  find: { label: "Find creators", sub: "Search YouTube by niche, country or a channel you already like", icon: "check" },
  create: { label: "Create content", sub: "Titles, descriptions, ideas, scripts and hashtags", icon: "create" },
  rank: { label: "Rank on YouTube", sub: "Keywords, tags, title scoring and niche research", icon: "search" },
};
function intentOf(t) {
  if (t.intent) return t.intent;
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
  // A tool can name its own follow-ups with "next"; otherwise pick nearby ones.
  const picked = (t.next || []).map((s) => tools.find((o) => o.slug === s)).filter(Boolean);
  const nextList = (picked.length ? picked : [
    ...same.filter((o) => intentOf(o) !== intentOf(t)).slice(0, 3),
    ...tools.filter((o) => o.platform !== t.platform && intentOf(o) === intentOf(t)).slice(0, 1),
  ]).slice(0, 4).map((o) => `<a href="../${o.slug}/">${esc(o.short)} <b>${esc(INTENTS[intentOf(o)].label.split(" ")[0])}</b></a>`).join("");
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
    <div class="search-row">${ICON.search}<label for="dq" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);margin:0">Search tools</label><input id="dq" type="search" placeholder="Search tools by name or by what they do"></div>
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

// Small abstract mock-ups for the capability blocks. Deliberately not
// screenshots: they show the shape of each answer without pretending to be
// real data from a real channel.
const STEP_ART = [
  `<div class="art">
    <div class="art-head">Keyword ideas <b>38</b></div>
    <div class="art-chips"><span>how to youtube seo</span><span>youtube seo for beginners</span><span>best youtube seo</span><span>youtube seo mistakes</span><span class="dim">+34 more</span></div>
    <div class="art-row"><span>Niche score</span><b>65 / 100</b></div>
    <div class="art-bar"><i style="width:65%"></i></div>
  </div>`,
  `<div class="art">
    <div class="art-head">Title score <b>83 / 100</b></div>
    <div class="art-title">5 YouTube SEO Mistakes That Kill Your Views</div>
    <div class="art-row"><span>Length</span><b>43 / 60</b></div><div class="art-bar"><i style="width:100%"></i></div>
    <div class="art-row"><span>Keyword position</span><b>Front</b></div><div class="art-bar"><i style="width:100%"></i></div>
    <div class="art-row"><span>Click appeal</span><b>Number + strong word</b></div><div class="art-bar"><i style="width:72%"></i></div>
  </div>`,
  `<div class="art">
    <div class="art-head">Channel check <b>Live</b></div>
    <div class="art-tiles"><div><b>41K</b><span>Subscribers</span></div><div><b>22K</b><span>Avg views</span></div><div><b>4.8%</b><span>Engagement</span></div><div><b>54%</b><span>Views per sub</span></div></div>
    <div class="art-row"><span>Quality score</span><b>78 / 100</b></div>
    <div class="art-bar"><i style="width:78%"></i></div>
  </div>`,
  `<div class="art">
    <div class="art-head">Monthly ad earnings</div>
    <div class="art-big">$200 <span>to</span> $1,600</div>
    <div class="art-row"><span>400,000 views x $0.50 to $4.00 RPM</span></div>
    <div class="art-bar wide"><i style="width:38%"></i></div>
    <div class="art-row"><span>Sponsored integration</span><b>$2,400 to $6,000</b></div>
  </div>`,
];


/* ------------------------------------------------------------------ home page
   Structure follows what works on the pages people compare us with: a promise,
   proof, the differentiator stated plainly, numbered capability blocks, a tool
   finder, and an FAQ that search engines can read. The difference is that every
   claim here is checkable and every tool it points at is actually free. */

// Used on the home page and, as structured data, by search engines.
const HOME_FAQ = [
  ["Is Passive Array really free?",
    "Yes, and there is no trial to expire. Every one of the tools works without an account, without a card, and without a credit limit. The site runs on free hosting and free API allowances, which is why it can stay that way."],
  ["Do I need an account?",
    "No. Nothing on this site is behind a sign-in. An account is optional and holds one thing: your email address and whether you want the weekly report. Every tool works whether you have one or not."],
  ["How is this different from vidIQ or TubeBuddy?",
    "Those are subscriptions with a free tier attached. The free tier is a sample: a limited number of AI credits a month, a sign-in with Google before you see anything, and the useful parts reserved for the paid plan. Here the result loads first and nothing is reserved."],
  ["Where do the numbers come from?",
    "Live YouTube and Twitch figures come from those platforms' official APIs. Instagram, TikTok and X have no free public API, so those tools work from numbers you type in, and say so on the page. Every estimate shows the formula that produced it."],
  ["Why do you not show search volume for keywords?",
    "Because nobody outside Google has YouTube's search volume. Every tool that displays one is modelling it, usually from web search data, then presenting the guess with a precision it has not earned. We show what the top results are actually doing instead, which is measured rather than modelled."],
  ["Are the earnings figures accurate?",
    "They are ranges, not payslips. Revenue per thousand views swings with your niche, your audience's country and your share of Shorts, so a single figure would be a lie. We show the range and the assumption behind each end, and you can change the assumptions."],
  ["Is there a browser extension?",
    "Yes, and it is free too. It puts engagement rate, hidden tags, views per day and a keyword score directly on YouTube's video, channel and search pages."],
];

function homePage(posts = []) {
  const root = "";
  const count = (fn) => tools.filter(fn).length;
  const liveCount = count(isLive);
  const bySlug = (s) => tools.find((t) => t.slug === s);
  const popular = ["youtube-title-generator", "youtube-money-calculator", "youtube-keyword-generator", "youtube-subscriber-count-checker", "youtube-tag-generator", "instagram-engagement-rate-calculator", "youtube-title-analyzer", "tiktok-fake-follower-checker"]
    .map(bySlug).filter(Boolean);

  const intentCard = (key, iconCls, text, countText, href) => `<a class="card intent" href="${href}"><span class="ic ${iconCls}">${ICON[INTENTS[key].icon]}</span><h3>${esc(INTENTS[key].label)}</h3><p>${esc(text)}</p><span class="count">${esc(countText)}</span></a>`;

  // Numbered capability blocks, each one pointing at the tools that do the job.
  const STEPS = [
    ["01", "Research", "Find something worth making",
      "Expand one keyword into dozens of real long-tail phrases, compare niches on what they pay against how crowded they are, and get twelve video ideas you could film tomorrow.",
      ["youtube-keyword-generator", "youtube-niche-finder", "youtube-video-ideas-generator"]],
    ["02", "Optimise", "Write it so it gets clicked",
      "Ten title angles with a character count against the 60 where YouTube truncates, a title scored out of 100 with every check shown, a description laid out for the two lines that matter, and tags inside the 500-character limit.",
      ["youtube-title-generator", "youtube-title-analyzer", "youtube-description-generator", "youtube-tag-generator"]],
    ["03", "Check", "Read any channel honestly, including yours",
      "Subscribers, engagement rate against the benchmark for that size, views per subscriber, upload consistency and a quality score out of 100. Live from the official API, exact where the platform allows it.",
      ["youtube-subscriber-count-checker", "youtube-engagement-rate-calculator", "youtube-channel-quality-checker", "youtube-channel-comparison"]],
    ["04", "Earn", "Know what it is actually worth",
      "Ad earnings as a range with the revenue assumption on screen, sponsorship prices built from average views rather than subscriber count, and a fake-follower check before you pay anyone.",
      ["youtube-money-calculator", "youtube-sponsorship-price-calculator", "instagram-pricing-calculator", "instagram-fake-follower-checker"]],
  ];

  const stepBlock = (s, i) => `
    <div class="step${i % 2 ? " flip" : ""}">
      <div class="step-text">
        <span class="k">${s[0]} &mdash; ${esc(s[1].toUpperCase())}</span>
        <h3>${esc(s[2])}</h3>
        <p>${esc(s[3])}</p>
        <div class="step-tools">${s[4].map((slug) => {
          const t = bySlug(slug);
          return t ? `<a href="${root}creator-tools/${t.slug}/">${esc(t.name.replace(/^YouTube /, ""))}</a>` : "";
        }).join("")}</div>
      </div>
      <div class="step-visual" aria-hidden="true">${STEP_ART[i]}</div>
    </div>`;

  const faqHtml = HOME_FAQ.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");

  const jsonld = [
    { "@context": "https://schema.org", "@type": "WebSite", name: BRAND, url: SITE + "/", description: TAGLINE,
      potentialAction: { "@type": "SearchAction", target: SITE + "/creator-tools/youtube-subscriber-count-checker/?channel={search_term_string}", "query-input": "required name=search_term_string" } },
    { "@context": "https://schema.org", "@type": "SoftwareApplication", name: BRAND, url: SITE + "/",
      applicationCategory: "BusinessApplication", operatingSystem: "Any",
      description: `${tools.length} free tools for YouTube, Instagram, TikTok and Twitch creators. No account required.`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" } },
    { "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: HOME_FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${tools.length} Free YouTube &amp; Creator Tools, No Sign-Up | ${BRAND}</title>
<meta name="description" content="Free YouTube tools: keyword research, title generator, tag generator, money calculator, engagement rate and channel checks. ${tools.length} tools, no account, no credit card, no trial.">
<link rel="canonical" href="${SITE}/">
<meta property="og:title" content="${tools.length} free YouTube and creator tools, no sign-up">
<meta property="og:description" content="Keyword research, titles, tags, earnings and audience checks. Free, with the formula shown on every page.">
${HEAD}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="creator-tools/shared.css">
<script>try{var t=localStorage.getItem("pa-theme");if(t)document.documentElement.setAttribute("data-theme",t);}catch(e){}</script>
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body data-root="${root}">
${header(root, "home", false)}
<main class="wrap">

  <section class="hero">
    <span class="eyebrow"><i></i>${tools.length} tools. No account. No card. Nothing expires.</span>
    <h1>Free YouTube tools. <br class="desk-br">All of them. Forever.</h1>
    <p>Keyword research, titles, tags, descriptions, earnings and audience checks. The result loads first, the formula is on the page, and nothing is reserved for a paid plan.</p>
    <form class="bigsearch" data-search role="search">
      ${ICON.search}
      <label for="q" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);margin:0">Channel link, handle or name</label>
      <input id="q" type="text" placeholder="Paste a YouTube or Twitch channel link, or an @handle" autocomplete="off">
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

  <section class="statbar">
    <div><b>${tools.length}</b><span>free tools</span></div>
    <div><b>${liveCount}</b><span>with live API data</span></div>
    <div><b>0</b><span>sign-ups required</span></div>
    <div><b>$0</b><span>now and later</span></div>
  </section>

  <section class="section" id="why">
    <div class="section-head"><h2>Free here, gated there</h2><a href="compare/">See the full comparison</a></div>
    <div class="card compare-strip">
      <div class="tablewrap"><table class="cmp">
        <thead><tr><th>What you want to do</th><th class="us">Passive Array</th><th>vidIQ free</th><th>TubeBuddy free</th></tr></thead>
        <tbody>
          <tr><td>Use it without making an account</td><td class="us">Yes</td><td>No, sign-in required</td><td>No, sign-in required</td></tr>
          <tr><td>Generate titles, tags and descriptions</td><td class="us">Unlimited</td><td>Monthly AI credit allowance</td><td>Limited on free</td></tr>
          <tr><td>Keyword research</td><td class="us">Unlimited</td><td>Limited on free</td><td>Limited on free</td></tr>
          <tr><td>See the formula behind a number</td><td class="us">On every page</td><td>No</td><td>No</td></tr>
          <tr><td>Instagram, TikTok and Twitch tools</td><td class="us">Included</td><td>YouTube and Instagram</td><td>YouTube only</td></tr>
          <tr><td>Cost to remove the limits</td><td class="us">There are none</td><td>From about $17 a month</td><td>Paid plans</td></tr>
        </tbody>
      </table></div>
      <p class="note">Checked ${new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })} from both companies' own public pages. They are good products with real depth on their paid tiers; this table is only about what you can do without paying. If something here is out of date, <a href="contact/">tell us</a> and it gets fixed.</p>
    </div>
  </section>

  <section class="section" id="how">
    <div class="section-head"><h2>Stop guessing. Show your working.</h2><span class="sub">Four jobs, ${tools.length} tools</span></div>
    <div class="steps-flow">${STEPS.map(stepBlock).join("")}</div>
  </section>

  <section class="section" id="goals">
    <div class="section-head"><h2>Or start from what you need</h2><a href="creator-tools/">All ${tools.length} tools</a></div>
    <div class="grid c4">
      ${intentCard("rank", "", "Long-tail keywords, tags, a title scored out of 100, and niches ranked on pay against competition.", `${count((t) => intentOf(t) === "rank")} SEO tools`, "creator-tools/#rank")}
      ${intentCard("create", "indigo", "Titles, descriptions, video ideas, script outlines, channel names and hashtags.", `${count((t) => intentOf(t) === "create")} generators`, "creator-tools/#create")}
      ${intentCard("check", "", "Subscribers, views, engagement rate and a quality grade from the last 10 uploads.", `${count((t) => intentOf(t) === "check")} tools, ${liveCount} live`, "creator-tools/#check")}
      ${intentCard("estimate", "indigo", "Ad earnings, sponsorship rates and earned media value, always shown as a range.", `${count((t) => intentOf(t) === "estimate")} calculators`, "creator-tools/#estimate")}
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

  <section class="section">
    <div class="promo">
      <div class="promo-text">
        <span class="k">CHROME EXTENSION</span>
        <h2>See the numbers on YouTube itself</h2>
        <p>Engagement rate, hidden tags, views per day and a keyword score, right on the video, channel and search pages. Free, no account.</p>
        <a class="btn mint" href="youtube-extension/">Get the extension ${ICON.arrow}</a>
      </div>
      <div class="promo-stats" aria-hidden="true">
        <div><b>4.8%</b><span>Engagement, Good</span></div>
        <div><b>1.4K</b><span>Views per day</span></div>
        <div><b>16</b><span>Hidden tags</span></div>
        <div><b>65</b><span>Keyword score</span></div>
      </div>
    </div>
  </section>
${posts.length ? `
  <section class="section">
    <div class="section-head"><h2>From the blog</h2><a href="blog/">All articles</a></div>
    <div class="grid c3">${posts.slice(0, 3).map((p) => postCard(p, root)).join("")}</div>
  </section>` : ""}

  <section class="section" id="faq">
    <div class="section-head"><h2>Questions people ask first</h2><a href="faq/">All questions</a></div>
    <div class="card faq">${faqHtml}</div>
  </section>

  <div class="cta-band">
    <div><h3>Pick a tool and get an answer in about ten seconds</h3><p>No account, no card, nothing to install unless you want the extension.</p></div>
    <a class="btn mint" href="creator-tools/">Browse all ${tools.length} tools ${ICON.arrow}</a>
  </div>
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

/* ------------------------------------------------------------------ shared page shell for blog, extension and company pages */
const fmtDate = (s) => new Date(s + (String(s).length === 10 ? "T12:00:00Z" : "")).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

// A post's category is an object from blog/build-blog.js; older callers passed a string.
function postCard(p, root) {
  const label = typeof p.category === "string" ? p.category : p.category.label;
  return `<a class="card post" href="${root}blog/${p.slug}/"><span class="tagline"><span class="plat" style="color:var(--deep)">${esc(label.toUpperCase())}</span><span class="muted" style="font-size:.78rem">${p.minutes} min read</span></span><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><span class="pdate">${fmtDate(p.date)}</span></a>`;
}

// path is the site path the page is served at, e.g. "/blog/some-post/". Body goes inside <main class="wrap">.
function shell({ title, description, path, body, active = "", head = "", scripts = "", jsonld = null, narrow = false, ogTitle }) {
  const depth = path.split("/").filter(Boolean).length;
  const root = "../".repeat(depth);
  const canonical = SITE + path;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} | ${BRAND}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${esc(ogTitle || title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
${HEAD}
${head}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="${root}creator-tools/shared.css">
<script>try{var t=localStorage.getItem("pa-theme");if(t)document.documentElement.setAttribute("data-theme",t);}catch(e){}</script>
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ""}
</head>
<body data-root="${root}">
${header(root, active, false)}
<main class="wrap${narrow ? " narrow" : ""}">
${body}
</main>
${footer(root)}
${scripts}
<script src="${root}creator-tools/site.js"></script>
</body>
</html>`;
}

module.exports = { buildInto, homePage, tools, SITE, BRAND, TAGLINE, WEB_TOOLS, header, footer, shell, postCard, fmtDate, esc, ICON, VERIFY_TAG };

if (require.main === module) {
  const out = path.join(HERE, ".out");
  fs.rmSync(out, { recursive: true, force: true });
  const count = buildInto(out);
  fs.writeFileSync(path.join(out, "home.html"), homePage());
  console.log(`Passive Array: ${count} tool pages + directory written to ${out}`);
}
