// Handler for /api/meta (served through api/pro.js): the Meta Tag Checker.
//   GET /api/meta?url=https://example.com/page
// Fetches the page server-side (public http/https only, private and local addresses
// refused, 8 s timeout, 3 MB read cap, up to 5 redirects recorded) and returns the
// on-page SEO tags with a pass / warn / fail verdict for each. It reads the HTML the
// server sends; it does not run JavaScript.

const dns = require("dns").promises;
const net = require("net");
const store = require("./store.js");

const MAX_BYTES = 3 * 1024 * 1024;
const TIMEOUT = 8000;
const UA = "Mozilla/5.0 (compatible; PassiveArrayMetaChecker/1.0; +https://passivearray.com/meta-tag-checker/)";

function json(res, code, body) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", code === 200 ? "public, max-age=300" : "no-store");
  res.status(code).send(JSON.stringify(body));
}

function privateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224;
  }
  const v = ip.toLowerCase();
  return v === "::1" || v === "::" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80") || v.startsWith("::ffff:127.") || v.startsWith("::ffff:10.") || v.startsWith("::ffff:192.168.");
}

async function assertPublic(u) {
  if (!/^https?:$/.test(u.protocol)) throw Object.assign(new Error("Only http and https addresses can be checked."), { status: 400 });
  if (u.port && !["80", "443", ""].includes(u.port)) throw Object.assign(new Error("Only standard web ports can be checked."), { status: 400 });
  const host = u.hostname;
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) throw Object.assign(new Error("Local addresses cannot be checked."), { status: 400 });
  const ips = net.isIP(host) ? [host] : (await dns.lookup(host, { all: true }).catch(() => { throw Object.assign(new Error("That domain does not resolve. Check the spelling."), { status: 400 }); })).map((r) => r.address);
  if (!ips.length || ips.some(privateIp)) throw Object.assign(new Error("Private or local addresses cannot be checked."), { status: 400 });
}

async function readCapped(r) {
  const reader = r.body && r.body.getReader ? r.body.getReader() : null;
  if (!reader) return (await r.text()).slice(0, MAX_BYTES);
  const chunks = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length; chunks.push(value);
    if (size >= MAX_BYTES) { try { await reader.cancel(); } catch (_) {} break; }
  }
  return Buffer.concat(chunks.map((c) => Buffer.from(c))).toString("utf8");
}

