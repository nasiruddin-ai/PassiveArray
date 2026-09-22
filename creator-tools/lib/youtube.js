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
  const vd = await yt("videos", { part: "snippet,statistics,contentDetails", id: ids.join(",") });
  return (vd.items || []).map((v) => ({
    id: v.id,
    title: v.snippet?.title,
    publishedAt: v.snippet?.publishedAt,
    views: n(v.statistics?.viewCount),
    likes: n(v.statistics?.likeCount),
    comments: n(v.statistics?.commentCount),
    seconds: isoDurationToSeconds(v.contentDetails?.duration),
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
    return { code: 404, body: { ok: false, code: "action", error: "Unknown action." } };
  } catch (e) {
    return { code: e.status && e.status < 500 ? e.status : 502, body: errorBody(e) };
  }
}

module.exports = { configure, handleRequest, parseChannelInput };
