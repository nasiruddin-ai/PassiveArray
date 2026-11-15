// Top YouTube channels by country, for /creator-tools/top-youtube-channels-by-country/.
//
// YouTube publishes no country ranking, so we build one from channels we can actually find:
//   1. every channel seen before for this country (store set topcset:<CC>, grows over time)
//   2. the channels behind the country's trending chart, overall and in eight categories
//   3. one channel search for the country's name, sorted by views (100 quota units)
//   4. the curated list of the largest channels worldwide
// Only channels whose About page names the country count. Results are cached a day in the store.
// Every channel looked up is also filed under its own country, so other countries' pools grow too.

const store = require("./store.js");
const youtube = require("../creator-tools/lib/youtube.js");

const DAY = 86400;
const CATEGORIES = ["10", "20", "24", "17", "22", "23", "27", "28"];
const NAMES = {
  US: "United States", IN: "India", BR: "Brazil", ID: "Indonesia", MX: "Mexico", JP: "Japan", GB: "United Kingdom", DE: "Germany",
  FR: "France", KR: "South Korea", PH: "Philippines", VN: "Vietnam", TH: "Thailand", TR: "Turkey", RU: "Russia", PK: "Pakistan",
  BD: "Bangladesh", EG: "Egypt", SA: "Saudi Arabia", AE: "United Arab Emirates", NG: "Nigeria", ES: "Spain", IT: "Italy",
  CA: "Canada", AU: "Australia", AR: "Argentina", CO: "Colombia", PL: "Poland", NL: "Netherlands", UA: "Ukraine", MY: "Malaysia",
  KE: "Kenya", ZA: "South Africa", CL: "Chile", PE: "Peru", TW: "Taiwan", HK: "Hong Kong", SG: "Singapore", SE: "Sweden", NZ: "New Zealand",
};

async function topByCountry(params) {
  const cc = String(params.country || "").trim().toUpperCase();
  if (!NAMES[cc]) return { code: 400, body: { ok: false, code: "input", error: "Pick a country from the list." } };
  const cacheKey = "topc:v1:" + cc;
  if (store.enabled() && params.fresh !== "1") {
    const hit = await store.getJson(cacheKey).catch(() => null);
    if (hit) return { code: 200, body: { ok: true, ...hit, cached: true } };
  }
  const ids = new Set(await store.smembers("topcset:" + cc));
  const fromBefore = ids.size;
  const charts = [youtube.getTrending(cc).catch(() => null)].concat(CATEGORIES.map((c) => youtube.getTrending(cc, { category: c, pages: 1 }).catch(() => null)));
  for (const t of await Promise.all(charts)) if (t) for (const v of t.videos) ids.add(v.channelId);
  try {
    const found = await youtube.handleRequest("search", { q: NAMES[cc], country: cc });
    for (const c of (found.body && found.body.channels) || []) ids.add(c.id);
  } catch (_) { /* search is a bonus */ }
  const top = await youtube.handleRequest("top", {});
  for (const c of (top.body && top.body.channels) || []) ids.add(c.id);

  let stats;
  try { stats = await youtube.statsForIds([...ids]); } catch (e) { return { code: e.status && e.status < 500 ? e.status : 502, body: youtube.errorBody(e) }; }

  // File every channel under its own country so each pool grows with use.
  if (store.enabled()) {
    const byCountry = {};
    for (const c of stats) if (NAMES[c.country]) (byCountry[c.country] = byCountry[c.country] || []).push(c.id);
    const cmds = Object.entries(byCountry).map(([k, list]) => ["SADD", "topcset:" + k, ...list]);
    if (cmds.length) await store.pipeline(cmds).catch((e) => console.error("top-country pool: " + e.message));
  }

  const mine = stats.filter((c) => c.country === cc && !c.hiddenSubscribers).sort((a, b) => b.subscribers - a.subscribers);
  const out = {
    country: cc,
    countryName: NAMES[cc],
    pool: mine.length,
    checkedIds: stats.length,
    newThisRun: Math.max(0, mine.length - fromBefore),
    channels: mine.slice(0, 100).map((c) => ({ id: c.id, title: c.title, handle: c.handle, url: c.url, thumb: c.thumbnail, subscribers: c.subscribers, views: c.views, videos: c.videos, since: c.publishedAt })),
    checkedAt: new Date().toISOString(),
  };
  if (store.enabled()) await store.setJson(cacheKey, out, DAY).catch(() => {});
  return { code: 200, body: { ok: true, ...out } };
}

module.exports = { topByCountry, NAMES };
