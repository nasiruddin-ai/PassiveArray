// Vercel Function: POST /api/subscribe
// Receives sign-ups, newsletter subscriptions and contact messages from the
// site and forwards them to a webhook you own (a Google Apps Script web app,
// n8n, Make, Zapier, or your own server). Nothing is stored here.
//
// Set SUBSCRIBE_WEBHOOK_URL in Vercel (Settings, Environment Variables) and
// redeploy. Until it is set, the site tells people sign-up is not open yet.
// Setup steps, including a ready-made Google Sheets receiver, are in README.md.
//
// Body: { kind: "signup" | "newsletter" | "contact", email, name?, platform?, message?, source?, website? }
// The "website" field is a honeypot: real people never see it, bots fill it in.
//
// GET /api/subscribe?health=1 reports whether a destination is configured,
// so you can check the environment variable took effect after a redeploy.

const KINDS = new Set(["signup", "newsletter", "contact"]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function send(res, code, body) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(code).send(JSON.stringify(body));
}

module.exports = async (req, res) => {
  const url = process.env.SUBSCRIBE_WEBHOOK_URL;

  if (req.method === "OPTIONS") return send(res, 204, {});

  // Owner health check. Reports configuration only, never the destination.
  if (req.method === "GET") {
    if (!(req.query && req.query.health)) return send(res, 405, { ok: false, error: "Use POST." });
    const out = { ok: true, configured: !!url };
    if (!url) {
      out.hint = "SUBSCRIBE_WEBHOOK_URL is not set on this deployment. Add it in Vercel settings, then redeploy.";
      return send(res, 200, out);
    }
    // Probe the destination with a GET so the owner can see what it answers.
    // The URL itself is never included in the response.
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      // ?health=1&post=1 sends a real POST (kind "health") so the exact answer to a submission is visible.
      const asPost = !!req.query.post;
      const r = await fetch(url, asPost
        ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "health", email: "health-check@passivearray.test", receivedAt: new Date().toISOString() }), redirect: "follow", signal: ctrl.signal }
        : { method: "GET", redirect: "follow", signal: ctrl.signal });
      clearTimeout(timer);
      const text = (await r.text().catch(() => "")).split(/s/).filter(Boolean).join(" ").slice(0, 200);
      out.destination = {
        method: asPost ? "POST" : "GET",
        status: r.status,
        redirected: r.redirected,
        finalHost: (() => { try { return new URL(r.url).host; } catch (_) { return ""; } })(),
        looksLike: /Passive Array receiver/.test(text) ? "apps-script-receiver"
          : /accounts.google.com/.test(r.url) ? "google-login-wall"
          : /webhook.*not registered|not registered for/i.test(text) ? "n8n-inactive-or-test-url"
          : /n8n/i.test(text) ? "n8n"
          : r.status === 404 ? "not-found"
          : "unknown",
        preview: text,
      };
      out.hint = out.destination.looksLike === "apps-script-receiver" ? "Destination reachable. If POSTs still fail, check the Vercel logs for the status it returned."
        : out.destination.looksLike === "google-login-wall" ? "The Apps Script deployment is not set to Anyone. Redeploy it with Who has access = Anyone."
        : out.destination.looksLike === "n8n-inactive-or-test-url" ? "n8n says this webhook is not registered: the workflow is inactive or this is the Test URL. Activate it and use the Production URL."
        : out.destination.looksLike === "not-found" ? "The destination URL answers 404. It has probably changed: copy the current Web app URL or Production URL and update SUBSCRIBE_WEBHOOK_URL, then redeploy."
        : "See destination.preview for what the URL answered.";
    } catch (e) {
      out.destination = { error: e && e.name === "AbortError" ? "timeout after 8s" : String(e && e.message || e) };
      out.hint = "The destination did not answer. Check the URL is reachable from the internet (a localhost n8n is not).";
    }
    return send(res, 200, out);
  }

  if (req.method !== "POST") return send(res, 405, { ok: false, error: "Use POST." });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (_) { return send(res, 400, { ok: false, error: "Body must be JSON." }); }
  }
  body = body || {};

  if (body.website) return send(res, 200, { ok: true }); // honeypot hit: say nothing, store nothing

  const kind = KINDS.has(body.kind) ? body.kind : "signup";
  const email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL.test(email) || email.length > 200) return send(res, 400, { ok: false, code: "email", error: "Enter a valid email address." });

  const record = {
    kind,
    email,
    name: String(body.name || "").slice(0, 120),
    platform: String(body.platform || "").slice(0, 40),
    message: String(body.message || "").slice(0, 3000),
    source: String(body.source || "").slice(0, 300),
    receivedAt: new Date().toISOString(),
  };
  if (kind === "contact" && !record.message.trim()) return send(res, 400, { ok: false, code: "message", error: "Write a message first." });

  if (!url) return send(res, 200, { ok: false, code: "no_backend", error: "Sign-up is not open yet. Every tool stays free without it." });

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      signal: ctrl.signal,
      redirect: "follow", // Google Apps Script answers with a redirect
    });
    clearTimeout(timer);
    if (!r.ok) {
      // Shows up in the Vercel function logs so you can see what the destination said.
      console.error("subscribe: destination answered " + r.status + " " + (await r.text().catch(() => "")).slice(0, 300));
      throw new Error("destination answered " + r.status);
    }
    return send(res, 200, { ok: true });
  } catch (e) {
    console.error("subscribe: " + (e && e.message ? e.message : String(e)));
    return send(res, 502, { ok: false, code: "webhook", error: "Could not save that right now. Please try again in a minute." });
  }
};
