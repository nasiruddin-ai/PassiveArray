// Handler for /api/billing-webhook (served through api/pro.js) — Polar (polar.sh) webhooks.
// Verifies Standard Webhooks headers (webhook-id, webhook-timestamp, webhook-signature)
// using POLAR_WEBHOOK_SECRET (supports both post-Sept-2026 base64 Standard Webhooks keys
// and legacy raw UTF-8 Polar HMAC keys), enforces event ordering via timestamp, and
// mirrors Pro subscription state onto the user record.
//
// Events to subscribe in Polar > Settings > Webhooks:
//   subscription.created, subscription.active, subscription.updated,
//   subscription.canceled, subscription.uncanceled, subscription.revoked,
//   customer.created, customer.updated, customer.state_changed, order.paid, order.refunded
//
// Lifetime: an order.paid for POLAR_PRODUCT_ID_LIFETIME or POLAR_PRODUCT_ID_LIFETIME_LAUNCH sets
// pro.lifetime = true, which lib/pro.js treats as Pro with no end date. order.refunded for the
// same products clears it. Paid lifetime orders are counted in the store for the launch price.
//
// Store keys:
//   u:<email>.pro = { provider: "polar", active, plan, status, subscription, customer, productId, cancelAtPeriodEnd, until, lastEventAt, updatedAt }
//   polarsub:<subscriptionId> -> { email }
//   polarcust:<customerId>    -> { email }

const crypto = require("crypto");
const store = require("./store.js");
const users = require("./users.js");
const pro = require("./pro.js");

function isLifetimeProduct(id) {
  const p = pro.lifetimeProducts();
  return !!id && (id === p.regular || id === p.launch);
}
// Count each paid lifetime order once, even if Polar delivers the webhook again.
async function countLifetime(orderId, delta) {
  const seenKey = "polarorder:" + orderId + (delta > 0 ? ":paid" : ":refunded");
  if (orderId && (await store.getJson(seenKey))) return;
  const rec = (await store.getJson(pro.LIFETIME_SOLD_KEY)) || { n: 0 };
  rec.n = Math.max(0, (Number(rec.n) || 0) + delta);
  await store.setJson(pro.LIFETIME_SOLD_KEY, rec);
  if (orderId) await store.setJson(seenKey, { at: new Date().toISOString() }, 400 * 86400);
}

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

// Verify Polar Standard Webhooks signature:
//   signedContent = `${webhook-id}.${webhook-timestamp}.${rawBody}`
//   webhook-signature = "v1,<base64> v1,<base64>..."
// Tries both Standard Webhooks key (base64-decoded after stripping whsec_) and legacy UTF-8 key.
function verifyPolarSignature(payload, headers, secret) {
  const id = headers["webhook-id"] || "";
  const tsRaw = headers["webhook-timestamp"] || "";
  const sigHeader = headers["webhook-signature"] || "";
  if (!id || !tsRaw || !sigHeader || !secret) return false;

  const ts = Number(tsRaw);
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) return false;

  const sigs = String(sigHeader)
    .split(/\s+/)
    .map((part) => {
      const idx = part.indexOf(",");
      if (idx <= 0) return null;
      return { ver: part.slice(0, idx), val: part.slice(idx + 1) };
    })
    .filter((s) => s && s.ver === "v1" && s.val);
  if (!sigs.length) return false;

  const signedContent = id + "." + tsRaw + "." + payload;
  const trimmed = String(secret).trim();
  const stripped = trimmed.startsWith("whsec_") ? trimmed.slice(6) : trimmed;

  // Candidate keys: Standard Webhooks (base64 decode) + Legacy Polar HMAC (raw UTF-8 bytes)
  const keys = [
    Buffer.from(stripped, "base64"),
    Buffer.from(trimmed, "utf8"),
  ];

  for (const key of keys) {
    if (!key.length) continue;
    const expected = crypto.createHmac("sha256", key).update(signedContent).digest("base64");
    const expBuf = Buffer.from(expected, "utf8");
    for (const s of sigs) {
      const sigBuf = Buffer.from(s.val, "utf8");
      if (sigBuf.length === expBuf.length && crypto.timingSafeEqual(expBuf, sigBuf)) {
        return true;
      }
    }
  }
  return false;
}

