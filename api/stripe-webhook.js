// Vercel Function: /api/stripe-webhook   Stripe calls this when a subscription changes.
// Verifies the signature with STRIPE_WEBHOOK_SECRET (no SDK: HMAC-SHA256 over "t.payload"),
// then flips  pro  on the user record. Events to subscribe in the Stripe dashboard:
//   checkout.session.completed, customer.subscription.updated, customer.subscription.deleted,
//   invoice.payment_failed
//
// Store keys:  u:<email>.pro = { active, customer, subscription, until, plan, updatedAt }
//              cust:<customerId> -> email   (so subscription events can find the user)

const crypto = require("crypto");
const store = require("../lib/store.js");
const users = require("../lib/users.js");

module.exports.config = { api: { bodyParser: false } };

function rawBody(req) {
  return new Promise((resolve, reject) => {
    if (typeof req.body === "string") return resolve(req.body);
    if (req.body && Buffer.isBuffer(req.body)) return resolve(req.body.toString("utf8"));
    // Already parsed by the platform (bodyParser left on): re-serialise. Key order survives
    // JSON.parse/JSON.stringify, so Stripe's signature still matches.
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
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=").map((x) => x.trim())));
  const t = parts.t, v1 = parts.v1;
  if (!t || !v1) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const expected = crypto.createHmac("sha256", secret).update(t + "." + payload).digest("hex");
  const a = Buffer.from(expected), b = Buffer.from(v1);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function setPro(email, patch) {
  if (!email) return false;
  const user = (await users.get(email)) || users.blank(email);
  user.pro = Object.assign({}, user.pro || {}, patch, { updatedAt: new Date().toISOString() });
  await users.save(user);
  if (patch.customer) await store.setJson("cust:" + patch.customer, { email }, 400 * 86400);
  return true;
}

async function emailForCustomer(customerId) {
  if (!customerId) return null;
  const m = await store.getJson("cust:" + customerId);
  return m && m.email ? m.email : null;
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (req.method !== "POST") return res.status(405).send(JSON.stringify({ ok: false, error: "Use POST." }));
  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
  const payload = await rawBody(req);
  if (!verify(payload, req.headers["stripe-signature"], secret)) return res.status(400).send(JSON.stringify({ ok: false, error: "Bad signature." }));
  if (!store.enabled()) return res.status(503).send(JSON.stringify({ ok: false, error: "Store not configured." }));

  let event;
  try { event = JSON.parse(payload); } catch (_) { return res.status(400).send(JSON.stringify({ ok: false, error: "Bad JSON." })); }
  const obj = (event.data && event.data.object) || {};
  try {
    if (event.type === "checkout.session.completed" && obj.mode === "subscription") {
      const email = (obj.customer_details && obj.customer_details.email) || (obj.metadata && obj.metadata.email) || obj.client_reference_id || obj.customer_email;
      await setPro(String(email || "").toLowerCase(), { active: true, customer: obj.customer, subscription: obj.subscription, plan: "pro" });
    } else if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const email = (obj.metadata && obj.metadata.email) || (await emailForCustomer(obj.customer));
      const active = event.type !== "customer.subscription.deleted" && ["active", "trialing", "past_due"].includes(obj.status);
      await setPro(String(email || "").toLowerCase(), { active, customer: obj.customer, subscription: obj.id, until: obj.current_period_end ? obj.current_period_end * 1000 : undefined, status: obj.status });
    } else if (event.type === "invoice.payment_failed") {
      const email = await emailForCustomer(obj.customer);
      if (email) await setPro(email, { status: "payment_failed" });
    }
    res.status(200).send(JSON.stringify({ ok: true, received: event.type }));
  } catch (e) {
    res.status(500).send(JSON.stringify({ ok: false, error: e.message }));
  }
};
