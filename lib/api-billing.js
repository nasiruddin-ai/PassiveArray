// Handler for /api/billing (served through api/pro.js) — Paddle Billing for the Pro plan.
//   GET   ?action=status              is billing switched on, prices, environment
//   POST  ?action=checkout { plan }   "monthly" | "yearly"  -> Paddle.js overlay config (or hosted URL fallback) (needs session)
//   POST  ?action=portal              -> { url } fresh Paddle Customer Portal overview URL (needs session)
//
// Paddle is the Merchant of Record: it charges global cards / PayPal / Apple Pay / Google Pay,
// handles sales tax and VAT worldwide, and pays out to Bangladesh via Payoneer or wire transfer.
//
// Environment variables (live Paddle account — see .env.example):
//   PADDLE_API_KEY                   server-side live key (pdl_live_apikey_...)
//   PADDLE_CLIENT_TOKEN              client-side live token for Paddle.js overlay (live_...)
//   PADDLE_PRICE_ID_MONTHLY          live monthly Pro price ID (pri_01...)
//   PADDLE_PRICE_ID_YEARLY           optional live yearly Pro price ID (pri_01...)
//   PADDLE_WEBHOOK_SECRET            live destination signing secret (pdl_ntfset_...) for lib/api-billing-webhook.js
// Without them, the pricing page says Pro is opening soon and nothing breaks.

const { currentSession, json, parseBody, siteUrl } = require("./session.js");
const store = require("./store.js");
const users = require("./users.js");
const pro = require("./pro.js");

function getConfig() {
  return {
    env: "production",
    baseUrl: "https://api.paddle.com",
    apiKey: process.env.PADDLE_API_KEY || "",
    clientToken: process.env.PADDLE_CLIENT_TOKEN || process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "",
    priceMonthly: process.env.PADDLE_PRICE_ID_MONTHLY || "",
    priceYearly: process.env.PADDLE_PRICE_ID_YEARLY || "",
  };
}

async function paddleFetch(cfg, path, body) {
  if (!cfg.apiKey) throw Object.assign(new Error("Paddle API key is not configured."), { status: 503 });
  const r = await fetch(cfg.baseUrl + "/" + path.replace(/^\/+/, ""), {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: "Bearer " + cfg.apiKey,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = (data.error && (data.error.detail || data.error.message)) || ("Paddle error " + r.status);
    throw Object.assign(new Error(msg), { status: 502 });
  }
  return data;
}

module.exports = async (req, res) => {
  const cfg = getConfig();
  const action = (req.query && req.query.action) || "status";

  if (action === "status") {
    return json(res, 200, {
      ok: true,
      provider: "paddle",
      env: cfg.env,
      configured: pro.billingConfigured(),
      monthly: pro.PRICE_MONTHLY,
      yearly: cfg.priceYearly ? pro.PRICE_YEARLY : null,
      freeWatch: pro.FREE_WATCH,
      proWatch: pro.PRO_WATCH,
    });
  }

  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Use POST." });

  // 1. Authenticate before any store lookup or Paddle API call.
  const s = currentSession(req);
  if (!s) return json(res, 401, { ok: false, code: "signin", error: "Sign in first." });
  if (!pro.billingConfigured()) {
    return json(res, 200, { ok: false, code: "not_open", error: "Pro is not open for purchase yet. Your account will be first to know." });
  }

  const body = parseBody(req) || {};
  const site = siteUrl(req);

  try {
    if (action === "checkout") {
      const user = store.enabled() ? await users.get(s.e) : null;
      if (pro.isPro(user)) return json(res, 200, { ok: false, code: "already", error: "You are already on Pro." });

      const priceId = body.plan === "yearly" && cfg.priceYearly ? cfg.priceYearly : cfg.priceMonthly;
      if (!priceId) return json(res, 200, { ok: false, code: "not_open", error: "Selected plan is not available yet." });

      const successUrl = site + "/account/?upgraded=1";
      const existingCustomerId = user && user.pro && user.pro.customer && String(user.pro.customer).startsWith("ctm_")
        ? String(user.pro.customer)
        : undefined;

      // Preferred path: Paddle.js v2 overlay checkout in the browser.
      if (cfg.clientToken) {
        return json(res, 200, {
          ok: true,
          mode: "paddle",
          env: cfg.env,
          token: cfg.clientToken,
          priceId,
          email: s.e,
          customerId: existingCustomerId,
          successUrl,
        });
      }

      // Fallback path when only PADDLE_API_KEY is set: create a Paddle transaction server-side
      // and redirect to its hosted checkout.url (requires Default Payment Link set in Paddle).
      const payload = {
        items: [{ price_id: priceId, quantity: 1 }],
        custom_data: { email: s.e },
      };
      if (existingCustomerId) payload.customer_id = existingCustomerId;

      const txn = await paddleFetch(cfg, "transactions", payload);
      const url = txn && txn.data && txn.data.checkout && txn.data.checkout.url;
      if (!url) return json(res, 502, { ok: false, error: "Could not open checkout. Set your Default Payment Link in Paddle." });
      return json(res, 200, { ok: true, url });
    }

    if (action === "portal") {
      // Security: always resolve customerId from the authenticated user's record, never from req.body.
      const user = store.enabled() ? await users.get(s.e) : null;
      const customerId = user && user.pro && user.pro.customer ? String(user.pro.customer) : "";
      if (!customerId || !customerId.startsWith("ctm_")) {
        return json(res, 200, { ok: false, code: "no_customer", error: "No billing account yet." });
      }
      const subIds = user.pro.subscription && String(user.pro.subscription).startsWith("sub_")
        ? [String(user.pro.subscription)]
        : [];
      // Mint a fresh portal session per click; never cache or expose the raw session object.
      const session = await paddleFetch(cfg, "customers/" + encodeURIComponent(customerId) + "/portal-sessions", {
        subscription_ids: subIds,
      });
      const url = session && session.data && session.data.urls && session.data.urls.general && session.data.urls.general.overview;
      if (!url) return json(res, 502, { ok: false, error: "Could not open billing portal." });
      return json(res, 200, { ok: true, url });
    }

    return json(res, 404, { ok: false, error: "Unknown action." });
  } catch (e) {
    return json(res, e.status || 500, { ok: false, error: e.message });
  }
};