const ms = (iso) => (iso ? Date.parse(iso) || undefined : undefined);

// Per Polar docs: active, trialing, and past_due keep Pro access.
// When a user cancels before period end, Polar fires subscription.canceled (with cancel_at_period_end: true);
// keep access until current_period_end and revoke when subscription.revoked arrives.
const KEEPS_PRO = new Set(["active", "trialing", "past_due"]);

async function emailForSub(id) {
  if (!id) return null;
  const m = await store.getJson("polarsub:" + id);
  return m && m.email ? String(m.email).toLowerCase() : null;
}

async function emailForCustomer(id) {
  if (!id) return null;
  const m = await store.getJson("polarcust:" + id);
  return m && m.email ? String(m.email).toLowerCase() : null;
}

async function saveMapping(email, customerId, subscriptionId) {
  if (!email) return;
  const clean = String(email).toLowerCase();
  if (customerId) await store.setJson("polarcust:" + customerId, { email: clean }, 400 * 86400);
  if (subscriptionId) await store.setJson("polarsub:" + subscriptionId, { email: clean }, 400 * 86400);
}

async function setProOrdered(email, patch, occurredAt) {
  if (!email) return false;
  const clean = String(email).toLowerCase();
  const user = (await users.get(clean)) || users.blank(clean);
  const prevAt = user.pro && user.pro.lastEventAt ? Date.parse(user.pro.lastEventAt) : 0;
  const nextAt = occurredAt ? Date.parse(occurredAt) : 0;
  if (prevAt && nextAt && nextAt < prevAt) return false;

  user.pro = Object.assign({}, user.pro || {}, patch, {
    provider: "polar",
    lastEventAt: occurredAt || (user.pro && user.pro.lastEventAt) || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await users.save(user);
  await saveMapping(clean, user.pro.customer, user.pro.subscription);
  return true;
}

const SUB_EVENTS = new Set([
  "subscription.created",
  "subscription.active",
  "subscription.updated",
  "subscription.canceled",
  "subscription.uncanceled",
  "subscription.revoked",
]);

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (req.method !== "POST") return res.status(405).send(JSON.stringify({ ok: false, error: "Use POST." }));

  const payload = await rawBody(req);
  const secret = process.env.POLAR_WEBHOOK_SECRET || "";
  if (!payload || !verifyPolarSignature(payload, req.headers || {}, secret)) {
    return res.status(403).send(JSON.stringify({ ok: false, error: "Invalid signature." }));
  }

  let event;
  try {
    event = JSON.parse(payload);
  } catch (_) {
    return res.status(400).send(JSON.stringify({ ok: false, error: "Malformed JSON." }));
  }

  if (!store.enabled()) {
    return res.status(503).send(JSON.stringify({ ok: false, error: "Store not configured." }));
  }

  const type = String(event.type || "");
  const occurredAt = event.timestamp || new Date().toISOString();
  const d = event.data || {};
  const meta = d.metadata || {};

  try {
    if (type === "customer.created" || type === "customer.updated") {
      const customerId = d.id ? String(d.id) : "";
      const email = String(d.external_id || d.email || "").toLowerCase();
      if (customerId && email) {
        await saveMapping(email, customerId, null);
        const existing = await users.get(email);
        if (existing) {
          existing.pro = Object.assign({}, existing.pro || {}, { provider: "polar", customer: customerId });
          await users.save(existing);
        }
      }
    } else if (type === "customer.state_changed") {
      const customerId = d.id ? String(d.id) : "";
      const email = String(d.external_id || d.email || (await emailForCustomer(customerId)) || "").toLowerCase();
      if (customerId && email) {
        const subs = Array.isArray(d.active_subscriptions) ? d.active_subscriptions : [];
        const activeSub = subs[0] || null;
        await setProOrdered(email, {
          active: !!activeSub,
          plan: "pro",
          status: activeSub ? String(activeSub.status || "active") : "revoked",
          subscription: activeSub && activeSub.id ? String(activeSub.id) : (undefined),
          customer: customerId,
          productId: activeSub && activeSub.product_id ? String(activeSub.product_id) : undefined,
          until: activeSub ? ms(activeSub.current_period_end) : undefined,
        }, occurredAt);
      }
    } else if (SUB_EVENTS.has(type)) {
      const subId = d.id ? String(d.id) : "";
      const customerId = d.customer_id ? String(d.customer_id) : (d.customer && d.customer.id ? String(d.customer.id) : "");
      const email = String(
        meta.email ||
        (d.customer && (d.customer.external_id || d.customer.email)) ||
        (await emailForSub(subId)) ||
        (await emailForCustomer(customerId)) ||
        ""
      ).toLowerCase();

      const status = String(d.status || "");
      const cancelAtEnd = !!d.cancel_at_period_end;
      const periodEnd = ms(d.current_period_end || d.ends_at);
      // Keep Pro active through current_period_end if canceled at period end; revoke on subscription.revoked.
      const stillInPeriod = status === "canceled" && periodEnd && periodEnd > Date.now();
      const active = type !== "subscription.revoked" && (KEEPS_PRO.has(status) || stillInPeriod);

      await setProOrdered(email, {
        active,
        plan: "pro",
        status,
        subscription: subId || undefined,
        customer: customerId || undefined,
        productId: d.product_id ? String(d.product_id) : undefined,
        cancelAtPeriodEnd: cancelAtEnd,
        until: periodEnd,
      }, occurredAt);
    } else if (type === "order.paid") {
      const customerId = d.customer_id ? String(d.customer_id) : (d.customer && d.customer.id ? String(d.customer.id) : "");
      const subId = d.subscription_id ? String(d.subscription_id) : "";
      const email = String(
        meta.email ||
        (d.customer && (d.customer.external_id || d.customer.email)) ||
        (await emailForSub(subId)) ||
        (await emailForCustomer(customerId)) ||
        ""
      ).toLowerCase();
      if (email) await saveMapping(email, customerId, subId);
      const productId = String(d.product_id || (d.product && d.product.id) || "");
      if (email && isLifetimeProduct(productId)) {
        await setProOrdered(email, {
          lifetime: true, lifetimeOrder: d.id ? String(d.id) : undefined, lifetimeAt: occurredAt,
          active: true, plan: "lifetime", status: "lifetime",
          customer: customerId || undefined, productId, cancelAtPeriodEnd: false, until: undefined,
        }, occurredAt);
        await countLifetime(d.id ? String(d.id) : "", 1);
      }
    } else if (type === "order.refunded") {
      const customerId = d.customer_id ? String(d.customer_id) : (d.customer && d.customer.id ? String(d.customer.id) : "");
      const email = String(meta.email || (d.customer && (d.customer.external_id || d.customer.email)) || (await emailForCustomer(customerId)) || "").toLowerCase();
      const productId = String(d.product_id || (d.product && d.product.id) || "");
      if (email && isLifetimeProduct(productId)) {
        await setProOrdered(email, { lifetime: false, active: false, plan: "pro", status: "refunded" }, occurredAt);
        await countLifetime(d.id ? String(d.id) : "", -1);
      }
    }

    return res.status(200).send(JSON.stringify({ ok: true, received: type }));
  } catch (e) {
    console.error("Polar webhook error:", e.message);
    return res.status(500).send(JSON.stringify({ ok: false, error: "Webhook processing failed." }));
  }
};
