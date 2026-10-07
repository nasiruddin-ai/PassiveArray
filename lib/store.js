// Tiny key-value store over the Upstash Redis REST API, which is also what
// Vercel KV is underneath. Plain fetch, no driver to install.
//
// Set either pair of environment variables (Vercel KV sets the first pair for
// you when you attach a store to the project):
//   KV_REST_API_URL / KV_REST_API_TOKEN
//   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
//
// Without them `enabled()` is false and the caller is expected to say so
// honestly rather than pretend to have saved something.

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

function enabled() {
  return !!(URL_ && TOKEN);
}

async function cmd(args) {
  if (!enabled()) throw new Error("store not configured");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const r = await fetch(URL_, {
      method: "POST",
      headers: { Authorization: "Bearer " + TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify(args),
      signal: ctrl.signal,
    });
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch (_) { throw new Error("store answered " + r.status); }
    if (!r.ok || (data && data.error)) throw new Error("store: " + ((data && data.error) || r.status));
    return data.result;
  } finally {
    clearTimeout(timer);
  }
}

async function getJson(key) {
  const raw = await cmd(["GET", key]);
  if (raw == null) return null;
  try { return JSON.parse(raw); } catch (_) { return null; }
}

async function setJson(key, value, ttlSeconds) {
  const args = ["SET", key, JSON.stringify(value)];
  if (ttlSeconds) args.push("EX", String(ttlSeconds));
  return cmd(args);
}

async function del(key) {
  return cmd(["DEL", key]);
}

/**
 * Counts one hit against a key and says whether the limit is now exceeded.
 * Fails open: if the store is unreachable we let the request through rather
 * than locking everyone out, which is the right trade for a free tools site.
 */
async function hitLimit(key, max, windowSeconds) {
  if (!enabled()) return { limited: false, count: 0 };
  try {
    const count = await cmd(["INCR", key]);
    if (count === 1) await cmd(["EXPIRE", key, String(windowSeconds)]);
    return { limited: count > max, count };
  } catch (e) {
    console.error("store: rate limit check failed, allowing through: " + e.message);
    return { limited: false, count: 0 };
  }
}

async function clearLimit(key) {
  if (!enabled()) return;
  try { await del(key); } catch (_) { /* not important */ }
}

/** Several commands in one round trip. Returns [{ result } | { error }] in order. */
async function pipeline(cmds) {
  if (!cmds.length) return [];
  if (!enabled()) throw new Error("store not configured");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(URL_.replace(/\/$/, "") + "/pipeline", {
      method: "POST",
      headers: { Authorization: "Bearer " + TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify(cmds),
      signal: ctrl.signal,
    });
    const data = await r.json().catch(() => null);
    if (!r.ok || !Array.isArray(data)) throw new Error("store pipeline answered " + r.status);
    return data;
  } finally {
    clearTimeout(timer);
  }
}

/** Every key matching a glob, up to max. Uses SCAN so it never blocks the store. */
async function scanKeys(match, max) {
  const out = [];
  let cursor = "0";
  do {
    const r = await cmd(["SCAN", cursor, "MATCH", match, "COUNT", "200"]);
    cursor = String(r[0]);
    for (const k of r[1] || []) out.push(k);
    if (max && out.length >= max) break;
  } while (cursor !== "0");
  return out;
}

async function smembers(key) {
  if (!enabled()) return [];
  try { return (await cmd(["SMEMBERS", key])) || []; } catch (_) { return []; }
}

module.exports = { enabled, cmd, pipeline, scanKeys, smembers, getJson, setJson, del, hitLimit, clearLimit };
