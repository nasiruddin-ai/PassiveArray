// Reads the organic results off a Google results page.
// background.js injects extractSerp() into the tab with chrome.scripting, so the function
// must be self-contained: no outside variables, no imports.
// Google renames its CSS classes often, so results are found by structure:
// a link that wraps an <h3> headline, inside the main results column.

function extractSerp() {
  const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
  const params = new URLSearchParams(location.search);
  const out = {
    query: params.get("q") || "",
    host: location.hostname,
    start: parseInt(params.get("start") || "0", 10) || 0,
    captcha: location.pathname.startsWith("/sorry") || !!document.querySelector("#captcha-form, form[action*='sorry']"),
    hasNext: !!document.querySelector("#pnnext, a[aria-label='Next page'], a[aria-label='Next']"),
    results: [],
  };
  if (out.captcha) return out;

  const root = document.querySelector("#rso") || document.querySelector("#search") || document.body;
  // Blocks that also contain link+h3 pairs but are not organic results.
  const SKIP = [
    "#tads", "#tadsb", "#bottomads", "[data-text-ad]",
    ".related-question-pair", "[data-initq]", "g-accordion-expander",
    "g-scrolling-carousel", "g-inner-card",
    "#botstuff", "#rhs",
  ].join(",");

  const seen = new Set();
  for (const h3 of root.querySelectorAll("a h3, h3 a")) {
    const a = h3.closest("a") || h3.querySelector("a");
    if (!a || a.closest(SKIP)) continue;

    let url = a.getAttribute("href") || "";
    if (url.startsWith("/url?")) url = new URLSearchParams(url.slice(5)).get("q") || new URLSearchParams(url.slice(5)).get("url") || "";
    if (!/^https?:\/\//i.test(url)) continue;
    let u;
    try { u = new URL(url); } catch (e) { continue; }
    if (/(^|\.)google\.[a-z.]+$/i.test(u.hostname) && !/^(sites|support|developers|blog)\./i.test(u.hostname)) continue;
    if (seen.has(url)) continue;
    seen.add(url);

    const title = clean(h3.textContent);
    if (!title) continue;

    // The result card: climb until the block holds more than just the link.
    let card = a.parentElement;
    for (let i = 0; i < 8 && card && card !== root; i++) {
      if (card.matches("[data-hveid], [data-snc], .g, .MjjYud") && clean(card.textContent).length > clean(a.textContent).length + 20) break;
      card = card.parentElement;
    }
    if (!card || card === root) card = a.parentElement;

    // Site name: the text inside the link that is neither the headline nor the <cite> URL.
    let site = "";
    const nameEl = a.querySelector(".VuuXrf");
    if (nameEl) site = clean(nameEl.textContent);
    if (!site) {
      for (const span of a.querySelectorAll("span, div")) {
        if (span.closest("h3") || span.closest("cite") || span.querySelector("h3, cite, span, div")) continue;
        const t = clean(span.textContent);
        if (t && t !== title && !/^https?:\/\//i.test(t) && !t.includes("›")) { site = t; break; }
      }
    }
    if (!site) site = u.hostname.replace(/^www\./, "");

    const cite = a.querySelector("cite") || card.querySelector("cite");
    const displayedUrl = cite ? clean(cite.textContent) : "";

    // Snippet: Google's snippet box if we can find it, else the longest leftover text line.
    let snippet = "";
    const snipEl = card.querySelector("[data-sncf], .VwiC3b, [style*='-webkit-line-clamp']");
    if (snipEl && !a.contains(snipEl)) snippet = clean(snipEl.textContent);
    if (!snippet) {
      const skip = new Set([title, site, displayedUrl]);
      const lines = (card.innerText || card.textContent || "").split("\n").map(clean)
        .filter((l) => l.length > 40 && !skip.has(l) && !l.startsWith(title));
      snippet = lines.sort((x, y) => y.length - x.length)[0] || "";
    }

    // Date: Google prefixes some snippets with "Jan 7, 2026 — " or "3 days ago — ".
    let date = "";
    const m = snippet.match(/^(.{3,28}?)\s+[—–-]\s+(.*)$/);
    if (m && /\d/.test(m[1]) && /(\d{4}|ago|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(m[1])) {
      date = m[1].trim();
      snippet = m[2].trim();
    }

    out.results.push({ site, title, url, displayedUrl, snippet, date });
  }
  return out;
}

if (typeof module !== "undefined") module.exports = { extractSerp };
