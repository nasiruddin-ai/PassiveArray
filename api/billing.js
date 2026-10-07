// Vercel Function: /api/billing   Stripe subscriptions for the Pro plan, via Stripe's REST API.
//   GET   ?action=status              is billing switched on, prices
//   POST  ?action=checkout { plan }   "monthly" | "yearly"  -> { url } to Stripe Checkout   (needs a session)
//   POST  ?action=portal              -> { url } to the Stripe customer portal                (needs a session)
//
// Environment variables (Stripe dashboard, test mode first):
//   STRIPE_SECRET_KEY        sk_live_... or sk_test_...
//   STRIPE_PRICE_ID          price id of the monthly Pro price
//   STRIPE_PRICE_ID_YEARLY   optional, the yearly price
//   STRIPE_WEBHOOK_SECRET    whsec_... for api/stripe-webhook.js
// Without them, the pricing page says Pro is opening soon and nothing breaks.

const { currentSession, json, parseBody, siteUrl } = require("../lib/session.js");
const store = require("../lib/store.js");
const users = require("../lib/users.js");
const pro = require("../lib/pro.js");

const KEY = process.env.STRIPE_SECRET_KEY || "";
const PRICE = process.env.STRIPE_PRICE_ID || "";
const PRICE_YEARLY = process.env.STRIPE_PRICE_ID_YEARLY || "";

function form(obj, prefix, out) {
  out = out || new URLSearchParams();
  for (const [k, v] of Object.entries(obj)) {
    const name = prefix ? prefix + "[" + k + "]" : k;
    if (v && typeof v === "object") form(v, name, out); else if (v !== undefined && v !== null) out.append(name, String(v));
  }
  return out;
}

async function stripe(path, body) {
  const r = await fetch("https://api.stripe.com/v1/" + path, {
    method: "POST",
    headers: { Authorization: "Bearer " + KEY, "Content-Type": "application/x-www-form-urlencoded" },
    body: form(body).toString(),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error((data.error && data.error.message) || "Stripe error " + r.status), { status: 502 });
  return data;
}

module.exports = async (req, res) => {
  const action = (req.query && req.query.action) || "status";
  if (action === "status") {
    return json(res, 200, { ok: true, configured: pro.stripeConfigured(), monthly: pro.PRICE_MONTHLY, yearly: PRICE_YEARLY ? pro.PRICE_YEARLY : null, freeWatch: pro.FREE_WATCH, proWatch: pro.PRO_WATCH });
  }
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Use POST." });
  const s = currentSession(req);
  if (!s) return json(res, 401, { ok: false, code: "signin", error: "Sign in first." });
  if (!pro.stripeConfigured()) return json(res, 200, { ok: false, code: "not_open", error: "Pro is not open for purchase yet. Your account will be first to know." });
  const body = parseBody(req) || {};
  const site = siteUrl(req);

  try {
    if (action === "checkout") {
      const user = store.enabled() ? await users.get(s.e) : null;
      if (pro.isPro(user)) return json(res, 200, { ok: false, code: "already", error: "You are already on Pro." });
      const price = body.plan === "yearly" && PRICE_YEARLY ? PRICE_YEARLY : PRICE;
      const session = await stripe("checkout/sessions", {
        mode: "subscription",
        "line_items[0][price]": price,
        "line_items[0][quantity]": 1,
        customer_email: user && user.pro && user.pro.customer ? undefined : s.e,
        customer: user && user.pro && user.pro.customer ? user.pro.customer : undefined,
        client_reference_id: s.e,
        allow_promotion_codes: "true",
        success_url: site + "/account/?upgraded=1",
        cancel_url: site + "/pricing/",
        "metadata[email]": s.e,
        "subscription_data[metadata][email]": s.e,
      });
      return json(res, 200, { ok: true, url: session.url });
    }
    if (action === "portal") {
      const user = store.enabled() ? await users.get(s.e) : null;
      if (!user || !user.pro || !user.pro.customer) return json(res, 200, { ok: false, code: "no_customer", error: "No billing account yet." });
      const portal = await stripe("billing_portal/sessions", { customer: user.pro.customer, return_url: site + "/account/" });
      return json(res, 200, { ok: true, url: portal.url });
    }
    return json(res, 404, { ok: false, error: "Unknown action." });
  } catch (e) {
    return json(res, e.status || 500, { ok: false, error: e.message });
  }
};
