// Passive Array MCP server: YouTube and Twitch data for AI assistants (Claude, ChatGPT,
// Cursor, VS Code, Gemini CLI...). Core pieces shared by the protocol endpoint
// (lib/api-mcp.js) and the account page (lib/api-mcp-account.js):
//
//   API keys   "pa_" + 43 random base64url chars. Only a SHA-256 hash is stored.
//              mcpkey:<hash>   -> { e: email, id, created, lastUsed }
//              user.mcpKeys    -> [{ id, name, prefix, hash, created }]   (max MAX_KEYS)
//              A key works only while its id is still on the user record, so revoking
//              or deleting the account switches it off at once.
//   Credits    per account per UTC day: mcpuse:<email>:<YYYY-MM-DD>  (INCRBY, 2-day expiry)
//              Free FREE_CREDITS, Pro PRO_CREDITS. Only successful calls are charged.
//   Activity   mcplog:<email>  LIST of the last 50 calls  (30-day expiry)
//
// Every tool wraps code the website already runs, returns measured numbers, and says
// where they came from. Nothing here models search volume or invents history.

const crypto = require("crypto");
const store = require("./store.js");
const users = require("./users.js");
const pro = require("./pro.js");
const youtube = require("../creator-tools/lib/youtube.js");
const twitch = require("../creator-tools/lib/twitch.js");

const FREE_CREDITS = Number(process.env.MCP_FREE_CREDITS) || 50;
const PRO_CREDITS = Number(process.env.MCP_PRO_CREDITS) || 1000;
const MAX_KEYS = 5;
const day = () => new Date().toISOString().slice(0, 10);
const sha = (s) => crypto.createHash("sha256").update(String(s)).digest("hex");

/* ------------------------------------------------------------------ keys */
function newKey() {
  return "pa_" + crypto.randomBytes(32).toString("base64url");
}

async function createKey(email, name) {
  const user = (await users.get(email)) || users.blank(email);
  const keys = Array.isArray(user.mcpKeys) ? user.mcpKeys : [];
  if (keys.length >= MAX_KEYS) {
    const e = new Error("You can have " + MAX_KEYS + " keys. Revoke one you no longer use first.");
    e.code = "limit"; e.status = 400; throw e;
  }
  const key = newKey();
  const hash = sha(key);
  const rec = { id: crypto.randomBytes(6).toString("hex"), name: String(name || "").trim().slice(0, 40) || "Key " + (keys.length + 1), prefix: key.slice(0, 10), hash, created: new Date().toISOString() };
  keys.push(rec);
  user.mcpKeys = keys;
  await users.save(user);
  await store.setJson("mcpkey:" + hash, { e: user.email, id: rec.id, created: rec.created, lastUsed: null });
  return { key, record: rec };
}

async function revokeKey(email, id) {
  const user = await users.get(email);
  if (!user || !Array.isArray(user.mcpKeys)) return false;
  const rec = user.mcpKeys.find((k) => k.id === id);
  if (!rec) return false;
  user.mcpKeys = user.mcpKeys.filter((k) => k.id !== id);
  await users.save(user);
  await store.del("mcpkey:" + rec.hash).catch(() => {});
  return true;
}

async function revokeAll(email) {
  const user = await users.get(email);
  if (!user || !Array.isArray(user.mcpKeys)) return;
  for (const k of user.mcpKeys) await store.del("mcpkey:" + k.hash).catch(() => {});
  await store.del("mcplog:" + user.email).catch(() => {});
}

/** Returns { user, keyId, prefix } for a valid key, or null. */
async function resolveKey(key) {
  if (!/^pa_[\w-]{40,60}$/.test(String(key || ""))) return null;
  const hash = sha(key);
  const rec = await store.getJson("mcpkey:" + hash);
  if (!rec) return null;
  const user = await users.get(rec.e);
  const onUser = user && Array.isArray(user.mcpKeys) && user.mcpKeys.find((k) => k.id === rec.id && k.hash === hash);
  if (!onUser) return null;
  rec.lastUsed = new Date().toISOString();
  store.setJson("mcpkey:" + hash, rec).catch(() => {});
  return { user, keyId: rec.id, prefix: onUser.prefix };
}

