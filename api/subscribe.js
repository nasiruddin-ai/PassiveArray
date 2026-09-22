// Vercel Function: POST /api/subscribe
// Receives sign-ups, newsletter subscriptions and contact messages from the
// site and forwards them to a webhook you own (n8n, Make, Zapier, a Google
// Apps Script web app, anything that accepts JSON). Nothing is stored here.
//
// Set SUBSCRIBE_WEBHOOK_URL in Vercel (Settings, Environment Variables).
// Until it is set, the site tells people that sign-up is not open yet.
//
// Body: { kind: "signup" | "newsletter" | "contact", email, name?, platform?, message?, source?, website? }
// The "website" field is a honeypot: real people never see it, bots fill it in.

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
  if (req.method === "OPTIONS") return send(res, 204, {});
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

  const url = process.env.SUBSCRIBE_WEBHOOK_URL;
  if (!url) return send(res, 200, { ok: false, code: "no_backend", error: "Sign-up is not open yet. Every tool stays free without it." });

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(record), signal: ctrl.signal });
    clearTimeout(timer);
    if (!r.ok) throw new Error("Webhook answered " + r.status);
    return send(res, 200, { ok: true });
  } catch (e) {
    return send(res, 502, { ok: false, code: "webhook", error: "Could not save that right now. Please try again in a minute." });
  }
};
