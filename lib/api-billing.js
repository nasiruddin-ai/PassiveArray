// Handler for /api/billing (served through api/pro.js) — Polar (polar.sh) subscriptions for Pro.
//   GET   ?action=status              is billing switched on, prices, environment
//   POST  ?action=checkout { plan }   "monthly" | "yearly" | "lifetime"  -> { url } hosted Polar Checkout URL (needs session)
//   POST  ?action=portal              -> { url } fresh Polar Customer Portal URL (needs session)
//
// Polar is the Merchant of Record: it charges global cards / Apple Pay / Google Pay,
// handles sales tax and VAT worldwide, and pays out directly to Bangladesh via Stripe Connect Express.
//
// Environment variables (see .env.example):
//   POLAR_ENV                   "production" (default) | "sandbox"
//   POLAR_ACCESS_TOKEN          Organization Access Token (polar_oat_...)
//   POLAR_PRODUCT_ID_MONTHLY    Monthly Pro product UUID ($9/mo)
//   POLAR_PRODUCT_ID_YEARLY     Optional yearly Pro product UUID ($79/yr)
//   POLAR_PRODUCT_ID_LIFETIME         Optional one-time product UUID ($149), Pro for the lifetime of the product
//   POLAR_PRODUCT_ID_LIFETIME_LAUNCH  Optional one-time product UUID ($99), sold to the first 100 buyers
//   POLAR_WEBHOOK_SECRET        Webhook signing secret (whsec_...) for lib/api-billing-webhook.js
// Without them, the pricing page says Pro is opening soon and nothing breaks.

const { currentSession, json, parseBody, siteUrl } = require("./session.js");
const store = require("./store.js");
const users = require("./users.js");
const pro = require("./pro.js");

function getConfig() {
  const env = pro.polarEnv();
  const baseUrl = env === "sandbox" ? "https://sandbox-api.polar.sh/v1" : "https://api.polar.sh/v1";
  return {
    env,
    baseUrl,
    token: process.env.POLAR_ACCESS_TOKEN || "",
    productMonthly: process.env.POLAR_PRODUCT_ID_MONTHLY || "",
    productYearly: process.env.POLAR_PRODUCT_ID_YEARLY || "",
  };
}

async function polarFetch(cfg, path, body) {
  if (!cfg.token) throw Object.assign(new Error("Polar access token is not configured."), { status: 503 });
  const r = await fetch(cfg.baseUrl + "/" + path.replace(/^\/+/, ""), {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: "Bearer " + cfg.token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const detail = Array.isArray(data.detail)
      ? data.detail.map((d) => d.msg || d.type).join("; ")
      : (data.detail || data.error_description || data.error);
    throw Object.assign(new Error(detail || ("Polar error " + r.status)), { status: 502 });
  }
  return data;
}

async function lifetimeSold() {
  if (!store.enabled()) return 0;
  const rec = await store.getJson(pro.LIFETIME_SOLD_KEY).catch(() => null);
  return rec && Number(rec.n) > 0 ? Number(rec.n) : 0;
}

module.exports = async (req, res) => {
  const cfg = getConfig();
  const action = (req.query && req.query.action) || "status";

  if (action === "status") {
    const offer = pro.lifetimeOffer(await lifetimeSold());
    return json(res, 200, {
      lifetime: { configured: offer.configured, price: offer.price, regular: offer.regular, launchPrice: offer.launchPrice, launch: offer.launch, launchLeft: offer.launchLeft, seats: offer.seats },
      ok: true,
      provider: "polar",
      env: cfg.env,
      configured: pro.billingConfigured(),
      monthly: pro.PRICE_MONTHLY,
      yearly: cfg.productYearly ? pro.PRICE_YEARLY : null,
      freeWatch: pro.FREE_WATCH,
      proWatch: pro.PRO_WATCH,
    });
  }

  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Use POST." });

  // Authenticate before any store lookup or Polar API call.
  const s = currentSession(req);
  if (!s) return json(res, 401, { ok: false, code: "signin", error: "Sign in first." });
  const body = parseBody(req) || {};
  const wantsLifetime = action === "checkout" && body.plan === "lifetime";
  if (wantsLifetime ? !pro.lifetimeConfigured() : !pro.billingConfigured()) {
    return json(res, 200, { ok: false, code: "not_open", error: (wantsLifetime ? "Lifetime" : "Pro") + " is not open for purchase yet. Your account will be first to know." });
  }

  const site = siteUrl(req);

  try {
    if (action === "checkout") {
      const user = store.enabled() ? await users.get(s.e) : null;
      // A subscriber may still buy Lifetime (and then cancel the subscription); a lifetime owner has nothing left to buy.
      if (user && user.pro && user.pro.lifetime) return json(res, 200, { ok: false, code: "already", error: "You already own Lifetime." });
      if (!wantsLifetime && pro.isPro(user)) return json(res, 200, { ok: false, code: "already", error: "You are already on Pro." });

      const productId = wantsLifetime
        ? pro.lifetimeOffer(await lifetimeSold()).productId
        : body.plan === "yearly" && cfg.productYearly ? cfg.productYearly : cfg.productMonthly;
      if (!productId) return json(res, 200, { ok: false, code: "not_open", error: "Selected plan is not available yet." });

      const payload = {
        products: [productId],
        customer_email: s.e,
        external_customer_id: s.e,
        metadata: { email: s.e, plan: wantsLifetime ? "lifetime" : body.plan === "yearly" ? "yearly" : "monthly" },
        success_url: site + "/account/?upgraded=1&checkout_id={CHECKOUT_ID}",
        return_url: site + "/account/",
      };
      if (user && user.pro && user.pro.provider === "polar" && user.pro.customer) {
        payload.customer_id = String(user.pro.customer);
      }

      const checkout = await polarFetch(cfg, "checkouts/", payload);
      if (!checkout || !checkout.url) {
        return json(res, 502, { ok: false, error: "Could not open Polar checkout." });
      }
      return json(res, 200, { ok: true, url: checkout.url });
    }

    if (action === "portal") {
      // Security: always resolve customer ID from the authenticated user's record, never req.body.
      const user = store.enabled() ? await users.get(s.e) : null;
      const customerId = user && user.pro && user.pro.provider === "polar" && user.pro.customer
        ? String(user.pro.customer)
        : "";
      if (!customerId) {
        return json(res, 200, { ok: false, code: "no_customer", error: "No billing account yet." });
      }
      // Mint a fresh Customer Portal session per click; return only the portal URL.
      const session = await polarFetch(cfg, "customer-sessions/", {
        customer_id: customerId,
        return_url: site + "/account/",
      });
      if (!session || !session.customer_portal_url) {
        return json(res, 502, { ok: false, error: "Could not open billing portal." });
      }
      return json(res, 200, { ok: true, url: session.customer_portal_url });
    }

    return json(res, 404, { ok: false, error: "Unknown action." });
  } catch (e) {
    return json(res, e.status || 500, { ok: false, error: e.message });
  }
};
