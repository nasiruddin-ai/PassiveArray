// Plagiarism Checker - the checking logic.
// Used by server.js (local) and by netlify/functions/plagiarism.mjs (Netlify).
//
// Actions (see handleRequest at the bottom):
//   status     tells the page whether a search API key is configured
//   compare    { textA, textB }      -> compares two texts locally (no key needed)
//   check      { text, excludeUrl }  -> checks each sentence against the web (needs Google key)
//   fetch-url  { url }               -> downloads a web page and returns its plain text

const fs = require("fs");
const path = require("path");

const USER_AGENT = "Mozilla/5.0 (compatible; PlagiarismChecker/1.0)";

// ---------- config ----------
const config = { googleApiKey: "", googleCx: "", maxQueriesPerCheck: 40, wordLimit: 1000, port: 3100 };
try {
  const raw = fs.readFileSync(path.join(__dirname, "..", "config.json"), "utf8");
  Object.assign(config, JSON.parse(raw));
} catch (_) {
  /* no config.json: use defaults */
}

// Override settings, for example from environment variables on Netlify.
// Empty values are ignored so config.json keeps working locally.
function configure(opts) {
  for (const [k, v] of Object.entries(opts || {})) {
    if (v !== undefined && v !== null && v !== "") config[k] = v;
  }
}

function webConfigured() {
  return Boolean(config.googleApiKey && config.googleCx);
}

// ---------- text helpers ----------
function normalizeWords(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[‘’“”]/g, "'")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function countWords(s) {
  return normalizeWords(s).length;
}

// Split text into sentences. Short fragments are glued to the previous sentence.
function splitSentences(text) {
  const clean = String(text || "").replace(/\r/g, "").replace(/[ \t]+/g, " ");
  const parts = clean
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'(\[])|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const out = [];
  for (const p of parts) {
    const w = countWords(p);
    if (out.length && (w < 4 || countWords(out[out.length - 1]) < 4)) {
      out[out.length - 1] += " " + p;
    } else {
      out.push(p);
    }
  }
  return out;
}

// Take a run of words from a sentence to use as an exact-phrase search.
function buildQuery(sentence, maxWords = 12) {
  const words = String(sentence).replace(/["“”]/g, "").split(/\s+/).filter(Boolean);
  const start = words.length > maxWords ? Math.floor((words.length - maxWords) / 2) : 0;
  return words.slice(start, start + maxWords).join(" ");
}

function shingles(words, n = 3) {
  const set = new Set();
  if (words.length < n) {
    if (words.length) set.add(words.join(" "));
    return set;
  }
  for (let i = 0; i <= words.length - n; i++) set.add(words.slice(i, i + n).join(" "));
  return set;
}

// How much of set A appears inside set B (0..1).
function containment(a, b) {
  if (!a.size) return 0;
  let hit = 0;
  for (const s of a) if (b.has(s)) hit++;
  return hit / a.size;
}

function jaccard(a, b) {
  if (!a.size && !b.size) return 0;
  let inter = 0;
  for (const s of a) if (b.has(s)) inter++;
  return inter / (a.size + b.size - inter);
}

// Decide whether a search snippet really contains our phrase.
function judgeMatch(query, snippet) {
  const q = normalizeWords(query);
  const s = normalizeWords(snippet);
  if (!q.length || !s.length) return 0;
  const qJoined = " " + q.join(" ") + " ";
  const sJoined = " " + s.join(" ") + " ";
  if (sJoined.includes(qJoined)) return 1;
  return containment(shingles(q, 3), shingles(s, 3));
}

// Strip a downloaded web page down to readable text.
function htmlToText(html) {
  let h = String(html || "");
  h = h.replace(/<!--[\s\S]*?-->/g, "");
  h = h.replace(/<(script|style|noscript|svg|head|nav|footer|header)[\s\S]*?<\/\1>/gi, " ");
  h = h.replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/tr|\/blockquote)[^>]*>/gi, "\n");
  h = h.replace(/<[^>]+>/g, " ");
  h = h.replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'");
  h = h.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
  h = h.replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "\n").replace(/\n{2,}/g, "\n\n");
  return h.trim();
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch (_) {
    return "";
  }
}

