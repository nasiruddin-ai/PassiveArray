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
// GET /api/subscribe?health=1         is a destination configured, and what does it answer to GET
// GET /api/subscribe?health=1&post=1  same, but with a real POST (kind "health")
// The destination URL itself is never included in any response.

const KINDS = new Set(["signup", "newsletter", "contact"]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// A Google Apps Script web app lives at script.google.com/macros/s/<id>/exec and
// redirects to script.googleusercontent.com. Only the /exec address accepts POST.
const REDIRECT_HOST = "script.googleusercontent.com";

function send(res, code, body) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(code).send(JSON.stringify(body));
}

function hostOf(url) {
  try { return new URL(url).host; } catch (_) { return ""; }
}

function compact(text) {
  return String(text || "").split(/\s+/).filter(Boolean).join(" ").slice(0, 200);
}

async function probe(url, asPost) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(url, asPost
      ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "health", email: "health-check@passivearray.test", receivedAt: new Date().toISOString() }), redirect: "follow", signal: ctrl.signal }
      : { method: "GET", redirect: "follow", signal: ctrl.signal });
    const text = compact(await r.text().catch(() => ""));
    const finalHost = hostOf(r.url);
    let looksLike = "unknown";
    if (/Passive Array receiver/.test(text)) looksLike = "apps-script-receiver";
    else if (/accounts\.google\.com/.test(r.url || "")) looksLike = "google-login-wall";
    else if (/not registered/i.test(text)) looksLike = "n8n-inactive-or-test-url";
    else if (r.status === 404) looksLike = "not-found";
    else if (r.status === 405) looksLike = "method-not-allowed";
    return { method: asPost ? "POST" : "GET", status: r.status, redirected: r.redirected, finalHost, looksLike, preview: text };
  } catch (e) {
    return { method: asPost ? "POST" : "GET", error: e && e.name === "AbortError" ? "timeout after 8s" : String((e && e.message) || e) };
  } finally {
    clearTimeout(timer);
  }
}

function hintFor(d) {
  if (!d) return "";
  if (d.error) return "The destination did not answer. Check the URL is reachable from the internet (a localhost n8n is not).";
  switch (d.looksLike) {
    case "apps-script-receiver": return "Destination reachable and answering as the Passive Array receiver.";
    case "google-login-wall": return "The Apps Script deployment is not set to Anyone. Redeploy it with Who has access = Anyone.";
    case "n8n-inactive-or-test-url": return "n8n says this webhook is not registered: the workflow is inactive or this is the Test URL. Activate it and use the Production URL.";
    case "not-found": return "The destination answers 404. Its URL has probably changed: copy the current Web app URL or Production URL into SUBSCRIBE_WEBHOOK_URL, then redeploy.";
    case "method-not-allowed": return "The destination refuses POST. For Apps Script that means the URL is not the /exec Web app URL.";
    default: return "See destination.preview for what the URL answered.";
  }
}

module.exports = async (req, res) => {
  const url = process.env.SUBSCRIBE_WEBHOOK_URL || "";

  if (req.method === "OPTIONS") return send(res, 204, {});

  /* --- owner health check ------------------------------------------------ */
  if (req.method === "GET") {
    if (!(req.query && req.query.health)) return send(res, 405, { ok: false, error: "Use POST." });
    const out = { ok: true, configured: !!url };
    if (!url) {
      out.hint = "SUBSCRIBE_WEBHOOK_URL is not set on this deployment. Add it in Vercel settings, then redeploy.";
      return send(res, 200, out);
    }
    if (hostOf(url) === REDIRECT_HOST) {
      out.destination = { host: REDIRECT_HOST, problem: "redirect-target-url" };
      out.hint = "SUBSCRIBE_WEBHOOK_URL is the address Google redirects to after opening the script, not the Web app URL. Google only accepts POST on the address that ends in /exec. In Apps Script open Deploy, then Manage deployments, copy the Web app URL (https://script.google.com/macros/s/.../exec), paste it into Vercel, then Redeploy.";
      return send(res, 200, out);
    }
    out.destination = await probe(url, !!req.query.post);
    out.hint = hintFor(out.destination);
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

  if (hostOf(url) === REDIRECT_HOST) {
    console.error("subscribe: SUBSCRIBE_WEBHOOK_URL points at " + REDIRECT_HOST + ", which rejects POST. Use the /exec Web app URL. See /api/subscribe?health=1");
  }

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
      console.error("subscribe: destination answered " + r.status + " " + compact(await r.text().catch(() => "")));
      throw new Error("destination answered " + r.status);
    }
    return send(res, 200, { ok: true });
  } catch (e) {
    console.error("subscribe: " + ((e && e.message) || String(e)));
    return send(res, 502, { ok: false, code: "webhook", error: "Could not save that right now. Please try again in a minute." });
  }
};
