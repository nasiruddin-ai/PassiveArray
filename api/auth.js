// Vercel Function: /api/auth
// Passwordless ("magic link") sign-in. There are no passwords to store and no
// user database: a link is signed with a secret, emailed to the address that
// asked for it, and exchanged for a session cookie. Whoever controls the inbox
// controls the account, which is the whole security model.
//
// Environment variables:
//   AUTH_SECRET             required. A long random string. Generate one with:
//                           node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
//   SUBSCRIBE_WEBHOOK_URL   required to deliver the email. The same destination
//                           the sign-up forms use; setup/google-sheet-receiver.gs
//                           sends the link when it sees kind "login".
//   SITE_URL                optional. The public address, used to build the link.
//
// Without AUTH_SECRET the endpoint reports that sign-in is not enabled and
// changes nothing, exactly as the sign-up forms do without a destination.
//
// Actions (?action=...):
//   health      GET   is sign-in enabled on this deployment
//   request     POST  { email }        emails a sign-in link. Always answers ok.
//   verify      POST  { token }        exchanges a link token for a session
//   me          GET                    who the current session belongs to
//   logout      POST                   clears the session
//   preferences POST  { weekly }       stores a preference change
//   delete      POST                   asks for the account's data to be removed

const crypto = require("crypto");

const SECRET = process.env.AUTH_SECRET || "";
const WEBHOOK = process.env.SUBSCRIBE_WEBHOOK_URL || "";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// A link stays valid for its whole window rather than being consumed on first
// use: single-use would need a store of spent tokens, and there is no database
// here by design. The window is kept short for that reason. Everything the
// site says about the link must match this, so do not describe it as one-time.
const LINK_MINUTES = 20;          // how long a sign-in link stays valid
const SESSION_DAYS = 30;          // how long a session lasts
const COOKIE = "pa_session";

/* ------------------------------------------------------------ token signing */

function sign(data) {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  const mac = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  return payload + "." + mac;
}

function verifyToken(token, purpose) {
  if (!SECRET || !token || typeof token !== "string" || token.length > 2000) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;
  const payload = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  const given = Buffer.from(mac);
  const want = Buffer.from(expected);
  if (given.length !== want.length || !crypto.timingSafeEqual(given, want)) return null;
  let data;
  try { data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")); } catch (_) { return null; }
  if (!data || data.p !== purpose || !data.exp || Date.now() > data.exp) return null;
  if (!EMAIL.test(String(data.e || ""))) return null;
  return data;
}

/* ------------------------------------------------------------------ helpers */

function send(res, code, body, cookie) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  if (cookie) res.setHeader("Set-Cookie", cookie);
  res.status(code).send(JSON.stringify(body));
}

function sessionCookie(token, maxAgeSeconds) {
  return [
    COOKIE + "=" + token,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=" + maxAgeSeconds,
  ].join("; ");
}

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

function siteUrl(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const host = req.headers && req.headers.host;
  return host ? "https://" + host : "";
}

// Everything the site stores about a person goes through the same destination
// as the sign-up forms, so there is one place to look and one place to delete.
async function tell(record) {
  if (!WEBHOOK) return false;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      signal: ctrl.signal,
      redirect: "follow",
    });
    if (!r.ok) throw new Error("destination answered " + r.status);
    return true;
  } catch (e) {
    console.error("auth: " + (e && e.message ? e.message : String(e)));
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function parseBody(req) {
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (_) { return null; }
  }
  return body || {};
}

/* ------------------------------------------------------------------- routes */

module.exports = async (req, res) => {
  const action = (req.query && req.query.action) || "";

  if (req.method === "OPTIONS") return send(res, 204, {});

  if (action === "health") {
    return send(res, 200, {
      ok: true,
      enabled: !!SECRET,
      canEmail: !!WEBHOOK,
      hint: !SECRET
        ? "AUTH_SECRET is not set on this deployment. Add it in Vercel settings, then redeploy."
        : !WEBHOOK
          ? "AUTH_SECRET is set but SUBSCRIBE_WEBHOOK_URL is not, so sign-in links cannot be delivered."
          : "Sign-in is enabled.",
    });
  }

  if (action === "me") {
    const s = currentSession(req);
    if (!s) return send(res, 200, { ok: false });
    return send(res, 200, { ok: true, email: s.e, since: s.s || null });
  }

  if (req.method !== "POST") return send(res, 405, { ok: false, error: "Use POST." });

  if (!SECRET) {
    return send(res, 200, { ok: false, code: "disabled", error: "Sign-in is not switched on yet. Every tool works without an account." });
  }

  const body = parseBody(req);
  if (body === null) return send(res, 400, { ok: false, error: "Body must be JSON." });

  /* --- ask for a sign-in link ------------------------------------------- */
  if (action === "request") {
    if (body.website) return send(res, 200, { ok: true }); // honeypot
    const email = String(body.email || "").trim().toLowerCase();
    if (!EMAIL.test(email) || email.length > 200) {
      return send(res, 400, { ok: false, code: "email", error: "Enter a valid email address." });
    }
    if (!WEBHOOK) {
      return send(res, 200, { ok: false, code: "disabled", error: "Sign-in is not switched on yet. Every tool works without an account." });
    }

    const token = sign({ p: "login", e: email, exp: Date.now() + LINK_MINUTES * 60000 });
    const link = siteUrl(req) + "/login/?token=" + encodeURIComponent(token);

    await tell({
      kind: "login",
      email,
      link,
      minutes: LINK_MINUTES,
      source: String(body.source || "").slice(0, 300),
      receivedAt: new Date().toISOString(),
    });

    // Always the same answer, so this cannot be used to discover who has an account.
    return send(res, 200, { ok: true });
  }

  /* --- exchange a link for a session ------------------------------------ */
  if (action === "verify") {
    const data = verifyToken(String(body.token || ""), "login");
    if (!data) {
      return send(res, 400, { ok: false, code: "bad_token", error: "That sign-in link has expired or is not valid. Ask for a new one." });
    }
    const since = data.s || new Date().toISOString().slice(0, 10);
    const session = sign({ p: "session", e: data.e, s: since, exp: Date.now() + SESSION_DAYS * 86400000 });
    return send(res, 200, { ok: true, email: data.e, since }, sessionCookie(session, SESSION_DAYS * 86400));
  }

  /* --- sign out ---------------------------------------------------------- */
  if (action === "logout") {
    return send(res, 200, { ok: true }, sessionCookie("", 0));
  }

  /* --- everything below needs a session ---------------------------------- */
  const session = currentSession(req);
  if (!session) return send(res, 401, { ok: false, code: "no_session", error: "Sign in first." });

  if (action === "preferences") {
    const weekly = body.weekly === true || body.weekly === "true";
    const saved = await tell({
      kind: "preferences",
      email: session.e,
      weekly: weekly ? "yes" : "no",
      receivedAt: new Date().toISOString(),
    });
    if (!saved) return send(res, 502, { ok: false, error: "Could not save that right now. Please try again in a minute." });
    return send(res, 200, { ok: true, weekly });
  }

  if (action === "delete") {
    const saved = await tell({
      kind: "delete",
      email: session.e,
      message: "Account deletion requested from the account page.",
      receivedAt: new Date().toISOString(),
    });
    if (!saved) return send(res, 502, { ok: false, error: "Could not record that right now. Please try again in a minute." });
    return send(res, 200, { ok: true }, sessionCookie("", 0));
  }

  return send(res, 404, { ok: false, error: "Unknown action." });
};
