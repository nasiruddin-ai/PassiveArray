// YouTube Data API v3 helper shared by the local server (server.js) and the
// Netlify Function (netlify/functions/creator-youtube.mjs).
//
// Quota: the default key allows 10,000 units a day. channels.list and
// playlistItems.list cost 1 unit, search.list costs 100. Results are cached in
// memory for 6 hours so repeated lookups of the same channel are free.

const API = "https://www.googleapis.com/youtube/v3";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const cache = new Map();

let settings = { apiKey: "", timeoutMs: 8000 };

function configure(opts = {}) {
  settings = { ...settings, ...opts };
}

function cached(key, make) {
  const hit = cache.get(key);
  if (hit && hit.until > Date.now()) return Promise.resolve(hit.value);
  return make().then((value) => {
    cache.set(key, { value, until: Date.now() + CACHE_TTL_MS });
    return value;
  });
}

async function yt(path, params) {
  const url = new URL(API + "/" + path);
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "" && v !== null) url.searchParams.set(k, v);
  url.searchParams.set("key", settings.apiKey);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), settings.timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const reason = data?.error?.errors?.[0]?.reason || data?.error?.status || res.status;
      const err = new Error(data?.error?.message || "YouTube API error " + res.status);
      err.code = reason === "quotaExceeded" ? "quota" : reason === "keyInvalid" || res.status === 400 ? "bad_key" : "api";
      err.status = res.status;
      throw err;
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

// Accepts a URL, @handle, UC... id, legacy username or a plain name.
function parseChannelInput(raw) {
  const s = String(raw || "").trim();
  if (!s) return null;
  if (/^UC[\w-]{20,}$/.test(s)) return { id: s };
  if (s.startsWith("@")) return { handle: s };
  try {
    const u = new URL(s.includes("://") ? s : "https://" + s);
    if (/youtube\.com$|youtu\.be$/.test(u.hostname.replace(/^www\.|^m\./, "")) || u.hostname.includes("youtube")) {
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] === "channel" && parts[1]) return { id: parts[1] };
      if (parts[0] && parts[0].startsWith("@")) return { handle: parts[0] };
      if ((parts[0] === "c" || parts[0] === "user") && parts[1]) return { username: parts[1], query: parts[1] };
      if (parts[0] && !["watch", "shorts", "playlist"].includes(parts[0])) return { query: parts[0] };
    }
  } catch (_) {
    /* not a url */
  }
  return { query: s };
}

const CHANNEL_PARTS = "snippet,statistics,contentDetails,brandingSettings,topicDetails";

async function resolveChannelId(input) {
  const p = parseChannelInput(input);
  if (!p) throw Object.assign(new Error("Enter a channel link, @handle or name."), { code: "input", status: 400 });
  if (p.id) return p.id;
  if (p.handle) {
    const d = await yt("channels", { part: "id", forHandle: p.handle });
    if (d.items?.[0]) return d.items[0].id;
  }
  if (p.username) {
    const d = await yt("channels", { part: "id", forUsername: p.username });
    if (d.items?.[0]) return d.items[0].id;
  }
  const q = p.query || p.username || p.handle;
  const s = await yt("search", { part: "snippet", type: "channel", q, maxResults: 1 });
  if (s.items?.[0]) return s.items[0].snippet.channelId;
  throw Object.assign(new Error("No channel found for \"" + input + "\"."), { code: "not_found", status: 404 });
}

function n(v) {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
}

function isoDurationToSeconds(iso) {
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso || "");
  if (!m) return 0;
  return n(m[1]) * 3600 + n(m[2]) * 60 + n(m[3]);
}

function summarizeChannel(item) {
  const sn = item.snippet || {};
  const st = item.statistics || {};
  const kw = item.brandingSettings?.channel?.keywords || "";
  const keywords = [];
  kw.replace(/"([^"]+)"|(\S+)/g, (_, a, b) => keywords.push((a || b).trim()));
  const topics = (item.topicDetails?.topicCategories || []).map((u) => decodeURIComponent(u.split("/").pop()).replace(/_/g, " "));
  return {
    id: item.id,
    title: sn.title,
    handle: sn.customUrl || "",
    url: "https://www.youtube.com/" + (sn.customUrl || "channel/" + item.id),
    thumbnail: sn.thumbnails?.medium?.url || sn.thumbnails?.default?.url || "",
    description: (sn.description || "").slice(0, 300),
    country: sn.country || "",
    publishedAt: sn.publishedAt,
    subscribers: n(st.subscriberCount),
    hiddenSubscribers: !!st.hiddenSubscriberCount,
    views: n(st.viewCount),
    videos: n(st.videoCount),
    keywords: keywords.slice(0, 15),
    topics,
    uploadsPlaylist: item.contentDetails?.relatedPlaylists?.uploads || "",
  };
}

