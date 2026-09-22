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
    return send(res, 200, {
      ok: true,
      configured: !!url,
      hint: url
        ? "A destination is set. Sign-ups are being forwarded to it."
        : "SUBSCRIBE_WEBHOOK_URL is not set on this deployment. Add it in Vercel settings, then redeploy.",
    });
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