async function keyDetails(user) {
  const keys = Array.isArray(user.mcpKeys) ? user.mcpKeys : [];
  if (!keys.length) return [];
  const recs = await store.pipeline(keys.map((k) => ["GET", "mcpkey:" + k.hash])).catch(() => []);
  return keys.map((k, i) => {
    let lastUsed = null;
    try { lastUsed = recs[i] && recs[i].result ? JSON.parse(recs[i].result).lastUsed : null; } catch (_) { /* ignore */ }
    return { id: k.id, name: k.name, prefix: k.prefix, created: k.created, lastUsed };
  });
}

/* ------------------------------------------------------------------ credits and activity */
function creditLimit(user) {
  return pro.isPro(user) ? PRO_CREDITS : FREE_CREDITS;
}

async function creditsUsed(email) {
  const v = await store.cmd(["GET", "mcpuse:" + email + ":" + day()]).catch(() => null);
  return Number(v) || 0;
}

async function charge(email, credits) {
  const k = "mcpuse:" + email + ":" + day();
  await store.pipeline([["INCRBY", k, String(credits)], ["EXPIRE", k, String(2 * 86400)]]);
}

async function logCall(email, entry) {
  const k = "mcplog:" + email;
  await store.pipeline([["LPUSH", k, JSON.stringify(entry)], ["LTRIM", k, "0", "49"], ["EXPIRE", k, String(30 * 86400)]]).catch(() => {});
}

async function activity(email) {
  const raw = (await store.cmd(["LRANGE", "mcplog:" + email, "0", "49"]).catch(() => [])) || [];
  return raw.map((r) => { try { return JSON.parse(r); } catch (_) { return null; } }).filter(Boolean);
}

function nextReset() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1)).toISOString();
}

async function usageFor(user) {
  const limit = creditLimit(user);
  const used = await creditsUsed(user.email);
  return { plan: pro.planName(user), limit, used, remaining: Math.max(0, limit - used), resetsAt: nextReset() };
}

/* ------------------------------------------------------------------ tools */
function configureApis() {
  youtube.configure({ apiKey: process.env.YOUTUBE_API_KEY || process.env.GOOGLE_API_KEY || "", timeoutMs: 8000, measuredViews: require("./measured-views.js") });
  twitch.configure({ clientId: process.env.TWITCH_CLIENT_ID || "", clientSecret: process.env.TWITCH_CLIENT_SECRET || "", timeoutMs: 8000 });
}

function fail(message, code) {
  return Object.assign(new Error(message), { code: code || "input", toolError: true });
}

// Unwraps the { code, body } shape the tool libraries return.
function unwrap(r) {
  if (r && r.body && r.body.ok) return r.body;
  throw fail((r && r.body && r.body.error) || "Something went wrong.", (r && r.body && r.body.code) || "api");
}

const str = (desc, extra) => ({ type: "string", description: desc, ...(extra || {}) });
const int = (desc, min, max, def) => ({ type: "integer", description: desc, minimum: min, maximum: max, default: def });
const CHANNEL = str("YouTube channel: a link, an @handle, a channel ID starting with UC, or a name. A link or @handle is most reliable.");

function monthlyViews(ch) {
  const r = ch.recent || {};
  if (r.last30Count >= 2) return { views: r.last30Views, basis: r.last30Count + " videos uploaded in the last 30 days" };
  const perMonth = Math.max(r.uploadsPerMonth || 0, 1);
  return { views: Math.round((r.avgViews || 0) * perMonth), basis: "average views on the last " + (r.count || 0) + " uploads x " + perMonth + " uploads a month" };
}

const SUB_NOTE = "YouTube rounds public subscriber counts to three significant figures; views and video counts are exact.";

