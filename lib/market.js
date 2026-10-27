// Which audience a channel makes videos for, so ideas and keyword research can stay in
// that market instead of defaulting to global English results.
//
// Language comes from the writing system of the channel's own text (title, description,
// recent video titles). Script detection is reliable for Bengali, Hindi, Urdu, Arabic,
// Tamil, Telugu, Thai and others; Latin script is treated as English, which is a
// simplification for Spanish, Indonesian and the like. Country is what the channel
// declares on YouTube, which many channels leave blank.

const SCRIPTS = [
  ["bn", /[ঀ-৿]/g, "Bengali"],
  ["hi", /[ऀ-ॿ]/g, "Hindi"],
  ["ar", /[؀-ۿݐ-ݿ]/g, "Arabic"],
  ["ta", /[஀-௿]/g, "Tamil"],
  ["te", /[ఀ-౿]/g, "Telugu"],
  ["ml", /[ഀ-ൿ]/g, "Malayalam"],
  ["gu", /[઀-૿]/g, "Gujarati"],
  ["pa", /[਀-੿]/g, "Punjabi"],
  ["th", /[฀-๿]/g, "Thai"],
  ["ru", /[Ѐ-ӿ]/g, "Russian"],
  ["ko", /[가-힯]/g, "Korean"],
  ["ja", /[぀-ヿ]/g, "Japanese"],
  ["zh", /[一-鿿]/g, "Chinese"],
];
const LATIN = /[A-Za-z]/g;
const COUNTRY_NAMES = { BD: "Bangladesh", IN: "India", PK: "Pakistan", NP: "Nepal", LK: "Sri Lanka", US: "the United States", GB: "the United Kingdom", CA: "Canada", AU: "Australia", AE: "the UAE", SA: "Saudi Arabia", EG: "Egypt", ID: "Indonesia", MY: "Malaysia", PH: "the Philippines", NG: "Nigeria" };
const LANG_NAMES = Object.fromEntries(SCRIPTS.map(([c, , n]) => [c, n]).concat([["en", "English"], ["ur", "Urdu"]]));
// Markets where global English results are already the right default.
const GLOBAL_EN = new Set(["", "US", "GB", "CA", "AU", "NZ", "IE"]);

/** Language code of a piece of text by writing system, or "en" for Latin, or null for no letters. */
function detectLang(text, country) {
  const s = String(text || "");
  let best = null, bestN = 0;
  for (const [code, re] of SCRIPTS) {
    const n = (s.match(re) || []).length;
    if (n > bestN) { best = code; bestN = n; }
  }
  const latin = (s.match(LATIN) || []).length;
  if (bestN && bestN >= latin * 0.25) return best === "ar" && country === "PK" ? "ur" : best;
  return latin ? "en" : best;
}

/** { country, lang, global, label } for a channel object from creator-tools/lib/youtube.js. */
function marketOf(ch) {
  const country = String((ch && ch.country) || "").toUpperCase();
  const titles = ((ch && ch.recent && ch.recent.videos) || []).map((v) => v.title).join(" \n ");
  const lang = detectLang([ch && ch.title, ch && ch.description, titles].join(" \n "), country) || "en";
  const global = lang === "en" && GLOBAL_EN.has(country);
  const parts = [];
  if (lang !== "en" || !global) parts.push(LANG_NAMES[lang] || lang);
  if (country && !GLOBAL_EN.has(country)) parts.push(COUNTRY_NAMES[country] || country);
  return { country, lang, global, label: global ? "Global (English)" : parts.join(", ") + (parts.length === 1 && lang !== "en" && !country ? "-speaking" : "") };
}

/** True when an outlier item belongs to the same market as `m`. */
function sameMarket(item, m) {
  if (!m || m.global) return true;
  const lang = item.lang || detectLang(item.title, item.country);
  if (m.lang !== "en") return lang === m.lang;
  // English-language channel outside the big English markets: same declared country.
  return !!m.country && item.country === m.country;
}

/** Search parameters that keep YouTube results in this market. */
function searchParams(m) {
  if (!m || m.global) return {};
  const p = {};
  if (m.country) p.regionCode = m.country;
  const rel = m.lang === "ur" ? "ur" : m.lang;
  if (rel && rel !== "en") p.relevanceLanguage = rel;
  else if (m.country) p.relevanceLanguage = "en";
  return p;
}

module.exports = { detectLang, marketOf, sameMarket, searchParams, LANG_NAMES };