async function recentVideos(uploadsPlaylist) {
  if (!uploadsPlaylist) return [];
  const pl = await yt("playlistItems", { part: "contentDetails", playlistId: uploadsPlaylist, maxResults: 10 }).catch(() => ({ items: [] }));
  const ids = (pl.items || []).map((i) => i.contentDetails.videoId).filter(Boolean);
  if (!ids.length) return [];
  const vd = await yt("videos", { part: "snippet,statistics,contentDetails,status", id: ids.join(",") });
  return (vd.items || []).map((v) => ({
    id: v.id,
    title: v.snippet?.title,
    publishedAt: v.snippet?.publishedAt,
    views: n(v.statistics?.viewCount),
    likes: n(v.statistics?.likeCount),
    comments: n(v.statistics?.commentCount),
    seconds: isoDurationToSeconds(v.contentDetails?.duration),
    madeForKids: !!v.status?.madeForKids,
    url: "https://www.youtube.com/watch?v=" + v.id,
  }));
}

function summarizeRecent(videos) {
  const count = videos.length;
  const sum = (k) => videos.reduce((a, v) => a + v[k], 0);
  const dates = videos.map((v) => new Date(v.publishedAt).getTime()).filter(Boolean).sort((a, b) => a - b);
  let uploadsPerMonth = 0;
  if (dates.length >= 2) {
    const spanDays = Math.max(1, (dates[dates.length - 1] - dates[0]) / 86400000);
    uploadsPerMonth = ((dates.length - 1) / spanDays) * 30.4;
  } else if (dates.length === 1) uploadsPerMonth = 1;
  const cutoff = Date.now() - 30 * 86400000;
  const last30 = videos.filter((v) => new Date(v.publishedAt).getTime() >= cutoff);
  return {
    count,
    avgViews: count ? sum("views") / count : 0,
    avgLikes: count ? sum("likes") / count : 0,
    avgComments: count ? sum("comments") / count : 0,
    shortsShare: count ? videos.filter((v) => v.seconds > 0 && v.seconds <= 60).length / count : 0,
    uploadsPerMonth: Math.round(uploadsPerMonth * 10) / 10,
    last30Count: last30.length,
    last30Views: last30.reduce((a, v) => a + v.views, 0),
    videos,
  };
}

async function getChannel(input) {
  const id = await resolveChannelId(input);
  return cached("channel:" + id, async () => {
    const d = await yt("channels", { part: CHANNEL_PARTS, id });
    if (!d.items?.[0]) throw Object.assign(new Error("Channel not found."), { code: "not_found", status: 404 });
    const ch = summarizeChannel(d.items[0]);
    ch.recent = summarizeRecent(await recentVideos(ch.uploadsPlaylist));
    delete ch.uploadsPlaylist;
    return ch;
  });
}

async function statsForIds(ids) {
  const out = [];
  for (let i = 0; i < ids.length; i += 50) {
    const d = await yt("channels", { part: "snippet,statistics", id: ids.slice(i, i + 50).join(",") });
    for (const item of d.items || []) out.push(summarizeChannel(item));
  }
  return out;
}

async function searchChannels({ q, country, minSubs, maxSubs, exclude }) {
  const key = "search:" + JSON.stringify([q, country]);
  const list = await cached(key, async () => {
    const params = { part: "snippet", type: "channel", q: q || "", maxResults: 50, order: "relevance" };
    if (country) params.regionCode = country;
    if (!q) params.q = "vlog";
    const s = await yt("search", params);
    const ids = [...new Set((s.items || []).map((i) => i.snippet.channelId))];
    return statsForIds(ids);
  });
  const lo = n(minSubs), hi = n(maxSubs) || Infinity;
  return list
    .filter((c) => c.id !== exclude)
    .filter((c) => !country || c.country === country)
    .filter((c) => c.subscribers >= lo && c.subscribers <= hi)
    .sort((a, b) => b.subscribers - a.subscribers)
    .slice(0, 25)
    .map(({ uploadsPlaylist, keywords, topics, ...rest }) => rest);
}