const TOOLS = [
  {
    name: "get_channel_stats",
    title: "YouTube channel stats",
    credits: 1,
    description: "Live public stats for a YouTube channel from the official YouTube Data API: subscribers, total views, video count, country, creation date, keywords, topics, and the last 10 uploads with views, likes, comments, length and date, plus averages (views, likes, comments, uploads per month, Shorts share).",
    inputSchema: { type: "object", properties: { channel: CHANNEL }, required: ["channel"] },
    run: async (a) => ({ channel: unwrap(await youtube.handleRequest("channel", { channel: a.channel })).channel, note: SUB_NOTE, source: "YouTube Data API v3" }),
    arg: (a) => a.channel,
  },
  {
    name: "get_channel_growth",
    title: "YouTube channel growth history",
    credits: 1,
    description: "Daily subscriber, view and video-count history for a YouTube channel as recorded by Passive Array, with 1, 7, 30, 90 and 365-day change. History starts the day Passive Array first tracked the channel; nothing earlier is backfilled or estimated. Looking a channel up adds it to daily tracking.",
    inputSchema: { type: "object", properties: { channel: CHANNEL, days: int("How many most recent daily points to return.", 1, 400, 90) }, required: ["channel"] },
    run: async (a) => {
      const g = await require("./growth.js").youtubeHistory({ channel: a.channel });
      const b = unwrap(g);
      const days = Math.max(1, Math.min(400, Number(a.days) || 90));
      const { recent, ...channel } = b.channel;
      return {
        channel: { id: channel.id, title: channel.title, handle: channel.handle, url: channel.url, subscribers: channel.subscribers, hiddenSubscribers: channel.hiddenSubscribers, views: channel.views, videos: channel.videos },
        tracking: b.tracking,
        changes: b.changes,
        series: b.series.slice(-days).map((p) => ({ date: p.d, subscribers: p.s, views: p.v, videos: p.n })),
        note: "Points are recorded once a day around 05:45 UTC. " + SUB_NOTE,
      };
    },
    arg: (a) => a.channel,
  },
  {
    name: "check_monetization",
    title: "YouTube monetization check",
    credits: 2,
    description: "Estimates whether a YouTube channel is in the YouTube Partner Program from public signals: subscriber thresholds, uploads in the last 90 days, made-for-kids flags and, when visible, ad placements on recent videos. Returns a verdict with a confidence percentage, never a certainty, and an ad-revenue range when likely monetized.",
    inputSchema: { type: "object", properties: { channel: CHANNEL }, required: ["channel"] },
    run: async (a) => {
      const b = unwrap(await youtube.handleRequest("monetization", { channel: a.channel }));
      const { ok, ...rest } = b;
      return { ...rest, note: "YouTube never publishes Partner Program status and watch hours are private, so this is an indication from public data, not proof." };
    },
    arg: (a) => a.channel,
  },
  {
    name: "compare_channels",
    title: "Compare YouTube channels",
    credits: 2,
    description: "Side-by-side live stats for two or three YouTube channels: subscribers, total views, videos, average views, likes and comments on recent uploads, upload pace and Shorts share.",
    inputSchema: { type: "object", properties: { channels: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 3, description: "Two or three channels (links, @handles, IDs or names)." } }, required: ["channels"] },
    run: async (a) => {
      const list = (Array.isArray(a.channels) ? a.channels : []).map(String).filter((s) => s.trim()).slice(0, 3);
      if (list.length < 2) throw fail("Give two or three channels.");
      const b = unwrap(await youtube.handleRequest("compare", { a: list[0], b: list[1], c: list[2] || "" }));
      return {
        channels: b.channels.map((c) => (c.error ? { input: c.input, error: c.error } : {
          title: c.title, handle: c.handle, url: c.url, country: c.country, subscribers: c.subscribers, hiddenSubscribers: c.hiddenSubscribers, views: c.views, videos: c.videos,
          avgViews: Math.round(c.recent.avgViews), avgLikes: Math.round(c.recent.avgLikes), avgComments: Math.round(c.recent.avgComments),
          engagementRatePct: c.recent.avgViews ? Math.round(((c.recent.avgLikes + c.recent.avgComments) / c.recent.avgViews) * 10000) / 100 : null,
          uploadsPerMonth: c.recent.uploadsPerMonth, shortsSharePct: Math.round(c.recent.shortsShare * 100), viewsLast30Days: c.recent.last30Views,
        })),
        note: "Averages use each channel's 10 most recent uploads. " + SUB_NOTE,
      };
    },
    arg: (a) => (Array.isArray(a.channels) ? a.channels.join(" vs ") : ""),
  },
  {
    name: "get_video_stats",
    title: "YouTube video stats",
    credits: 1,
    description: "Live stats for up to 50 YouTube videos: title, channel, publish date, views, likes, comments, length, whether it is live, tag count and tags, plus the channel's subscriber count.",
    inputSchema: { type: "object", properties: { videos: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 50, description: "Video links, Shorts links or 11-character video IDs." } }, required: ["videos"] },
    run: async (a) => {
      const ids = (Array.isArray(a.videos) ? a.videos : [a.videos]).map((v) => youtube.parseVideoId(v)).filter(Boolean).slice(0, 50);
      if (!ids.length) throw fail("No valid YouTube video link or ID was given.");
      return { videos: unwrap(await youtube.handleRequest("videos", { ids: ids.join(",") })).videos, source: "YouTube Data API v3" };
    },
    arg: (a) => (Array.isArray(a.videos) ? a.videos.length + " video(s)" : String(a.videos || "")),
  },
  {
    name: "get_video_comments",
    title: "YouTube video comments",
    credits: 2,
    description: "Public comments on a YouTube video or Short, with author, text, likes, reply count and date, plus up to 5 replies per comment. Comments held for review, flagged as spam or deleted are never returned by YouTube's API.",
    inputSchema: { type: "object", properties: { video: str("Video link, Shorts link or 11-character video ID."), max: int("Top-level comments to read.", 1, 500, 100), order: { type: "string", enum: ["relevance", "time"], default: "relevance", description: "relevance = YouTube's top comments, time = newest first." } }, required: ["video"] },
    run: async (a) => {
      const max = Math.max(1, Math.min(500, Number(a.max) || 100));
      const d = await youtube.getComments(a.video, { max: Math.max(100, max), order: a.order });
      const top = d.comments.filter((c) => !c.parent).slice(0, max);
      const keep = new Set(top.map((c) => c.id));
      const comments = d.comments.filter((c) => keep.has(c.id) || keep.has(c.parent)).map((c) => ({ ...c, text: c.text.length > 600 ? c.text.slice(0, 600) + "…" : c.text }));
      return { video: d.video, order: d.order, returned: comments.length, topLevel: top.length, moreAvailable: d.truncated || d.topLevel > max, comments };
    },
    arg: (a) => a.video,
  },
  {
    name: "keyword_research",
    title: "YouTube keyword research",
    credits: 5,
    description: "Measured YouTube keyword research: YouTube search autocomplete suggestions for the phrase, the top 10 videos ranking for it today (views, channel size, age, engagement), competition metrics and an opportunity score with its formula. No search-volume number is returned, because nobody outside Google measures YouTube search volume.",
    inputSchema: { type: "object", properties: { keyword: str("The search phrase, e.g. \"budget travel japan\".") }, required: ["keyword"] },
    run: async (a) => {
      const research = require("./research.js");
      const q = research.cleanKeyword(a.keyword || "");
      if (!q) throw fail("Give a keyword or phrase.");
      const [analysis, sug] = await Promise.all([research.analyzeKeyword(q), research.suggestions(q).catch(() => null)]);
      const autocomplete = sug ? { top: (sug.base || []).slice(0, 10), related: (sug.expanded || []).slice(0, 20).map((e) => ({ phrase: e.phrase, seenIn: e.count })) } : null;
      return { ...analysis, autocomplete, note: "autocomplete.top is YouTube's own suggestion list in order; autocomplete.related are phrases seen across expanded autocomplete queries. Results are cached up to 7 days. The score weighs competition, channel sizes, freshness and views; it is not a search volume." };
    },
    arg: (a) => a.keyword,
  },
  {
    name: "get_outlier_videos",
    title: "Outlier videos",
    credits: 1,
    description: "Videos that are getting far more views than their channel's usual upload (views divided by the channel's median), from Passive Array's daily scan of tracked channels. Filter by topic, long-form or Shorts, and age. Good for spotting ideas that are working right now.",
    inputSchema: { type: "object", properties: {
      type: { type: "string", enum: ["all", "videos", "shorts"], default: "all", description: "videos = long-form only, shorts = Shorts only." },
      topic: str("Optional topic filter, e.g. Gaming, Technology, Food, Lifestyle."),
      days: int("Only videos published in the last N days.", 1, 365, 30),
      min_multiplier: { type: "number", description: "Minimum views multiple over the channel's median.", default: 3 },
      limit: int("How many videos to return.", 1, 50, 20),
    } },
    run: async (a) => {
      const feed = await require("./outliers.js").getFeed({ type: a.type || "all", topic: a.topic || "", days: Number(a.days) || 30, minX: a.min_multiplier == null ? 3 : Number(a.min_multiplier), sort: "multiplier", limit: Math.max(1, Math.min(50, Number(a.limit) || 20)) });
      return { updatedAt: feed.updatedAt, matching: feed.total, videos: feed.items, topics: feed.topics, note: "Multiplier = views / the channel's median views on recent uploads. At most two videos per channel." };
    },
    arg: (a) => [a.type, a.topic].filter(Boolean).join(" ") || "all",
  },
  {
    name: "estimate_earnings",
    title: "Estimate YouTube ad earnings",
    credits: 1,
    description: "Estimates a channel's monthly and yearly YouTube ad earnings as a range: views on uploads from the last 30 days times an RPM range (what creators keep per 1,000 views). Excludes sponsorships, memberships and merchandise.",
    inputSchema: { type: "object", properties: { channel: CHANNEL, rpm_low: { type: "number", default: 0.5, description: "Low RPM in USD per 1,000 views." }, rpm_high: { type: "number", default: 4, description: "High RPM in USD per 1,000 views." } }, required: ["channel"] },
    run: async (a) => {
      const ch = unwrap(await youtube.handleRequest("channel", { channel: a.channel })).channel;
      let lo = Number(a.rpm_low), hi = Number(a.rpm_high);
      if (!isFinite(lo) || lo < 0) lo = 0.5;
      if (!isFinite(hi) || hi < 0) hi = 4;
      if (hi < lo) [lo, hi] = [hi, lo];
      const mv = monthlyViews(ch);
      const r2 = (x) => Math.round(x * 100) / 100;
      return {
        channel: { title: ch.title, handle: ch.handle, url: ch.url, subscribers: ch.subscribers },
        monthlyViews: mv.views, basis: mv.basis, rpmUsd: { low: lo, high: hi },
        monthlyEarningsUsd: { low: r2((mv.views / 1000) * lo), high: r2((mv.views / 1000) * hi) },
        yearlyEarningsUsd: { low: r2((mv.views / 1000) * lo * 12), high: r2((mv.views / 1000) * hi * 12) },
        shortsSharePct: Math.round((ch.recent.shortsShare || 0) * 100),
        note: (ch.recent.shortsShare >= 0.5 ? "Over half of recent uploads are Shorts, which pay far less per view, so the real figure is likely lower. " : "") + "An estimate from public view counts, not the channel's real revenue.",
      };
    },
    arg: (a) => a.channel,
  },
  {
    name: "search_channels",
    title: "Find YouTube channels",
    credits: 5,
    description: "Finds YouTube channels by keyword or niche, optionally limited to a country (ISO code such as US, GB, IN, BD, PK) and a subscriber range. Returns up to 25 channels with subscribers, views, videos and country.",
    inputSchema: { type: "object", properties: { query: str("Niche or keyword, e.g. \"home espresso\"."), country: str("Optional two-letter country code."), min_subscribers: { type: "integer", minimum: 0 }, max_subscribers: { type: "integer", minimum: 0 } }, required: ["query"] },
    run: async (a) => ({ channels: unwrap(await youtube.handleRequest("search", { q: a.query, country: String(a.country || "").toUpperCase().slice(0, 2), minSubs: a.min_subscribers || 0, maxSubs: a.max_subscribers || 0 })).channels, note: "Country is the one the channel declares on YouTube; many channels leave it blank." }),
    arg: (a) => a.query,
  },
  {
    name: "get_twitch_channel",
    title: "Twitch channel and follower history",
    credits: 1,
    description: "A Twitch streamer's live data from the official Twitch Helix API (exact follower total, partner status, live status and viewers, recent videos) plus the daily follower history Passive Array has recorded, with 7, 30 and 90-day change.",
    inputSchema: { type: "object", properties: { login: str("Twitch username or twitch.tv link.") }, required: ["login"] },
    run: async (a) => {
      const b = unwrap(await require("./growth.js").twitchHistory({ login: a.login }));
      return { channel: b.channel, tracking: b.tracking, changes: b.changes, series: b.series.slice(-90).map((p) => ({ date: p.d, followers: p.f })), note: "History starts the day Passive Array first tracked the channel." };
    },
    arg: (a) => a.login,
  },
];

