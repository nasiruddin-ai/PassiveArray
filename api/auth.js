// Vercel Function: /api/auth
//
// Three ways in, all ending at the same signed session cookie:
//   1. Google        an ID token from Google Identity Services, verified here
//   2. Password      scrypt-hashed, stored in the key-value store
//   3. Email link    passwordless, signed with AUTH_SECRET, no storage needed
//
// Environment variables:
//   AUTH_SECRET             required for any sign-in. A long random string:
//                           node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
//   GOOGLE_CLIENT_ID        enables the Google button
//   KV_REST_API_URL/TOKEN   enables passwords (Vercel KV or Upstash Redis)
//   SUBSCRIBE_WEBHOOK_URL   enables the email link, and records sign-ups
//   SITE_URL                the public address, used to build email links
//
// Each method reports itself as unavailable when its own configuration is
// missing, rather than failing in a way that looks like a bug.
//
// Actions (?action=...):
//   health        GET   which methods are switched on
//   google        POST  { credential }              sign in with Google
//   register      POST  { email, password }         create a password account
//   password      POST  { email, password }         sign in with a password
//   request       POST  { email }                   email a sign-in link
//   verify        POST  { token }                   exchange a link for a session
//   set-password  POST  { password }                add or change a password
//   me            GET                               who the session belongs to
//   logout        POST
//   preferences   POST  { weekly }
//   delete        POST

const crypto = require("crypto");
const store = require("../lib/store.js");
const users = require("../lib/users.js");
const google = require("../lib/google.js");
const youtube = require("../creator-tools/lib/youtube.js");
const report = require("../lib/channel-report.js");

const SECRET = process.env.AUTH_SECRET || "";
const WEBHOOK = process.env.SUBSCRIBE_WEBHOOK_URL || "";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Common disposable / throwaway email domains blocked at sign-up so fake mails cannot register.
const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "sharklasers.com", "grr.la",
  "10minutemail.com", "10minutemail.net", "tempmail.com", "temp-mail.org", "temp-mail.io",
  "yopmail.com", "yopmail.fr", "yopmail.net", "trashmail.com", "trashmail.net", "getnada.com",
  "maildrop.cc", "dispostable.com", "fakeinbox.com", "mohmal.com", "throwawaymail.com",
  "EmailOnDeck.com".toLowerCase(), "mintemail.com", "mytemp.email", "burnermail.io",
  "guerrillamailblock.com", "pokemail.net", "spam4.me", "tmpmail.net", "tmpmail.org",
]);

function isDisposableEmail(email) {
  const at = String(email || "").lastIndexOf("@");
  if (at < 0) return true;
  const dom = String(email).slice(at + 1).toLowerCase();
  if (!dom || dom.endsWith(".test") || dom.endsWith(".invalid") || dom.endsWith(".example") || dom === "example.com") return true;
  return DISPOSABLE.has(dom);
}

// A link stays valid for its whole window rather than being consumed on first
// use: single-use would need a store of spent tokens. Everything the site says
// about the link must match this, so do not describe it as one-time.
const LINK_MINUTES = 20;
const SESSION_DAYS = 30;
const COOKIE = "pa_session";

// Deliberately vague, so a wrong password and an unknown address look the same.
const BAD_LOGIN = "That email address and password do not match an account.";

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

/* ------------------------------------------------------------------ helpers */

function send(res, code, body, cookie) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  if (cookie) res.setHeader("Set-Cookie", cookie);
  res.status(code).send(JSON.stringify(body));
}