async function lookalike(input) {
  const seed = await getChannel(input);
  // Build the search from topics and keywords, leaving out the channel's own name
  // so the results are similar channels rather than the seed channel again.
  const squash = (t) => t.toLowerCase().replace(/[^a-z0-9]/g, "");
  const nameBits = (seed.title + " " + seed.handle).toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2).map(squash);
  const clean = (t) => t.replace(/\(.*?\)/g, "").trim();
  const topics = seed.topics.map(clean).filter(Boolean).slice(0, 3);
  const keywords = seed.keywords
    .map(clean)
    .filter((k) => k && !nameBits.some((n) => squash(k).includes(n)))
    .slice(0, 4);
  const terms = [...keywords, ...topics];
  const q = (terms.length ? terms : seed.title.split(/\s+/).slice(0, 3)).join(" ").slice(0, 100);
  const found = await searchChannels({ q, exclude: seed.id, minSubs: 0, maxSubs: 0 });
  const rank = (c) => Math.abs(Math.log10(c.subscribers + 1) - Math.log10(seed.subscribers + 1));
  return { seed, query: q, channels: found.sort((a, b) => rank(a) - rank(b)).slice(0, 15) };
}

// Stats for up to 50 video ids at once, plus the subscriber count of each
// video's channel. Used by the browser extension on search result pages.
// Cost: 1 unit for the videos, 1 unit per 50 distinct channels.
async function getVideos(rawIds) {
  const ids = [...new Set(String(rawIds || "").split(",").map((s) => s.trim()).filter((s) => /^[\w-]{11}$/.test(s)))].slice(0, 50);
  if (!ids.length) throw Object.assign(new Error("Pass up to 50 video ids as ids=a,b,c."), { code: "input", status: 400 });
  const key = "videos:" + ids.slice().sort().join(",");
  return cached(key, async () => {
    const vd = await yt("videos", { part: "snippet,statistics,contentDetails,liveStreamingDetails", id: ids.join(",") });
    const videos = (vd.items || []).map((v) => ({
      id: v.id,
      title: v.snippet?.title,
      channelId: v.snippet?.channelId,
      channelTitle: v.snippet?.channelTitle,
      publishedAt: v.snippet?.publishedAt,
      views: n(v.statistics?.viewCount),
      likes: n(v.statistics?.likeCount),
      comments: n(v.statistics?.commentCount),
      seconds: isoDurationToSeconds(v.contentDetails?.duration),
      live: v.snippet?.liveBroadcastContent === "live",
      wasLive: !!v.liveStreamingDetails,
      tags: (v.snippet?.tags || []).length,
      tagList: (v.snippet?.tags || []).slice(0, 60), // the Studio tag suggester in the extension ranks these
      subscribers: 0,
      hiddenSubscribers: false,
    }));
    const channelIds = [...new Set(videos.map((v) => v.channelId).filter(Boolean))];
    const channels = await statsForIds(channelIds).catch(() => []);
    const byId = new Map(channels.map((c) => [c.id, c]));
    for (const v of videos) {
      const c = byId.get(v.channelId);
      if (c) {
        v.subscribers = c.subscribers;
        v.hiddenSubscribers = c.hiddenSubscribers;
        v.channelVideos = c.videos;
        v.channelViews = c.views;
      }
    }
    return videos;
  });
}

/* ------------------------------------------------------------------ monetization signals
   YouTube publishes nothing about a channel's Partner Program status. What is public:
   the eligibility numbers (subscribers, recent uploads) and whether the public watch
   page of a video carries ad placements. Monetized videos embed an "adPlacements"
   block in the page; videos on channels that are not monetized do not. YouTube can
   also run its own ads on some non-partner videos, so ads alone are read together
   with the eligibility signals, and the result is a confidence, never a certainty. */
const ADS_CANARY_VIDEO = "9bZkp7q19f0"; // PSY, Gangnam Style: monetized for over a decade
const WATCH_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Cookie: "CONSENT=YES+1; SOCS=CAI",
};

async function probeAds(videoId) {
  return cached("ads:" + videoId, async () => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    try {
      const res = await fetch("https://www.youtube.com/watch?v=" + videoId + "&hl=en", { headers: WATCH_HEADERS, signal: ctrl.signal, redirect: "follow" });
      const html = await res.text();
      // A real watch page is large and carries the player response. Consent walls and bot
      // checks are small pages without it. "recaptcha" alone is not a signal: normal pages mention it.
      const blocked = !res.ok || html.length < 200000 || !/ytInitialPlayerResponse/.test(html) || /google\.com\/sorry/i.test(html);
      if (blocked) return { id: videoId, checked: false, ads: false };
      const ads = /"adPlacements"/.test(html) || /yt_ad/.test(html);
      return { id: videoId, checked: true, ads };
    } catch (_) {
      return { id: videoId, checked: false, ads: false };
    } finally {
      clearTimeout(timer);
    }
  });
}