// ---------- local compare (no API needed) ----------
function compareTexts(textA, textB) {
  const sentencesA = splitSentences(textA);
  const sentencesB = splitSentences(textB);
  const wordsB = normalizeWords(textB);
  const allB = shingles(wordsB, 3);
  const bShingles = sentencesB.map((s) => shingles(normalizeWords(s), 3));

  let matchedWords = 0;
  let totalWords = 0;
  const results = sentencesA.map((sentence) => {
    const w = normalizeWords(sentence);
    const sh = shingles(w, 3);
    const score = containment(sh, allB);
    let best = -1;
    let bestScore = 0;
    bShingles.forEach((bs, i) => {
      const j = jaccard(sh, bs);
      if (j > bestScore) {
        bestScore = j;
        best = i;
      }
    });
    const matched = score >= 0.5;
    totalWords += w.length;
    if (matched) matchedWords += w.length;
    return { sentence, matched, score: Math.round(score * 100), matchText: best >= 0 && bestScore > 0 ? sentencesB[best] : null };
  });

  const pct = totalWords ? Math.round((matchedWords / totalWords) * 100) : 0;
  return { ok: true, mode: "compare", plagiarized: pct, unique: 100 - pct, totalWords, matchedWords, sentences: results };
}

// ---------- web check (Google Programmable Search) ----------
async function fetchJson(url, opts = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, Object.assign({ signal: controller.signal, headers: { "User-Agent": USER_AGENT } }, opts));
    let data = null;
    try {
      data = await res.json();
    } catch (_) {}
    return { status: res.status, data };
  } finally {
    clearTimeout(timer);
  }
}

async function googleSearch(query) {
  const u = new URL("https://www.googleapis.com/customsearch/v1");
  u.searchParams.set("key", config.googleApiKey);
  u.searchParams.set("cx", config.googleCx);
  u.searchParams.set("q", '"' + query + '"');
  u.searchParams.set("num", "5");
  const { status, data } = await fetchJson(u.toString());
  if (status === 429 || (data && data.error && /quota|limit/i.test(data.error.message || ""))) {
    const e = new Error("Daily search quota reached. The free Google tier allows 100 searches per day.");
    e.code = "QUOTA";
    throw e;
  }
  if (status !== 200) {
    const msg = data && data.error && data.error.message ? data.error.message : "HTTP " + status;
    const e = new Error("Search API error: " + msg);
    e.code = "API";
    throw e;
  }
  return Array.isArray(data.items) ? data.items : [];
}

async function runPool(items, worker, size = 3) {
  const results = new Array(items.length);
  let next = 0;
  let fatal = null;
  async function lane() {
    while (next < items.length && !fatal) {
      const i = next++;
      try {
        results[i] = await worker(items[i], i);
      } catch (err) {
        if (err.code === "QUOTA" || err.code === "API") fatal = err;
        else results[i] = { error: err.message };
      }
    }
  }
  await Promise.all(Array.from({ length: size }, lane));
  if (fatal) throw fatal;
  return results;
}

async function checkAgainstWeb(text, excludeUrl) {
  const sentences = splitSentences(text);
  const excludeHost = hostOf(excludeUrl);
  const limit = Math.max(1, Number(config.maxQueriesPerCheck) || 40);
  const toCheck = sentences.slice(0, limit);
  const skipped = sentences.length - toCheck.length;

  const checked = await runPool(toCheck, async (sentence) => {
    const w = normalizeWords(sentence);
    if (w.length < 5) return { sentence, matched: false, skipped: true };
    const query = buildQuery(sentence);
    const items = await googleSearch(query);
    let best = null;
    for (const it of items) {
      if (excludeHost && hostOf(it.link) === excludeHost) continue;
      const score = judgeMatch(query, (it.snippet || "") + " " + (it.title || ""));
      if (!best || score > best.score) best = { score, link: it.link, title: it.title || it.link };
    }
    const matched = !!best && best.score >= 0.6;
    return { sentence, matched, score: best ? Math.round(best.score * 100) : 0, source: matched ? best : null };
  });

  let total = 0;
  let plag = 0;
  for (const r of checked) {
    if (!r || r.skipped || r.error) continue;
    const n = countWords(r.sentence);
    total += n;
    if (r.matched) plag += n;
  }
  const pct = total ? Math.round((plag / total) * 100) : 0;
  return {
    ok: true,
    mode: "web",
    plagiarized: pct,
    unique: 100 - pct,
    totalWords: total,
    matchedWords: plag,
    sentences: checked,
    skippedSentences: skipped,
    note: skipped > 0 ? `Only the first ${limit} sentences were checked (maxQueriesPerCheck setting). ${skipped} sentence(s) were not checked.` : null,
  };
}