function sessionCookie(token, maxAgeSeconds) {
  return [COOKIE + "=" + token, "Path=/", "HttpOnly", "Secure", "SameSite=Lax", "Max-Age=" + maxAgeSeconds].join("; ");
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

function startSession(res, email, since, extra) {
  const token = sign({ p: "session", e: email, s: since, exp: Date.now() + SESSION_DAYS * 86400000 });
  return send(res, 200, Object.assign({ ok: true, email, since }, extra || {}), sessionCookie(token, SESSION_DAYS * 86400));
}

function siteUrl(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const host = req.headers && req.headers.host;
  return host ? "https://" + host : "";
}

function clientIp(req) {
  const fwd = (req.headers && req.headers["x-forwarded-for"]) || "";
  return String(fwd).split(",")[0].trim() || "unknown";
}

// Everything the site keeps about a person also goes to the sign-up
// destination, so there is one place to look and one place to delete.
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

/* Resolves a single YouTube @handle / URL / channel ID using the YouTube Data API. */
async function resolveSignupChannel(raw) {
  const input = String(raw || "").trim().slice(0, 120);
  if (!input) return null;
  const apiKey = process.env.YOUTUBE_API_KEY || process.env.GOOGLE_API_KEY || "";
  if (!apiKey) return { handle: input, id: "", title: input };
  youtube.configure({ apiKey, timeoutMs: 8000 });
  const r = await youtube.handleRequest("channel", { channel: input });
  if (!r || !r.body || !r.body.ok || !r.body.channel) {
    const err = new Error((r && r.body && r.body.error) || "Could not find that YouTube channel. Check your @handle or channel link.");
    err.code = "channel";
    throw err;
  }
  const ch = r.body.channel;
  return { handle: ch.handle || input, id: ch.id || "", title: ch.title || "" };
}

/* Sends the one-time welcome greeting email (with Chrome extension install link
   and, if the user has a channel, their channel snapshot) once their email is verified. */
async function sendWelcomeIfNeeded(user, req) {
  if (!user || !user.verified || user.welcomeSentAt || user.weekly === false || !WEBHOOK) return false;
  const site = siteUrl(req);
  const unsubToken = sign({ p: "unsub", e: user.email, exp: Date.now() + 365 * 86400000 });
  const unsubscribeUrl = site + "/api/channel?action=unsubscribe&t=" + encodeURIComponent(unsubToken);
  let channelReport = null;
  if (user.channel) {
    try {
      const chan = require("../lib/api-channel.js");
      const p = await chan.insights(user);
      if (p && p.ok) channelReport = p;
    } catch (_) {}
  }
  const mail = report.buildWelcome({ site, channelReport, unsubscribeUrl });
  const ok = await tell({
    kind: "digest",
    email: user.email,
    subject: mail.subject,
    html: mail.html,
    message: mail.text,
    channel: user.channel || "",
    channelId: user.channelId || "",
    source: "welcome-signup",
    receivedAt: new Date().toISOString(),
  });
  if (ok && store.enabled()) {
    const now = new Date().toISOString();
    user.welcomeSentAt = now;
    if (channelReport) { user.reportSentAt = now; user.lastReportAt = now; }
    try { await users.save(user); } catch (_) {}
  }
  return ok;
}

function parseBody(req) {
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (_) { return null; }
  }
  return body || {};
}

const tooMany = (res, what) =>
  send(res, 429, { ok: false, code: "rate", error: "Too many " + what + ". Wait a few minutes and try again." });

/* ------------------------------------------------------------------- routes */