async function monetizationCheck(input) {
  const ch = await getChannel(input);
  const vids = ch.recent.videos || [];
  const now = Date.now();
  const last90 = vids.filter((v) => now - new Date(v.publishedAt).getTime() <= 90 * 86400000);
  const longForm = vids.filter((v) => v.seconds > 60);
  const sample = (longForm.length >= 3 ? longForm : vids).slice(0, 5);
  // Canary: a video known to carry ads. If this server cannot see ads on it, YouTube
  // is serving ad-free pages to this environment (common for data-centre addresses),
  // so "no ads" would be meaningless and the ad signal is reported as unavailable.
  const [canary, ...probes] = await Promise.all([probeAds(ADS_CANARY_VIDEO), ...sample.map((v) => probeAds(v.id))]);
  const adsVisible = !!(canary.checked && canary.ads);
  const byId = new Map(probes.map((p) => [p.id, p]));
  const sampled = sample.map((v) => {
    const p = byId.get(v.id) || { checked: false, ads: false };
    return { id: v.id, title: v.title, url: v.url, publishedAt: v.publishedAt, seconds: v.seconds, views: v.views, checked: adsVisible && p.checked, ads: adsVisible && p.ads };
  });
  const checked = sampled.filter((s) => s.checked);
  const withAds = checked.filter((s) => s.ads);
  const rate = checked.length ? withAds.length / checked.length : null;
  const kids = vids.filter((v) => v.madeForKids).length;
  const subsKnown = !ch.hiddenSubscribers;

  const signals = [
    { key: "subs1000", label: "1,000 subscribers (ads and revenue sharing)", status: !subsKnown ? "unknown" : ch.subscribers >= 1000 ? "pass" : "fail", detail: subsKnown ? ch.subscribers.toLocaleString("en-US") + " subscribers" : "Subscriber count hidden by the channel" },
    { key: "subs500", label: "500 subscribers (fan funding, memberships)", status: !subsKnown ? "unknown" : ch.subscribers >= 500 ? "pass" : "fail", detail: subsKnown ? (ch.subscribers >= 500 ? "Meets the lower tier" : "Below the lower tier") : "Hidden" },
    { key: "uploads", label: "3 public uploads in the last 90 days", status: last90.length >= 3 ? "pass" : "fail", detail: last90.length + " of the last " + vids.length + " uploads are from the last 90 days" },
    { key: "watch", label: "4,000 public watch hours or 10M Shorts views in 90 days", status: "unknown", detail: "Not public. Only the channel owner sees watch hours." },
    { key: "ads", label: "Ad placements on recent videos", status: rate == null ? "unknown" : rate >= 0.6 ? "pass" : rate > 0 ? "mixed" : "fail", detail: rate == null ? (adsVisible ? "The public watch pages could not be read from this server right now" : "YouTube is serving this server ad-free pages, so ad placements cannot be read right now. The verdict below rests on the public eligibility signals.") : withAds.length + " of " + checked.length + " sampled videos carry ad placements" },
    { key: "kids", label: "Not made for kids", status: vids.length && kids === vids.length ? "fail" : kids > 0 ? "mixed" : "pass", detail: kids ? kids + " of " + vids.length + " recent uploads are marked made for kids, which limits ads" : "No recent upload is marked made for kids" },
  ];

  const eligible = subsKnown && ch.subscribers >= 1000 && last90.length >= 3;
  let verdict;
  if (subsKnown && !eligible) {
    // Below a public threshold: revenue sharing is not possible yet, whatever the ads say.
    const adsNote = rate ? " Ads on " + withAds.length + " sampled upload" + (withAds.length === 1 ? "" : "s") + " are YouTube's own: it can run ads on non-partner videos without paying the creator." : "";
    verdict = { label: "Not eligible yet", cls: "bad", confidence: rate == null ? 70 : 85, why: "The channel misses at least one public eligibility threshold, so ad revenue sharing is not possible yet." + adsNote };
  } else if (rate != null && checked.length >= 2) {
    if (rate >= 0.6 && eligible) verdict = { label: "Likely monetized", cls: "good", confidence: Math.min(95, 70 + Math.round(rate * 15) + checked.length * 2), why: "Ads run on most sampled uploads and the channel clears the public eligibility thresholds." };
    else if (rate >= 0.6) verdict = { label: "Ads shown, partner status unclear", cls: "warn", confidence: 55, why: "Ads appear on the videos, but the subscriber count is hidden so eligibility cannot be confirmed. YouTube also places its own ads on some non-partner videos." };
    else if (rate === 0) verdict = { label: "Likely not monetized", cls: "bad", confidence: Math.min(90, 65 + checked.length * 5), why: "No ad placements on any sampled upload, even though the public thresholds are met. The channel may not have applied, may be under review, or may have ads turned off." };
    else verdict = { label: "Partly monetized or changing", cls: "warn", confidence: 50, why: "Ads appear on some sampled uploads but not others. This happens when monetization was switched on recently, when some videos are limited, or when some uploads are reused content." };
  } else if (rate != null) {
    verdict = { label: rate > 0 ? "Ads detected on a small sample" : "No ads on a small sample", cls: "warn", confidence: 45, why: "Only " + checked.length + " video could be checked, so this is a weak reading." };
  } else {
    verdict = eligible
      ? { label: "Eligible, ads unconfirmed", cls: "warn", confidence: 40, why: adsVisible ? "The channel clears the public thresholds, but the ad check could not run from this server right now. Try again in a few minutes." : "The channel clears every public threshold. The ad check is unavailable from this server right now, so partner status cannot be confirmed from here." }
      : { label: "Not eligible yet", cls: "bad", confidence: 60, why: "The channel misses at least one public eligibility threshold, so ads revenue sharing is not possible yet regardless of ads." };
  }

  let estimate = null;
  if (verdict.cls === "good") {
    const r = ch.recent;
    const monthlyViews = r.last30Count >= 2 ? r.last30Views : r.avgViews * Math.max(r.uploadsPerMonth, 1);
    estimate = { monthlyViews: Math.round(monthlyViews), low: Math.round((monthlyViews / 1000) * 0.5), high: Math.round((monthlyViews / 1000) * 4), basis: r.last30Count >= 2 ? r.last30Count + " videos uploaded in the last 30 days" : "average views x uploads per month" };
  }

  const { videos, ...recent } = ch.recent;
  return { channel: { ...ch, recent }, sampled, signalRate: rate, checkedCount: checked.length, adsVisible, signals, verdict, estimate, checkedAt: new Date().toISOString() };
}