// ---------- fetch a web page as text ----------
async function fetchUrlAsText(rawUrl) {
  let target = String(rawUrl || "").trim();
  if (!/^https?:\/\//i.test(target)) target = "https://" + target;
  let parsed;
  try {
    parsed = new URL(target);
  } catch (_) {
    return { code: 400, body: { ok: false, error: "That does not look like a valid URL." } };
  }
  if (/^(localhost|127\.|10\.|192\.168\.|0\.0\.0\.0|\[::1\])/.test(parsed.hostname)) return { code: 400, body: { ok: false, error: "Local addresses are not allowed." } };
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    const r = await fetch(parsed.toString(), { headers: { "User-Agent": USER_AGENT, Accept: "text/html,*/*" }, signal: controller.signal, redirect: "follow" });
    clearTimeout(timer);
    if (!r.ok) return { code: 502, body: { ok: false, error: `The page returned HTTP ${r.status}.` } };
    const html = await r.text();
    const text = htmlToText(html);
    if (!text) return { code: 502, body: { ok: false, error: "No readable text was found on that page." } };
    return { code: 200, body: { ok: true, url: parsed.toString(), text, words: countWords(text) } };
  } catch (err) {
    const msg = err.name === "AbortError" ? "The page took too long to respond." : "Could not download the page: " + err.message;
    return { code: 502, body: { ok: false, error: msg } };
  }
}

// ---------- one entry point for both servers ----------
// action: "status" | "compare" | "check" | "fetch-url".  body: the parsed JSON the page sent.
// Returns { code, body } ready to send as JSON.
async function handleRequest(action, body) {
  body = body || {};

  if (action === "status") {
    return { code: 200, body: { ok: true, webCheck: webConfigured(), wordLimit: config.wordLimit, maxQueriesPerCheck: config.maxQueriesPerCheck } };
  }

  if (action === "compare") {
    const a = String(body.textA || "");
    const b = String(body.textB || "");
    if (!a.trim() || !b.trim()) return { code: 400, body: { ok: false, error: "Please provide both texts." } };
    return { code: 200, body: compareTexts(a, b) };
  }

  if (action === "check") {
    const text = String(body.text || "");
    if (!text.trim()) return { code: 400, body: { ok: false, error: "Please paste some text to check." } };
    if (countWords(text) > config.wordLimit) return { code: 400, body: { ok: false, error: `Text is over the ${config.wordLimit}-word limit.` } };
    if (!webConfigured()) {
      return {
        code: 400,
        body: {
          ok: false,
          code: "NO_KEY",
          error: "Web checking is not set up yet. Add your Google API key and Search Engine ID (config.json locally, or GOOGLE_API_KEY and GOOGLE_CX on Netlify). See README.md for the 5-minute setup.",
        },
      };
    }
    try {
      return { code: 200, body: await checkAgainstWeb(text, body.excludeUrl) };
    } catch (err) {
      return { code: 502, body: { ok: false, code: err.code || "ERR", error: err.message } };
    }
  }

  if (action === "fetch-url") {
    return fetchUrlAsText(body.url);
  }

  return { code: 404, body: { ok: false, error: "Unknown action." } };
}

module.exports = { configure, config, webConfigured, splitSentences, buildQuery, judgeMatch, compareTexts, htmlToText, normalizeWords, countWords, handleRequest };