module.exports = async (req, res) => {
  const action = (req.query && req.query.action) || "";

  if (req.method === "OPTIONS") return send(res, 204, {});

  if (action === "health") {
    const methods = { link: !!(SECRET && WEBHOOK), google: !!(SECRET && google.clientId()), password: !!(SECRET && store.enabled()) };
    return send(res, 200, {
      ok: true,
      enabled: !!SECRET,
      methods,
      googleClientId: methods.google ? google.clientId() : "",
      minPassword: users.MIN_PASSWORD,
      hint: !SECRET
        ? "AUTH_SECRET is not set on this deployment. Add it in Vercel settings, then redeploy."
        : Object.values(methods).some(Boolean)
          ? "Sign-in is enabled."
          : "AUTH_SECRET is set but no sign-in method is configured yet.",
    });
  }

  if (action === "me") {
    const s = currentSession(req);
    if (!s) return send(res, 200, { ok: false });
    let profile = null;
    if (store.enabled()) {
      try { profile = await users.get(s.e); } catch (_) { /* store down, session is still valid */ }
    }
    return send(res, 200, {
      ok: true,
      email: s.e,
      since: (profile && profile.created) || s.s || null,
      google: !!(profile && profile.google),
      hasPassword: !!(profile && profile.pw),
      weekly: profile ? profile.weekly !== false : true,
      verified: profile ? !!profile.verified : false,
      pro: require("../lib/pro.js").isPro(profile),
      plan: require("../lib/pro.js").planName(profile),
      watch: profile && Array.isArray(profile.watch) ? profile.watch.length : 0,
      channel: profile && profile.channel ? String(profile.channel) : "",
      channelVerified: !!(profile && profile.channelVerified),
      googleClientId: google.clientId(),
    });
  }

  if (action === "admin-users") {
    const keyGiven = String((req.query && req.query.secret) || (req.headers && req.headers["x-admin-secret"]) || "");
    if (!SECRET || keyGiven !== SECRET) {
      return send(res, 403, { ok: false, error: "Unauthorized. Provide valid secret." });
    }
    if (!store.enabled()) {
      return send(res, 200, { ok: false, error: "Store is not enabled on this deployment." });
    }
    const keys = await store.scanKeys("u:*", 1000);
    const rawUsers = await store.pipeline(keys.map((k) => ["GET", k])).catch(() => []);
    const list = [];
    rawUsers.forEach((r) => {
      if (r && r.result) {
        try {
          const u = typeof r.result === "string" ? JSON.parse(r.result) : r.result;
          list.push({
            email: u.email,
            created: u.created || "",
            channel: u.channel || "",
            channelId: u.channelId || "",
            watchCount: Array.isArray(u.watch) ? u.watch.length : 0,
            watchlist: u.watch || [],
            google: !!u.google,
            hasPassword: !!u.pw,
            weekly: u.weekly !== false,
          });
        } catch (_) {}
      }
    });

    if (req.query && req.query.sync === "1") {
      let synced = 0;
      for (const u of list) {
        if (u.channel) {
          await tell({
            kind: "channel_sync",
            email: u.email,
            channel: u.channel,
            channelId: u.channelId,
            source: "admin_backfill",
            receivedAt: new Date().toISOString(),
          });
          synced++;
        }
      }
      return send(res, 200, { ok: true, totalUsers: list.length, syncedToSheet: synced, users: list });
    }

    if (req.query && req.query.format === "csv") {
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", 'attachment; filename="passive-array-users.csv"');
      const csvHeader = "Email,Created,Channel,ChannelId,WatchCount,Google,Weekly\n";
      const rows = list.map((u) => [u.email, u.created, u.channel, u.channelId, u.watchCount, u.google ? "yes" : "no", u.weekly ? "yes" : "no"].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
      return res.status(200).send(csvHeader + rows.join("\n"));
    }

    return send(res, 200, { ok: true, count: list.length, users: list });
  }

  if (req.method !== "POST") return send(res, 405, { ok: false, error: "Use POST." });

  if (!SECRET) {
    return send(res, 200, { ok: false, code: "disabled", error: "Sign-in is not switched on yet. Every tool works without an account." });
  }

  const body = parseBody(req);
  if (body === null) return send(res, 400, { ok: false, error: "Body must be JSON." });
  const ip = clientIp(req);

  /* --- sign in with Google ---------------------------------------------- */
  if (action === "google") {
    if (!google.clientId()) {
      return send(res, 200, { ok: false, code: "disabled", error: "Google sign-in is not set up on this site yet." });
    }
    const limit = await store.hitLimit("rl:g:" + ip, 30, 900);
    if (limit.limited) return tooMany(res, "attempts");

    let profile;
    try {
      profile = await google.verifyIdToken(String(body.credential || ""));
    } catch (e) {
      console.error("auth google: " + e.message);
      return send(res, 400, { ok: false, code: "bad_token", error: "That Google sign-in could not be verified. Try again." });
    }

    let resolved = null;
    if (body.channel && String(body.channel).trim()) {
      try { resolved = await resolveSignupChannel(body.channel); } catch (_) { /* ignore bad channel on Google button */ }
    }

    let since = new Date().toISOString().slice(0, 10);
    let isNew = false;
    let user = null;
    if (store.enabled()) {
      try {
        const existing = await users.get(profile.email);
        isNew = !existing;
        const patch = { google: true, verified: true };
        if (resolved && !(existing && existing.channel)) {
          patch.channel = resolved.handle;
          patch.channelId = resolved.id;
          patch.channelSince = since;
        }
        user = await users.upsert(profile.email, patch);
        since = user.created;
      } catch (e) {
        console.error("auth google store: " + e.message);
      }
    }
    if (isNew || !store.enabled()) {
      await tell({
        kind: "signup",
        email: profile.email,
        name: profile.name,
        channel: (user && user.channel) || (resolved && resolved.handle) || "",
        channelId: (user && user.channelId) || (resolved && resolved.id) || "",
        platform: "Google sign-in",
        source: String(body.source || ""),
        receivedAt: new Date().toISOString(),
      });
    }
    if (user) await sendWelcomeIfNeeded(user, req);
    return startSession(res, profile.email, since, { method: "google", isNew });
  }

  /* --- create a password account ---------------------------------------- */
  if (action === "register") {
    if (!store.enabled()) {
      return send(res, 200, { ok: false, code: "disabled", error: "Password accounts are not set up on this site yet. Use Google or an email link." });
    }
    if (body.website) return send(res, 200, { ok: true }); // honeypot

    const email = String(body.email || "").trim().toLowerCase();
    if (!EMAIL.test(email) || email.length > 200) return send(res, 400, { ok: false, code: "email", error: "Enter a valid email address." });
    if (isDisposableEmail(email)) return send(res, 400, { ok: false, code: "email", error: "Use a real email address (disposable mail addresses cannot sign up)." });

    const complaint = users.checkPassword(body.password, email);
    if (complaint) return send(res, 400, { ok: false, code: "password", error: complaint });

    const rawChannel = String(body.channel || "").trim();
    if (!rawChannel) {
      return send(res, 400, { ok: false, code: "channel", error: "Enter your YouTube channel @handle or channel link." });
    }
    let resolved;
    try {
      resolved = await resolveSignupChannel(rawChannel);
    } catch (e) {
      return send(res, 400, { ok: false, code: "channel", error: e.message || "Could not find that YouTube channel." });
    }

    const limit = await store.hitLimit("rl:reg:" + ip, 5, 3600);
    if (limit.limited) return tooMany(res, "new accounts from this connection");

    let existing = null;
    try { existing = await users.get(email); } catch (e) {
      console.error("auth register store: " + e.message);
      return send(res, 502, { ok: false, error: "Could not create the account right now. Please try again in a minute." });
    }
    if (existing && existing.pw && existing.verified) {
      return send(res, 409, { ok: false, code: "exists", error: "That address already has an account. Sign in instead, or use the email link if you have forgotten your password." });
    }

    let user;
    try {
      user = await users.setPassword(email, String(body.password));
      user.channel = resolved.handle;
      user.channelId = resolved.id;
      user.channelSince = user.channelSince || new Date().toISOString().slice(0, 10);
      await users.save(user);
    } catch (e) {
      console.error("auth register: " + e.message);
      return send(res, 502, { ok: false, error: "Could not create the account right now. Please try again in a minute." });
    }

    // Require email verification before starting a session so fake emails cannot access the account.
    if (WEBHOOK) {
      const token = sign({ p: "login", e: email, c: resolved.handle, cid: resolved.id, exp: Date.now() + LINK_MINUTES * 60000 });
      await tell({
        kind: "login",
        email,
        channel: resolved.handle,
        channelId: resolved.id,
        link: siteUrl(req) + "/login/?token=" + encodeURIComponent(token) + (safeNext(body.next) ? "&next=" + encodeURIComponent(body.next) : ""),
        minutes: LINK_MINUTES,
        source: String(body.source || "").slice(0, 300),
        receivedAt: new Date().toISOString(),
      });
      return send(res, 200, { ok: true, needsVerification: true });
    }

    await tell({ kind: "signup", email, name: resolved.title, channel: resolved.handle, channelId: resolved.id, platform: String(body.platform || "Password account").slice(0, 40), source: String(body.source || ""), receivedAt: new Date().toISOString() });
    return startSession(res, email, user.created, { method: "password", isNew: true });
  }

  /* --- sign in with a password ------------------------------------------ */
  if (action === "password") {
    if (!store.enabled()) {
      return send(res, 200, { ok: false, code: "disabled", error: "Password sign-in is not set up on this site yet. Use Google or an email link." });
    }
    const email = String(body.email || "").trim().toLowerCase();
    if (!EMAIL.test(email)) return send(res, 400, { ok: false, code: "bad_login", error: BAD_LOGIN });

    const attemptKey = "rl:pw:" + email;
    const byEmail = await store.hitLimit(attemptKey, 8, 900);
    const byIp = await store.hitLimit("rl:pwip:" + ip, 30, 900);
    if (byEmail.limited || byIp.limited) return tooMany(res, "sign-in attempts");

    let user = null;
    try {
      user = await users.checkLogin(email, String(body.password || ""));
    } catch (e) {
      console.error("auth password: " + e.message);
      return send(res, 502, { ok: false, error: "Could not sign you in right now. Please try again in a minute." });
    }
    if (!user) return send(res, 401, { ok: false, code: "bad_login", error: BAD_LOGIN });

    // Block unverified email accounts from signing in with a password until they click the link sent to their inbox.
    if (user.verified === false && WEBHOOK) {
      const token = sign({ p: "login", e: user.email, exp: Date.now() + LINK_MINUTES * 60000 });
      await tell({
        kind: "login",
        email: user.email,
        link: siteUrl(req) + "/login/?token=" + encodeURIComponent(token),
        minutes: LINK_MINUTES,
        source: "password-verify",
        receivedAt: new Date().toISOString(),
      });
      return send(res, 403, { ok: false, code: "unverified", error: "Please verify your email first. We just sent a verification link to your inbox." });
    }

    await store.clearLimit(attemptKey);
    await sendWelcomeIfNeeded(user, req);
    return startSession(res, user.email, user.created, { method: "password" });
  }

  /* --- ask for a sign-in link ------------------------------------------- */
  // Same-site path to return to after the link is used, e.g. "/account/#mcp".
  function safeNext(n) { return typeof n === "string" && n.length < 200 && /^\/(?!\/)[\w\-./#%?=&]*$/.test(n); }
  if (action === "request") {
    if (body.website) return send(res, 200, { ok: true }); // honeypot
    const email = String(body.email || "").trim().toLowerCase();
    if (!EMAIL.test(email) || email.length > 200) {
      return send(res, 400, { ok: false, code: "email", error: "Enter a valid email address." });
    }
    if (isDisposableEmail(email)) {
      return send(res, 400, { ok: false, code: "email", error: "Use a real email address (disposable mail addresses cannot sign up)." });
    }
    if (!WEBHOOK) {
      return send(res, 200, { ok: false, code: "disabled", error: "Email sign-in links are not set up on this site yet." });
    }

    const isSignup = String(body.source || "").indexOf("signup") >= 0;
    const rawChannel = String(body.channel || "").trim();
    if (isSignup && !rawChannel) {
      return send(res, 400, { ok: false, code: "channel", error: "Enter your YouTube channel @handle or channel link." });
    }
    let resolved = null;
    if (rawChannel) {
      try {
        resolved = await resolveSignupChannel(rawChannel);
      } catch (e) {
        return send(res, 400, { ok: false, code: "channel", error: e.message || "Could not find that YouTube channel." });
      }
    }

    const byEmail = await store.hitLimit("rl:link:" + email, 5, 900);
    const byIp = await store.hitLimit("rl:linkip:" + ip, 20, 900);
    if (byEmail.limited || byIp.limited) return tooMany(res, "link requests");

    if (resolved && store.enabled()) {
      try {
        const existing = await users.get(email);
        if (!existing || !existing.channel) {
          await users.upsert(email, { channel: resolved.handle, channelId: resolved.id, channelSince: new Date().toISOString().slice(0, 10) });
        }
      } catch (_) {}
    }

    const tokenData = { p: "login", e: email, exp: Date.now() + LINK_MINUTES * 60000 };
    if (resolved) { tokenData.c = resolved.handle; tokenData.cid = resolved.id; tokenData.ct = resolved.title; }
    const token = sign(tokenData);
    await tell({
      kind: "login",
      email,
      channel: resolved ? resolved.handle : "",
      channelId: resolved ? resolved.id : "",
      link: siteUrl(req) + "/login/?token=" + encodeURIComponent(token) + (safeNext(body.next) ? "&next=" + encodeURIComponent(body.next) : ""),
      minutes: LINK_MINUTES,
      source: String(body.source || "").slice(0, 300),
      receivedAt: new Date().toISOString(),
    });

    // Always the same answer, so this cannot be used to discover who has an account.
    return send(res, 200, { ok: true, needsVerification: true });
  }

  /* --- exchange a link for a session ------------------------------------ */
  if (action === "verify") {
    const data = verifyToken(String(body.token || ""), "login");
    if (!data) {
      return send(res, 400, { ok: false, code: "bad_token", error: "That sign-in link has expired or is not valid. Ask for a new one." });
    }
    let since = data.s || new Date().toISOString().slice(0, 10);
    let isNew = false;
    let user = null;
    if (store.enabled()) {
      try {
        const existing = await users.get(data.e);
        isNew = !existing || !existing.verified;
        const patch = { verified: true };
        if (data.c && !(existing && existing.channel)) {
          patch.channel = String(data.c);
          patch.channelId = String(data.cid || "");
          patch.channelSince = since;
        }
        user = await users.upsert(data.e, patch);
        since = user.created;
      } catch (e) { console.error("auth verify store: " + e.message); }
    }
    if (isNew) {
      await tell({
        kind: "signup",
        email: data.e,
        name: data.ct || "",
        channel: (user && user.channel) || data.c || "",
        channelId: (user && user.channelId) || data.cid || "",
        platform: "Email verified",
        source: "email_verify",
        receivedAt: new Date().toISOString(),
      });
    }
    if (user) await sendWelcomeIfNeeded(user, req);
    return startSession(res, data.e, since, { method: "link", isNew });
  }

  /* --- sign out ---------------------------------------------------------- */
  if (action === "logout") {
    return send(res, 200, { ok: true }, sessionCookie("", 0));
  }

  /* --- everything below needs a session ---------------------------------- */
  const session = currentSession(req);
  if (!session) return send(res, 401, { ok: false, code: "no_session", error: "Sign in first." });

  if (action === "set-password") {
    if (!store.enabled()) {
      return send(res, 200, { ok: false, code: "disabled", error: "Password accounts are not set up on this site yet." });
    }
    const complaint = users.checkPassword(body.password, session.e);
    if (complaint) return send(res, 400, { ok: false, code: "password", error: complaint });
    try {
      await users.setPassword(session.e, String(body.password));
    } catch (e) {
      console.error("auth set-password: " + e.message);
      return send(res, 502, { ok: false, error: "Could not save that right now. Please try again in a minute." });
    }
    return send(res, 200, { ok: true });
  }

  if (action === "preferences") {
    const weekly = body.weekly === undefined ? undefined : (body.weekly === true || body.weekly === "true");
    if (store.enabled() && weekly !== undefined) {
      try { await users.upsert(session.e, { weekly }); } catch (e) { console.error("auth preferences store: " + e.message); }
    }
    const saved = await tell({ kind: "preferences", email: session.e, weekly: weekly ? "yes" : "no", receivedAt: new Date().toISOString() });
    if (!saved && !store.enabled()) return send(res, 502, { ok: false, error: "Could not save that right now. Please try again in a minute." });
    return send(res, 200, { ok: true, weekly });
  }

  if (action === "delete") {
    if (store.enabled()) {
      try { await require("../lib/mcp.js").revokeAll(session.e); } catch (e) { console.error("auth delete mcp: " + e.message); }
      try { await users.remove(session.e); } catch (e) { console.error("auth delete store: " + e.message); }
    }
    await tell({ kind: "delete", email: session.e, message: "Account deletion requested from the account page.", receivedAt: new Date().toISOString() });
    return send(res, 200, { ok: true }, sessionCookie("", 0));
  }

  return send(res, 404, { ok: false, error: "Unknown action." });
};
