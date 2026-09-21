// Twitch Helix API helper shared by server.js and netlify/functions/creator-twitch.mjs.
// Needs a Twitch application (Client ID + Client Secret) from dev.twitch.tv/console.
// Uses an app access token, which can read public channel data and follower totals.

const CACHE_TTL_MS = 30 * 60 * 1000;
const cache = new Map();
let settings = { clientId: "", clientSecret: "", timeoutMs: 8000 };
let token = { value: "", until: 0 };

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

async function getToken() {
  if (token.value && token.until > Date.now()) return token.value;
  const body = new URLSearchParams({ client_id: settings.clientId, client_secret: settings.clientSecret, grant_type: "client_credentials" });
  const res = await fetch("https://id.twitch.tv/oauth2/token", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) throw Object.assign(new Error("Twitch rejected the Client ID or Secret."), { code: "bad_key", status: 502 });
  token = { value: data.access_token, until: Date.now() + Math.max(60, (data.expires_in || 3600) - 120) * 1000 };
  return token.value;
}

async function helix(path, params) {
  const url = new URL("https://api.twitch.tv/helix/" + path);
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) v.forEach((x) => url.searchParams.append(k, x));
    else if (v !== undefined && v !== "" && v !== null) url.searchParams.set(k, v);
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), settings.timeoutMs);
  try {
    const res = await fetch(url, { headers: { "Client-Id": settings.clientId, Authorization: "Bearer " + (await getToken()) }, signal: ctrl.signal });
    const data = await res.json().catch(() => ({}));
    if (res.status === 429) throw Object.assign(new Error("Twitch rate limit reached. Try again in a minute."), { code: "quota", status: 429 });
    if (!res.ok) throw Object.assign(new Error(data.message || "Twitch API error " + res.status), { code: "api", status: res.status });
    return data;
  } finally {
    clearTimeout(timer);
  }
}

function cleanLogin(raw) {
  let s = String(raw || "").trim().toLowerCase();
  const m = /twitch\.tv\/([a-z0-9_]+)/i.exec(s);
  if (m) s = m[1].toLowerCase();
  return s.replace(/^@/, "").replace(/[^a-z0-9_]/g, "");
}

async function getChannel(rawLogin) {
  const login = cleanLogin(rawLogin);
  if (!login) throw Object.assign(new Error("Enter a Twitch username."), { code: "input", status: 400 });
  return cached("ch:" + login, async () => {
    const users = await helix("users", { login });
    const u = users.data?.[0];
    if (!u) throw Object.assign(new Error("No Twitch channel named \"" + login + "\"."), { code: "not_found", status: 404 });

    const [followers, streams, videos, info] = await Promise.all([
      helix("channels/followers", { broadcaster_id: u.id, first: 1 }).catch(() => ({ total: null })),
      helix("streams", { user_id: u.id }).catch(() => ({ data: [] })),
      helix("videos", { user_id: u.id, first: 10, sort: "time" }).catch(() => ({ data: [] })),
      helix("channels", { broadcaster_id: u.id }).catch(() => ({ data: [] })),
    ]);

    const live = streams.data?.[0];
    const vids = (videos.data || []).map((v) => ({ id: v.id, title: v.title, views: Number(v.view_count) || 0, publishedAt: v.published_at || v.created_at, type: v.type, url: v.url }));
    const avgViews = vids.length ? vids.reduce((a, v) => a + v.views, 0) / vids.length : 0;
    const created = new Date(u.created_at).getTime();
    const years = Math.max(0.1, (Date.now() - created) / (365.25 * 86400000));

    return {
      id: u.id,
      login: u.login,
      displayName: u.display_name,
      url: "https://www.twitch.tv/" + u.login,
      description: (u.description || "").slice(0, 300),
      profileImage: u.profile_image_url,
      broadcasterType: u.broadcaster_type || "none",
      createdAt: u.created_at,
      accountYears: Math.round(years * 10) / 10,
      followers: followers.total,
      followersPerYear: followers.total != null ? Math.round(followers.total / years) : null,
      game: info.data?.[0]?.game_name || "",
      lastTitle: info.data?.[0]?.title || "",
      live: live ? { viewers: live.viewer_count, title: live.title, game: live.game_name, startedAt: live.started_at } : null,
      recent: { count: vids.length, avgViews: Math.round(avgViews), videos: vids },
    };
  });
}

function errorBody(e) {
  const code = e.code || "api";
  const messages = {
    no_key: "The Twitch Client ID and Secret are not set up on this site yet.",
    bad_key: "Twitch rejected the Client ID or Secret set on this site.",
  };
  return { ok: false, code, error: messages[code] || e.message || "Something went wrong." };
}

async function handleRequest(action, params = {}) {
  if (!settings.clientId || !settings.clientSecret) return { code: 503, body: errorBody({ code: "no_key" }) };
  try {
    if (action === "channel") return { code: 200, body: { ok: true, channel: await getChannel(params.login) } };
    if (action === "compare") {
      const inputs = ["a", "b", "c"].map((k) => params[k]).filter((v) => v && String(v).trim());
      if (inputs.length < 2) return { code: 400, body: { ok: false, code: "input", error: "Enter at least two usernames." } };
      const channels = await Promise.all(inputs.map((v) => getChannel(v).catch((e) => ({ error: e.message, input: v }))));
      return { code: 200, body: { ok: true, channels } };
    }
    return { code: 404, body: { ok: false, code: "action", error: "Unknown action." } };
  } catch (e) {
    return { code: e.status && e.status < 500 ? e.status : 502, body: errorBody(e) };
  }
}

module.exports = { configure, handleRequest, cleanLogin };