async function fetchPage(start) {
  const chain = [];
  let url = start;
  const t0 = Date.now();
  for (let hop = 0; hop <= 5; hop++) {
    const u = new URL(url);
    await assertPublic(u);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
    let r;
    try {
      r = await fetch(url, { redirect: "manual", signal: ctrl.signal, headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5", "Accept-Language": "en" } });
    } catch (e) {
      throw Object.assign(new Error(e.name === "AbortError" ? "The page took longer than 8 seconds to answer." : "Could not reach that page: " + (e.cause && e.cause.code || e.message)), { status: 502 });
    } finally { clearTimeout(timer); }
    chain.push({ url, status: r.status });
    if (r.status >= 300 && r.status < 400 && r.headers.get("location")) {
      url = new URL(r.headers.get("location"), url).toString();
      continue;
    }
    const type = r.headers.get("content-type") || "";
    const html = /html|xml/i.test(type) || !type ? await readCapped(r) : "";
    return { finalUrl: url, status: r.status, chain, ms: Date.now() - t0, type, xRobots: r.headers.get("x-robots-tag") || "", html };
  }
  throw Object.assign(new Error("More than 5 redirects. The page may be stuck in a redirect loop."), { status: 502, chain });
}

/* ------------------------------------------------------------------ parsing */
const decode = (s) => String(s || "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/\s+/g, " ").trim();
const attr = (tag, name) => { const m = tag.match(new RegExp("\\b" + name + "\\s*=\\s*(\"([^\"]*)\"|'([^']*)'|([^\\s>]+))", "i")); return m ? decode(m[2] ?? m[3] ?? m[4] ?? "") : null; };

function parse(html, pageUrl) {
  const head = (html.match(/<head[\s\S]*?<\/head>/i) || [html.slice(0, 200000)])[0];
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0]);
  const meta = (key, val) => { const t = metas.find((m) => (attr(m, key) || "").toLowerCase() === val); return t ? attr(t, "content") : null; };
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]);
  const title = decode((head.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "") || null;
  const canonicalTag = links.find((l) => /\brel\s*=\s*["']?canonical/i.test(l));
  const hreflang = links.filter((l) => /\brel\s*=\s*["']?alternate/i.test(l) && /hreflang/i.test(l)).map((l) => ({ lang: attr(l, "hreflang"), href: attr(l, "href") }));
  const body = (html.match(/<body[\s\S]*<\/body>/i) || [html])[0];
  const clean = body.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
  const heading = (n) => [...clean.matchAll(new RegExp("<h" + n + "\\b[^>]*>([\\s\\S]*?)<\\/h" + n + ">", "gi"))].map((m) => decode(m[1].replace(/<[^>]+>/g, " "))).filter(Boolean);
  const imgs = [...clean.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => attr(t, "alt") === null).length;
  const text = decode(clean.replace(/<[^>]+>/g, " "));
  const words = text ? text.split(" ").filter((w) => /[\p{L}\p{N}]/u.test(w)).length : 0;
  const base = new URL(pageUrl);
  let internal = 0, external = 0;
  for (const m of clean.matchAll(/<a\b[^>]*href\s*=\s*["']([^"'#][^"']*)["']/gi)) {
    try { const u = new URL(decode(m[1]), base); if (!/^https?:$/.test(u.protocol)) continue; if (u.hostname.replace(/^www\./, "") === base.hostname.replace(/^www\./, "")) internal++; else external++; } catch (_) {}
  }
  const ldTypes = [];
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const walk = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) return o.forEach(walk); if (o["@type"]) [].concat(o["@type"]).forEach((t) => ldTypes.push(String(t))); if (o["@graph"]) walk(o["@graph"]); };
      walk(JSON.parse(m[1].trim()));
    } catch (_) { ldTypes.push("(invalid JSON-LD)"); }
  }
  return {
    title, description: meta("name", "description"), robots: meta("name", "robots"), googlebot: meta("name", "googlebot"),
    canonical: canonicalTag ? attr(canonicalTag, "href") : null, lang: attr((html.match(/<html\b[^>]*>/i) || [""])[0], "lang"),
    viewport: meta("name", "viewport"), charset: !!(metas.find((m) => /charset/i.test(m))),
    og: { title: meta("property", "og:title"), description: meta("property", "og:description"), image: meta("property", "og:image"), url: meta("property", "og:url"), type: meta("property", "og:type") },
    twitter: { card: meta("name", "twitter:card"), title: meta("name", "twitter:title"), image: meta("name", "twitter:image") },
    h1: heading(1), h2Count: heading(2).length, h3Count: heading(3).length,
    images: imgs.length, imagesNoAlt: noAlt, words, internalLinks: internal, externalLinks: external,
    hreflang, schema: [...new Set(ldTypes)],
  };
}

/* ------------------------------------------------------------------ verdicts */
function checks(p, page) {
  const out = [];
  const add = (group, name, status, value, fix) => out.push({ group, name, status, value, fix: fix || "" });
  const sameUrl = (a, b) => { try { const x = new URL(a, page.finalUrl), y = new URL(b); return (x.origin + x.pathname.replace(/\/$/, "")) === (y.origin + y.pathname.replace(/\/$/, "")); } catch (_) { return false; } };

  add("Response", "Status code", page.status === 200 ? "pass" : page.status < 400 ? "warn" : "fail", String(page.status), page.status === 200 ? "" : "Search engines index pages that answer 200 OK.");
  add("Response", "Redirects", page.chain.length <= 1 ? "pass" : page.chain.length === 2 ? "warn" : "fail", page.chain.length <= 1 ? "None" : (page.chain.length - 1) + " hop" + (page.chain.length > 2 ? "s" : ""), page.chain.length > 1 ? "Link straight to the final URL; every hop costs time and some link value." : "");
  add("Response", "Response time", page.ms < 800 ? "pass" : page.ms < 2000 ? "warn" : "fail", page.ms + " ms", page.ms >= 800 ? "Slow server responses delay everything else; check hosting and caching." : "");

  const tl = p.title ? p.title.length : 0;
  add("Search", "Title", !p.title ? "fail" : tl < 30 ? "warn" : tl > 60 ? "warn" : "pass", p.title ? p.title + " (" + tl + " characters)" : "Missing", !p.title ? "Add a unique <title> with the page's main topic near the start." : tl < 30 ? "Short titles waste space in results. Aim for 30 to 60 characters." : tl > 60 ? "Likely cut off in Google. Check it in the SERP snippet preview." : "");
  const dl = p.description ? p.description.length : 0;
  add("Search", "Meta description", !p.description ? "warn" : dl < 70 ? "warn" : dl > 160 ? "warn" : "pass", p.description ? p.description + " (" + dl + " characters)" : "Missing", !p.description ? "Google will pick text from the page. Write a 120 to 160 character summary." : dl < 70 ? "Too short to persuade. Aim for 120 to 160 characters." : dl > 160 ? "Likely cut off. Keep the key point in the first 120 characters." : "");
  const robots = [p.robots, p.googlebot, page.xRobots].filter(Boolean).join(", ").toLowerCase();
  add("Search", "Robots directives", /noindex/.test(robots) ? "fail" : /nofollow/.test(robots) ? "warn" : "pass", robots || "None (indexable)", /noindex/.test(robots) ? "This page asks search engines not to index it. Remove noindex if it should rank." : /nofollow/.test(robots) ? "Links on this page will not pass value." : "");
  add("Search", "Canonical", !p.canonical ? "warn" : sameUrl(p.canonical, page.finalUrl) ? "pass" : "warn", p.canonical ? (sameUrl(p.canonical, page.finalUrl) ? "Points to itself" : "Points to " + p.canonical) : "Missing", !p.canonical ? "Add a self-referencing canonical to avoid duplicate URL versions." : sameUrl(p.canonical, page.finalUrl) ? "" : "This page tells Google another URL is the main version, so this one may not rank.");
  add("Search", "Language", p.lang ? "pass" : "warn", p.lang || "Missing", p.lang ? "" : "Add lang to the <html> tag, for example lang=\"en\".");
  add("Search", "Hreflang", "info", p.hreflang.length ? p.hreflang.length + " alternate" + (p.hreflang.length > 1 ? "s" : "") + ": " + p.hreflang.slice(0, 6).map((h) => h.lang).join(", ") : "None", "");

  add("Content", "H1 heading", p.h1.length === 1 ? "pass" : p.h1.length === 0 ? "fail" : "warn", p.h1.length ? p.h1.slice(0, 3).join(" | ") + (p.h1.length > 1 ? " (" + p.h1.length + " H1s)" : "") : "Missing", p.h1.length === 0 ? "Add one H1 that states the page topic." : p.h1.length > 1 ? "Use a single H1; make the others H2." : "");
  add("Content", "Subheadings", p.h2Count ? "pass" : "warn", p.h2Count + " H2, " + p.h3Count + " H3", p.h2Count ? "" : "Break longer content into sections with H2 headings.");
  add("Content", "Word count", p.words >= 300 ? "pass" : "warn", p.words.toLocaleString("en-US") + " words in the HTML", p.words < 300 ? "Thin pages rarely rank. Content loaded by JavaScript is not counted here." : "");
  add("Content", "Image alt text", p.images === 0 ? "info" : p.imagesNoAlt === 0 ? "pass" : "warn", p.images ? (p.images - p.imagesNoAlt) + " of " + p.images + " images have alt text" : "No images", p.imagesNoAlt ? "Add descriptive alt text to " + p.imagesNoAlt + " image" + (p.imagesNoAlt > 1 ? "s" : "") + "." : "");
  add("Content", "Links", "info", p.internalLinks + " internal, " + p.externalLinks + " external", "");

  add("Mobile", "Viewport", p.viewport ? "pass" : "fail", p.viewport || "Missing", p.viewport ? "" : "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> for mobile.");
  add("Mobile", "Character set", p.charset ? "pass" : "warn", p.charset ? "Declared" : "Missing", p.charset ? "" : "Add <meta charset=\"utf-8\"> as the first tag in <head>.");

  const ogMissing = ["title", "description", "image"].filter((k) => !p.og[k]);
  add("Social", "Open Graph", ogMissing.length === 0 ? "pass" : ogMissing.length === 3 ? "fail" : "warn", ogMissing.length ? "Missing og:" + ogMissing.join(", og:") : "og:title, og:description and og:image set", ogMissing.length ? "Without these, Facebook, LinkedIn and WhatsApp guess the preview." : "");
  add("Social", "Twitter card", p.twitter.card ? "pass" : "warn", p.twitter.card || "Missing", p.twitter.card ? "" : "Add twitter:card (summary_large_image) for a large preview on X.");
  add("Structured data", "Schema types", p.schema.length ? (p.schema.includes("(invalid JSON-LD)") ? "fail" : "pass") : "warn", p.schema.length ? p.schema.join(", ") : "None found", p.schema.includes("(invalid JSON-LD)") ? "One JSON-LD block does not parse. Fix it in the schema markup generator." : p.schema.length ? "" : "Structured data can make the page eligible for rich results. Try the schema markup generator.");
  return out;
}

module.exports = async (req, res) => {
  let raw = String((req.query && req.query.url) || "").trim();
  if (!raw) return json(res, 400, { ok: false, error: "Paste a page URL, for example https://example.com/page." });
  if (!/^https?:\/\//i.test(raw)) raw = "https://" + raw;
  let u;
  try { u = new URL(raw); } catch (_) { return json(res, 400, { ok: false, error: "That does not look like a web address." }); }
  const ip = String((req.headers["x-forwarded-for"] || "").split(",")[0] || "anon").trim();
  const { limited } = await store.hitLimit("meta:ip:" + ip, 60, 3600);
  if (limited) return json(res, 429, { ok: false, error: "Too many checks in an hour. Try again later." });
  try {
    const page = await fetchPage(u.toString());
    if (!page.html) return json(res, 200, { ok: true, url: page.finalUrl, status: page.status, chain: page.chain, ms: page.ms, notHtml: true, error: "That address returned " + (page.type || "no content") + ", not an HTML page." });
    const p = parse(page.html, page.finalUrl);
    return json(res, 200, { ok: true, url: page.finalUrl, status: page.status, chain: page.chain, ms: page.ms, page: p, checks: checks(p, page) });
  } catch (e) {
    return json(res, e.status || 502, { ok: false, error: e.message, chain: e.chain || [] });
  }
};