function errorBody(e) {
  const code = e.code || "api";
  const messages = {
    no_key: "The YouTube API key is not set up on this site yet.",
    quota: "Today's free YouTube API quota is used up. Try again after midnight Pacific time.",
    bad_key: "The YouTube API key was rejected. Check that the YouTube Data API v3 is enabled for it.",
  };
  return { ok: false, code, error: messages[code] || e.message || "Something went wrong." };
}

// Same shape as the other tools' libs: returns { code, body } for the HTTP layer.
async function handleRequest(action, params = {}) {
  if (!settings.apiKey) return { code: 503, body: errorBody({ code: "no_key" }) };
  try {
    if (action === "channel") return { code: 200, body: { ok: true, channel: await getChannel(params.channel) } };
    if (action === "compare") {
      const inputs = ["a", "b", "c"].map((k) => params[k]).filter((v) => v && String(v).trim());
      if (inputs.length < 2) return { code: 400, body: { ok: false, code: "input", error: "Enter at least two channels." } };
      const channels = await Promise.all(inputs.map((v) => getChannel(v).catch((e) => ({ error: e.message, input: v }))));
      return { code: 200, body: { ok: true, channels } };
    }
    if (action === "search") {
      if (!params.q && !params.country) return { code: 400, body: { ok: false, code: "input", error: "Enter a keyword or pick a country." } };
      return { code: 200, body: { ok: true, channels: await searchChannels(params) } };
    }
    if (action === "lookalike") return { code: 200, body: { ok: true, ...(await lookalike(params.channel)) } };
    if (action === "videos") return { code: 200, body: { ok: true, videos: await getVideos(params.ids) } };
    if (action === "monetization") return { code: 200, body: { ok: true, ...(await monetizationCheck(params.channel)) } };
    return { code: 404, body: { ok: false, code: "action", error: "Unknown action." } };
  } catch (e) {
    return { code: e.status && e.status < 500 ? e.status : 502, body: errorBody(e) };
  }
}

module.exports = { configure, handleRequest, parseChannelInput, yt, statsForIds, n, isoDurationToSeconds, cached, monetizationCheck, probeAds };
