// Handler for /api/billing-webhook (served through api/pro.js)   Lemon Squeezy calls this when a subscription changes.
// Verifies the X-Signature header (HMAC-SHA256 of the raw body with LEMONSQUEEZY_WEBHOOK_SECRET, hex),
// then flips  pro  on the user record. Events to tick in Lemon Squeezy, Settings > Webhooks:
//   subscription_created, subscription_updated, subscription_cancelled, subscription_resumed,
//   subscription_expired, subscription_payment_failed
//
// Store keys:  u:<email>.pro = { active, customer, subscription, until, status, plan, updatedAt }
//              lssub:<subscriptionId> -> email   (so payment events can find the user)

const crypto = require("crypto");
const store = require("./store.js");
const users = require("./users.js");

function rawBody(req) {
  return new Promise((resolve, reject) => {
    if (typeof req.rawBody === "string") return resolve(req.rawBody);
    if (typeof req.body === "string") return resolve(req.body);
    if (req.body && Buffer.isBuffer(req.body)) return resolve(req.body.toString("utf8"));
    if (req.body && typeof req.body === "object") return resolve(JSON.stringify(req.body));
    if (typeof req.on !== "function") return resolve("");
    let data = "";
    req.on("data", (c) => { data += c; });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function verify(payload, header, secret) {
  if (!header || !secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const a = Buffer.from(expected), b = Buffer.from(String(header));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function setPro(email, patch) {
  if (!email) return false;
  const user = (await users.get(email)) || users.blank(email);
  user.pro = Object.assign({}, user.pro || {}, patch, { updatedAt: new Date().toISOString() });
  await users.save(user);
  if (patch.subscription) await store.setJson("lssub:" + patch.subscription, { email }, 400 * 86400);
  return true;
}

async function emailForSubscription(id) {
  if (!id) return null;
  const m = await store.getJson("lssub:" + id);
  return m && m.email ? m.email : null;
}

// Statuses that still give Pro. A cancelled subscription keeps Pro until its ends_at date.
const KEEPS_PRO = ["on_trial", "active", "past_due", "cancelled"];
const ms = (iso) => (iso ? Date.parse(iso) || undefined : undefined);

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (req.method !== "POST") return res.status(405).send(JSON.stringify({ ok: false, error: "Use POST." }));
  const payload = await rawBody(req);
  if (!verify(payload, req.headers["x-signature"], process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "")) return res.status(400).send(JSON.stringify({ ok: false, error: "Bad signature." }));
  if (!store.enabled()) return res.status(503).send(JSON.stringify({ ok: false, error: "Store not configured." }));

  let event;
  try { event = JSON.parse(payload); } catch (_) { return res.status(400).send(JSON.stringify({ ok: false, error: "Bad JSON." })); }
  const name = (event.meta && event.meta.event_name) || "";
  const custom = (event.meta && event.meta.custom_data) || {};
  const data = event.data || {};
  const a = data.attributes || {};
  try {
    if (data.type === "subscriptions") {
      const id = String(data.id);
      const email = String(custom.email || (await emailForSubscription(id)) || a.user_email || "").toLowerCase();
      const active = name !== "subscription_expired" && KEEPS_PRO.includes(a.status);
      await setPro(email, {
        active, plan: "pro", status: a.status, subscription: id,
        customer: a.customer_id ? String(a.customer_id) : undefined,
        variant: a.variant_id ? String(a.variant_id) : undefined,
        until: a.status === "cancelled" ? ms(a.ends_at) : ms(a.renews_at),
      });
    } else if (name === "subscription_payment_failed") {
      const email = custom.email || (await emailForSubscription(String(a.subscription_id || "")));
      if (email) await setPro(String(email).toLowerCase(), { status: "payment_failed" });
    }
    res.status(200).send(JSON.stringify({ ok: true, received: name }));
  } catch (e) {
    res.status(500).send(JSON.stringify({ ok: false, error: e.message }));
  }
};
