// Pulls the real <title>, meta description, first <h1> and canonical out of a page's HTML.
// Runs in the service worker, which has no DOMParser, so it reads tags with small regexes.
// Only the <head> and the start of <body> matter, so callers pass at most ~600 KB.

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—", hellip: "…", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", copy: "©", reg: "®", trade: "™", middot: "·", bull: "•", laquo: "«", raquo: "»" };

function decodeEntities(s) {
  return (s || "").replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") {
      const n = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      try { return String.fromCodePoint(n); } catch (err) { return m; }
    }
    const v = ENTITIES[e.toLowerCase()];
    return v === undefined ? m : v;
  });
}

const tidy = (s) => decodeEntities((s || "").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

function attrs(tag) {
  const out = {};
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m;
  const body = tag.replace(/^<\s*[a-zA-Z]+/, "").replace(/\/?>$/, "");
  while ((m = re.exec(body))) out[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? "");
  return out;
}

function parseMeta(html) {
  // Drop scripts, styles and comments so tags inside them don't count.
  const h = html.replace(/<!--[\s\S]*?-->/g, "").replace(/<(script|style|noscript|template|svg)\b[\s\S]*?<\/\1\s*>/gi, "");

  const titleM = h.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i);
  let description = "", ogTitle = "", ogDescription = "", robots = "", canonical = "";
  for (const tag of h.match(/<meta\b[^>]*>/gi) || []) {
    const a = attrs(tag);
    const key = (a.name || a.property || "").toLowerCase();
    if (key === "description" && !description) description = a.content || "";
    else if (key === "og:title" && !ogTitle) ogTitle = a.content || "";
    else if (key === "og:description" && !ogDescription) ogDescription = a.content || "";
    else if (key === "robots" && !robots) robots = a.content || "";
  }
  for (const tag of h.match(/<link\b[^>]*>/gi) || []) {
    const a = attrs(tag);
    if ((a.rel || "").toLowerCase().split(/\s+/).includes("canonical")) { canonical = a.href || ""; break; }
  }
  const h1M = h.match(/<h1\b[^>]*>([\s\S]*?)<\/h1\s*>/i);

  return {
    title: tidy(titleM ? titleM[1] : ""),
    description: tidy(description),
    h1: tidy(h1M ? h1M[1] : ""),
    canonical: canonical.trim(),
    ogTitle: tidy(ogTitle),
    ogDescription: tidy(ogDescription),
    robots: robots.trim(),
  };
}

// Charset from the Content-Type header, else from <meta charset> in the first bytes, else UTF-8.
function sniffCharset(contentType, bytes) {
  let cs = (/charset=([^;]+)/i.exec(contentType || "") || [])[1];
  if (!cs) {
    const head = new TextDecoder("latin1").decode(bytes.subarray(0, 4096));
    cs = (/<meta[^>]+charset=["']?([-\w]+)/i.exec(head) || [])[1];
  }
  cs = (cs || "utf-8").trim().replace(/["']/g, "").toLowerCase();
  try { new TextDecoder(cs); return cs; } catch (e) { return "utf-8"; }
}

// How Google's shown title relates to the page's real <title>.
//   Same         identical after normalising case, spacing and punctuation
//   Truncated    Google cut it short ("…")
//   Shortened    Google dropped the end (usually " | Brand") without adding "…"
//   Brand added  Google kept the title and appended or prefixed a site name
//   Rewritten    Google wrote a different title
function compareTitles(googleTitle, realTitle) {
  if (!realTitle) return "";
  const norm = (s) => s.toLowerCase().replace(/[…]|\.\.\.$/g, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  const truncated = /(…|\.\.\.)\s*$/.test(googleTitle);
  const g = norm(googleTitle), r = norm(realTitle);
  if (!g) return "";
  if (g === r) return "Same";
  if (truncated && r.startsWith(g)) return "Truncated";
  if (g.includes(r) && r.length >= 8) return "Brand added";
  // Google often trims a " | Brand" tail from long titles without adding "…".
  if (r.startsWith(g) && g.length >= r.length * 0.5) return "Shortened";
  return "Rewritten";
}

if (typeof module !== "undefined") module.exports = { parseMeta, decodeEntities, sniffCharset, compareTitles };
