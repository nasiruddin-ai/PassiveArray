// Reads the signed session cookie that api/auth.js sets, so other functions
// (watchlist, billing) can tell who is calling without duplicating sign-in.
// Same token format and secret as api/auth.js: payload.base64url + "." + HMAC.

const crypto = require("crypto");

const SECRET = process.env.AUTH_SECRET || "";
const COOKIE = "pa_session";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function verifyToken(token, purpose) {
  if (!SECRET || !token || typeof token !== "string" || token.length > 2000) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;
  const payload = token.slice(0, dot);
  const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  const given = Buffer.from(token.slice(dot + 1));
  const want = Buffer.from(expected);
  if (given.length !== want.length || !crypto.timingSafeEqual(given, want)) return null;
  let data;
  try { data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")); } catch (_) { return null; }
  if (!data || data.p !== purpose || !data.exp || Date.now() > data.exp) return null;
  if (!EMAIL.test(String(data.e || ""))) return null;
  return data;
}

/** The session { e: email, s: since, exp } or null. */
function currentSession(req) {
  const raw = req.headers && req.headers.cookie;
  if (!raw) return null;
  for (const part of String(raw).split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() !== COOKIE) continue;
    return verifyToken(part.slice(eq + 1).trim(), "session");
  }
  return null;
}

function json(res, code, body) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(code).send(JSON.stringify(body));
}

function parseBody(req) {
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (_) { return null; }
  }
  return body || {};
}

function siteUrl(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const host = req && req.headers && req.headers.host;
  return host ? "https://" + host : "";
}

module.exports = { currentSession, verifyToken, json, parseBody, siteUrl, COOKIE };
