// Handler for /api/billing (served through api/pro.js)   Lemon Squeezy subscriptions for the Pro plan, via its REST API.
//   GET   ?action=status              is billing switched on, prices
//   POST  ?action=checkout { plan }   "monthly" | "yearly"  -> { url } to a Lemon Squeezy checkout   (needs a session)
//   POST  ?action=portal              -> { url } to the Lemon Squeezy customer portal                 (needs a session)
//
// Lemon Squeezy is the merchant of record: it charges the card, handles sales tax and VAT,
// and pays out to a bank in Bangladesh. Environment variables (test mode first):
//   LEMONSQUEEZY_API_KEY             Settings > API, an API key
//   LEMONSQUEEZY_STORE_ID            Settings > Stores, the numeric store id
//   LEMONSQUEEZY_VARIANT_ID          the monthly Pro variant id
//   LEMONSQUEEZY_VARIANT_ID_YEARLY   optional, the yearly variant id
//   LEMONSQUEEZY_WEBHOOK_SECRET      the signing secret for lib/api-billing-webhook.js
// Without them, the pricing page says Pro is opening soon and nothing breaks.

const { currentSession, json, parseBody, siteUrl } = require("./session.js");
const store = require("./store.js");
const users = require("./users.js");
const pro = require("./pro.js");

const KEY = process.env.LEMONSQUEEZY_API_KEY || "";
const STORE = process.env.LEMONSQUEEZY_STORE_ID || "";
const VARIANT = process.env.LEMONSQUEEZY_VARIANT_ID || "";
const VARIANT_YEARLY = process.env.LEMONSQUEEZY_VARIANT_ID_YEARLY || "";

async function ls(path, body) {
  const r = await fetch("https://api.lemonsqueezy.com/v1/" + path, {
    method: body ? "POST" : "GET",
    headers: { Authorization: "Bearer " + KEY, Accept: "application/vnd.api+json", "Content-Type": "application/vnd.api+json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = data.errors && data.errors[0] && (data.errors[0].detail || data.errors[0].title);
    throw Object.assign(new Error(msg || "Lemon Squeezy error " + r.status), { status: 502 });
  }
  return data;
}

module.exports = async (req, res) => {
  const action = (req.query && req.query.action) || "status";
  if (action === "status") {
    return json(res, 200, { ok: true, configured: pro.billingConfigured(), monthly: pro.PRICE_MONTHLY, yearly: VARIANT_YEARLY ? pro.PRICE_YEARLY : null, freeWatch: pro.FREE_WATCH, proWatch: pro.PRO_WATCH });
  }
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Use POST." });
  const s = currentSession(req);
  if (!s) return json(res, 401, { ok: false, code: "signin", error: "Sign in first." });
  if (!pro.billingConfigured()) return json(res, 200, { ok: false, code: "not_open", error: "Pro is not open for purchase yet. Your account will be first to know." });
  const body = parseBody(req) || {};
  const site = siteUrl(req);

  try {
    if (action === "checkout") {
      const user = store.enabled() ? await users.get(s.e) : null;
      if (pro.isPro(user)) return json(res, 200, { ok: false, code: "already", error: "You are already on Pro." });
      const variant = body.plan === "yearly" && VARIANT_YEARLY ? VARIANT_YEARLY : VARIANT;
      const checkout = await ls("checkouts", {
        data: {
          type: "checkouts",
          attributes: {
            // Custom data comes back on every subscription webhook, so the account can be found.
            checkout_data: { email: s.e, custom: { email: s.e } },
            product_options: { redirect_url: site + "/account/?upgraded=1", enabled_variants: [Number(variant)] },
          },
          relationships: {
            store: { data: { type: "stores", id: String(STORE) } },
            variant: { data: { type: "variants", id: String(variant) } },
          },
        },
      });
      return json(res, 200, { ok: true, url: checkout.data.attributes.url });
    }
    if (action === "portal") {
      const user = store.enabled() ? await users.get(s.e) : null;
      if (!user || !user.pro || !user.pro.subscription) return json(res, 200, { ok: false, code: "no_customer", error: "No billing account yet." });
      // The portal link is signed and expires after a day, so ask for a fresh one each time.
      const sub = await ls("subscriptions/" + encodeURIComponent(user.pro.subscription));
      const urls = (sub.data && sub.data.attributes && sub.data.attributes.urls) || {};
      if (!urls.customer_portal) return json(res, 200, { ok: false, error: "Could not open billing." });
      return json(res, 200, { ok: true, url: urls.customer_portal });
    }
    return json(res, 404, { ok: false, error: "Unknown action." });
  } catch (e) {
    return json(res, e.status || 500, { ok: false, error: e.message });
  }
};
