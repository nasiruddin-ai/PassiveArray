// Top YouTube channels by country, for /creator-tools/top-youtube-channels-by-country/.
//
// YouTube publishes no country ranking, so we build one from channels we can actually find:
//   1. every channel seen before for this country (store set topcset:<CC>, grows over time)
//   2. the channels behind the country's trending chart, overall and in eight categories
//   3. SEEDS below: well-known large channels, each checked by hand through the API
//   4. the curated list of the largest channels worldwide
// Only channels whose About page names the country count. Results are cached a day in the store.
// Every channel looked up is also filed under its own country, so other countries' pools grow too.
// No search.list calls: searches have their own small daily quota, shared with the keyword and
// influencer tools, and a ranking refresh must never use it up. A build costs about 15 units.

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

// Large channels the trending charts miss. Add ids here when a ranking lacks an obvious channel;
// the country always comes live from the API, so the comments are only a reading aid.
const SEEDS = [
  // AE: Get Movies
  "UClZkHt2kNIgyrTTPnSQV3SA",
  // AR: Alejo Igoa, El Reino Infantil
  "UCZs0WwC0Dn_noiQE2BHSTKg", "UCK1i2UviaXLUNrZlAFpw_jA",
  // BD: Jamuna TV, Tonni art and craft, Anupam Movie Songs, Ekattor TV, Farjana Drawing Academy, Independent Television, Bongo, Eagle Music Video Station, ATN Bangla News, BanglaVision NEWS, Laser Vision, Rafsan TheChotoBhai
  "UCN6sm8iHiPd0cnoUardDAnw", "UC1m_wJF-qJ_VnPQKNahOmjQ", "UCxjk0jpZguFJuyrNM_EIP3w", "UCtqvtAVmad5zywaziN6CbfA", "UCd3s7BuoOlu4bRJL6RdGWXw", "UCATUkaOHwO9EP_W87zCiPbA", "UC9nuJbEL-AMJLLqc2-ej8xQ", "UCaHeVvYo6wHdCvqohi6O9bw", "UCbgcYEdMsuypG2NJ-znBp3w", "UCA4y9g_GRdNrZLH_u5LLSdw", "UCpNi3ip_fJY3vLVdqWbTzzA", "UCxbyDapSavjgvdtpcJ2BJKw",
  // BR: Canal KondZilla, LUCCAS NETO, Maria Clara & JP, Felipe Neto, Voc Sabia?, whinderssonnunes, GR6 EXPLODE, Spider Slack, rezendeevil
  "UCffDXn7ycAzwL2LDlbyWOTw", "UC_gV70G_Y51LTa3qhu8KiEA", "UCKe6w0exI94U-RzqAyoY1VA", "UCV306eHqgo0LvBf3Mh36AHg", "UCj0O6W8yDuLg3iraAXKgCrQ", "UC3KQ5GWANYF8lChqjZpXsQw", "UCNUQK9mQoqi4yNXw2_Rj6SA", "UCtiddfzHXNevG-yYe5vc_4Q", "UCbTVTephX30ZhQF5zwFppBg",
  // CA: Justin Bieber, Super Simple Songs - Kids Songs, The Weeknd, WatchMojo.com, Linus Tech Tips
  "UCIwFjwMjI0y7PDBVEO9-bkQ", "UCLsooMJoIpl_7ux2jvdPB-Q", "UC0WP5P-ufpRfjbNrmOWwLBQ", "UCaWd5_7JhbQBe4dknZhsHJg", "UCXuqSBlHAE6Xw-yeJA0Tunw",
  // ES: Mikecrack, AuronPlay
  "UCqJ5zFEED1hWs0KNQCQuYdQ", "UCyQqzYXQBUWgBTn4pw_fFSQ",
  // GB: Peppa Pig - Official Channel, NoCopyrightSounds, DanTDM, Coldplay, Dan Rhodes, Dua Lipa, Sidemen, Mrwhosetheboss, KSI
  "UCAOtE1V7Ots4DjM8JLlrYgg", "UC_aEa8K-EOJ3D6gOs7HcyNg", "UCS5Oz6CHmeoF7vSad0qqXfw", "UCDPM_n1atn2ijUwHd0NNRQw", "UC6D1L2vxEAg_Vi0JSxMBDgA", "UC-J-KZfRV8c13fOCkhXdLiQ", "UCDogdKl7t7NHzQ95aEwkdMw", "UCMiJRAwDNSNzuYeN2uWa0pA", "UCGmnsW623G1r-Chmo5RB4Yw",
  // ID: Jess No Limit, Frost Diamond, Willie Salim, AH, TRANS7 OFFICIAL, Rans Entertainment, GEN HALILINTAR
  "UCvh1at6xpV1ytYOAzxmqUsA", "UC4hGmH5sABOA70D4fGb8qNQ", "UCPCaXSwaos-QI03iZtx8I6g", "UCaKLg1ELiX0zTJ6Je3c5esA", "UC24_Z2L-8Ki183AI9zJJzNQ", "UCvA9_f5Lwk-poMynabtrZPg", "UCfRNJiafEm1LBBGFTTq4cXw",
  // IN: T-Series Bhakti Sagar, Tips Official, Colors TV, Anaya Kandhal, Aaj Tak, Sony Music India, YRF, Shemaroo, MR. INDIAN HACKER, Techno Gamerz, Total Gaming, CarryMinati, TAWHID AFRIDI
  "UCaayLD9i5x4MmIoVZxXSv_g", "UCJrDMFOdv1I2k8n9oK_V21w", "UC55IWqFLDH1Xp7iu1_xknRA", "UC4wEPe5mrHGAUjjTfXH_C-Q", "UCt4t-jeY85JegMlZ-E5UWtA", "UC56gTxNs4f9xZ7Pa2i5xNzg", "UCbTLwN10NoCU4WDzLf1JMOA", "UCF1JIbMUs6uqoZEY1Haw0GQ", "UCSiDGb0MnHFGjs4E2WKvShw", "UCX8pnu3DYUnx8qy8V_c6oHg", "UC5c9VlYTSvBSCaoMu_GI6gQ", "UCj22tfcQrWG7EMEKS0qLeEg", "UCEO0rIuBz8Dc8p7PpGE26ZQ",
  // JP: ISSEI /, Sagawa /, Junya., Bayashi TV, hajime, Fischer's--
  "UC6QZ_ss3i_8qLV_RczPZBkw", "UCWaOde99oeUVoXbIj3SNu9g", "UCjp_3PEaOau_nT_3vnqKIvg", "UCbCJmNKAL85O1VFeD6Wj60g", "UCgMPP6RRjktV7krOfyUewqw", "UCibEhpu5HP45-w7Bq1ZIulw",
  // KR: KIMPRO, 1theK (), JFlaMusic, aespa
  "UCiVs2pnGW5mLIc1jS2nxhjg", "UCweOkPb1wVVH0Q0Tlj4a5Pw", "UClkRzsdvg7_RKVhwDwiDZOA", "UC9GtSLeksfK4yuJ_g1lgQbg",
  // MX: YOLO AVENTURAS, Badabun, Kimberly Loaiza, Luisito Comunica
  "UCOnIJiQuk1fDSp6p1GCZy3A", "UCYWOjHweP2V-8kGKmmAmQJQ", "UCQZfFRohQ7UX-0CdXl-6pwQ", "UCECJDeK0MNapZbpaOzxrUPA",
  // SG: mayajaal
  "UCfixIpf6Z09QH-vZT-mpgZg",
  // US: Stokes Twins, Alan's Universe, Topper Guild, Mark Rober, Toys and Colors, Dude Perfect, IShowSpeed, LankyBox, Little Baby Bum - Nursery Rhymes & Kids Songs, SOMOY TV
  "UCbp9MyKCTEww4CxEzc_Tp0Q", "UC5gxP-2QqIh_09djvlm9Xcg", "UCPuEAY09CtdTzFNWuqVZgDw", "UCY1kMZp36IQSyNx_9h4mpCg", "UCgFXm4TI8htWmCyJ6cVPG_A", "UCRijo3ddMTht_IHyNSNXpNQ", "UCWsDFcIhY2DBi3GB5uykGXA", "UCSf0s2ogUVYpJPuzW1zpAOg", "UCKAqou7V9FAWXpZd9xtOg3Q", "UCxHoBXkY88Tb8z1Ssj6CWsQ",
];

async function topByCountry(params) {
  const cc = String(params.country || "").trim().toUpperCase();
  if (!NAMES[cc]) return { code: 400, body: { ok: false, code: "input", error: "Pick a country from the list." } };
  const cacheKey = "topc:v2:" + cc;
  if (store.enabled()) {
    const hit = await store.getJson(cacheKey).catch(() => null);
    if (hit) return { code: 200, body: { ok: true, ...hit, cached: true } };
  }
  const ids = new Set(await store.smembers("topcset:" + cc));
  const fromBefore = ids.size;
  for (const id of SEEDS) ids.add(id);
  const charts = [youtube.getTrending(cc).catch(() => null)].concat(CATEGORIES.map((c) => youtube.getTrending(cc, { category: c, pages: 1 }).catch(() => null)));
  for (const t of await Promise.all(charts)) if (t) for (const v of t.videos) ids.add(v.channelId);
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