function publicTools() {
  return TOOLS.map((t) => ({
    name: t.name,
    title: t.title,
    description: t.description + " Costs " + t.credits + " Passive Array credit" + (t.credits === 1 ? "" : "s") + ".",
    inputSchema: t.inputSchema,
    annotations: { title: t.title, readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  }));
}

function toolSummary() {
  return TOOLS.map((t) => ({ name: t.name, title: t.title, credits: t.credits, description: t.description }));
}

/** Runs one tool for a resolved key. Returns { ok, result } or { ok: false, message }. */
async function callTool(ctx, name, args) {
  const tool = TOOLS.find((t) => t.name === name);
  if (!tool) return { ok: false, message: "Unknown tool: " + name, unknown: true };
  const email = ctx.user.email;
  const limit = creditLimit(ctx.user);
  const used = await creditsUsed(email);
  const argText = String((tool.arg && tool.arg(args || {})) || "").slice(0, 80);
  const at = new Date().toISOString();
  if (used + tool.credits > limit) {
    await logCall(email, { tool: name, arg: argText, at, ok: false, credits: 0, error: "out of credits", key: ctx.prefix });
    return { ok: false, message: "Your Passive Array credits for today are used up (" + used + " of " + limit + "). They reset at 00:00 UTC." + (pro.isPro(ctx.user) ? "" : " Pro raises the daily allowance to " + PRO_CREDITS + ": https://passivearray.com/pricing/") };
  }
  const { limited } = await store.hitLimit("mcprate:" + email, 30, 60);
  if (limited) return { ok: false, message: "Too many calls in the last minute. Wait a moment and try again." };
  configureApis();
  try {
    const result = await tool.run(args || {});
    await charge(email, tool.credits);
    await logCall(email, { tool: name, arg: argText, at, ok: true, credits: tool.credits, key: ctx.prefix });
    return { ok: true, result, credits: tool.credits, remaining: Math.max(0, limit - used - tool.credits) };
  } catch (e) {
    const message = e.toolError || e.code ? e.message : "Something went wrong while fetching the data.";
    if (!e.toolError && !e.code) console.error("mcp " + name + ": " + e.stack);
    await logCall(email, { tool: name, arg: argText, at, ok: false, credits: 0, error: String(message).slice(0, 120), key: ctx.prefix });
    return { ok: false, message };
  }
}

module.exports = { createKey, revokeKey, revokeAll, resolveKey, keyDetails, usageFor, activity, publicTools, toolSummary, callTool, FREE_CREDITS, PRO_CREDITS, MAX_KEYS };
