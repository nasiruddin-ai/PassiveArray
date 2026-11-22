// Handler for /api/billing-webhook (served through api/pro.js) — Paddle Billing webhooks.
// Verifies the Paddle-Signature header (ts=<unix>;h1=<hex>, HMAC-SHA256 of `${ts}:${rawBody}`
// with PADDLE_WEBHOOK_SECRET or PADDLE_NOTIFICATION_WEBHOOK_SECRET), enforces event ordering
// via occurred_at, and mirrors Pro subscription state onto the user record.
//
// Events to subscribe in Paddle > Events > Notifications:
//   customer.created, customer.updated, customer.imported,
//   subscription.created, subscription.imported, subscription.activated, subscription.trialing,
//   subscription.updated, subscription.past_due, subscription.paused, subscription.resumed,
//   subscription.canceled, transaction.completed, transaction.payment_failed
//
// Store keys:
//   u:<email>.pro = { provider: "paddle", active, plan, status, subscription, customer, priceId, scheduledAction, until, lastEventAt, updatedAt }
//   pdsub:<subscriptionId> -> { email }
//   pdcust:<customerId>    -> { email }

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

// Verify Paddle-Signature header: "ts=1671552777;h1=eb4d0dc8..."
// Signed payload is `${ts}:${rawBody}` using HMAC-SHA256 with the destination secret.
function verifyPaddleSignature(payload, header, secret) {
  if (!header || !secret) return false;
  const parts = String(header).split(";").reduce((acc, kv) => {
    const idx = kv.indexOf("=");
    if (idx > 0) {
      const k = kv.slice(0, idx).trim();
      const v = kv.slice(idx + 1).trim();
      if (k === "h1") acc.h1.push(v);
      else acc[k] = v;
    }
    return acc;
  }, { h1: [] });

  const ts = Number(parts.ts);
  if (!Number.isFinite(ts) || !parts.h1.length) return false;
  // Reject replayed timestamps older than 5 minutes (tolerant of small serverless clock drift).
  if (Math.abs(Date.now() / 1000 - ts) > 300) return false;

  const expected = crypto.createHmac("sha256", secret).update(parts.ts + ":" + payload).digest("hex");
  const expBuf = Buffer.from(expected, "utf8");
  return parts.h1.some((sig) => {
    const sigBuf = Buffer.from(sig, "utf8");
    return sigBuf.length === expBuf.length && crypto.timingSafeEqual(expBuf, sigBuf);
  });
}

const ms = (iso) => (iso ? Date.parse(iso) || undefined : undefined);

// Paddle status semantics: active, trialing, and past_due keep Pro access.
// Canceling at period end keeps status="active" with scheduled_change.action="cancel" until effective_at,
// when Paddle sends subscription.canceled and status becomes "canceled".
const KEEPS_PRO = new Set(["active", "trialing", "past_due"]);

async function emailForSub(id) {
  if (!id) return null;
  const m = await store.getJson("pdsub:" + id);
  return m && m.email ? String(m.email).toLowerCase() : null;
}

async function emailForCustomer(id) {
  if (!id) return null;
  const m = await store.getJson("pdcust:" + id);
  return m && m.email ? String(m.email).toLowerCase() : null;
}

async function saveMapping(email, customerId, subscriptionId) {
  if (!email) return;
  const clean = String(email).toLowerCase();
  if (customerId) await store.setJson("pdcust:" + customerId, { email: clean }, 400 * 86400);
  if (subscriptionId) await store.setJson("pdsub:" + subscriptionId, { email: clean }, 400 * 86400);
}

async function setProOrdered(email, patch, occurredAt) {
  if (!email) return false;
  const clean = String(email).toLowerCase();
  const user = (await users.get(clean)) || users.blank(clean);
  const prevAt = user.pro && user.pro.lastEventAt ? Date.parse(user.pro.lastEventAt) : 0;
  const nextAt = occurredAt ? Date.parse(occurredAt) : 0;
  // Ordering guard: never let an older retried/replayed webhook overwrite newer state.
  if (prevAt && nextAt && nextAt < prevAt) return false;

  user.pro = Object.assign({}, user.pro || {}, patch, {
    provider: "paddle",
    lastEventAt: occurredAt || (user.pro && user.pro.lastEventAt) || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await users.save(user);
  await saveMapping(clean, user.pro.customer, user.pro.subscription);
  return true;
}

const SUB_EVENTS = new Set([
  "subscription.created",
  "subscription.imported",
  "subscription.activated",
  "subscription.trialing",
  "subscription.updated",
  "subscription.past_due",
  "subscription.paused",
  "subscription.resumed",
  "subscription.canceled",
]);

const CUST_EVENTS = new Set([
  "customer.created",
  "customer.updated",
  "customer.imported",
]);

// Dynamic Paddle live IP allowlist fetched from https://api.paddle.com/ips (never hard-coded).
// Cached in memory for 1 hour to stay well within Paddle's 5-second webhook timeout.
let cachedPaddleIps = { list: null, fetchedAt: 0 };
const IP_CACHE_MS = 3600 * 1000;

async function getPaddleLiveIps() {
  if (cachedPaddleIps.list && Date.now() - cachedPaddleIps.fetchedAt < IP_CACHE_MS) {
    return cachedPaddleIps.list;
  }
  const r = await fetch("https://api.paddle.com/ips", { headers: { Accept: "application/json" } });
  if (!r.ok) throw new Error("Failed to fetch Paddle live IPs (" + r.status + ").");
  const body = await r.json();
  const cidrs = (body && body.data && Array.isArray(body.data.ipv4_cidrs)) ? body.data.ipv4_cidrs : [];
  if (!cidrs.length) throw new Error("Empty Paddle IP list returned.");
  const ips = new Set(cidrs.map((c) => String(c).replace(/\/32$/, "").trim()));
  cachedPaddleIps = { list: ips, fetchedAt: Date.now() };
  return ips;
}

function clientIp(req) {
  const xff = req.headers && (req.headers["x-forwarded-for"] || req.headers["x-real-ip"]);
  const raw = xff ? String(xff).split(",")[0].trim() : (req.socket && req.socket.remoteAddress) || "";
  return raw.replace(/^::ffff:/, "");
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (req.method !== "POST") return res.status(405).send(JSON.stringify({ ok: false, error: "Use POST." }));

  // Enforce Paddle live IP allowlist (fetched dynamically from https://api.paddle.com/ips).
  if (process.env.PADDLE_ENFORCE_IP_ALLOWLIST !== "0") {
    try {
      const ip = clientIp(req);
      const allowed = await getPaddleLiveIps();
      if (!ip || !allowed.has(ip)) {
        return res.status(403).send(JSON.stringify({ ok: false, error: "Forbidden IP." }));
      }
    } catch (e) {
      console.error("Paddle IP allowlist fetch failed:", e.message);
      return res.status(500).send(JSON.stringify({ ok: false, error: "IP verification unavailable." }));
    }
  }

  const signature = req.headers["paddle-signature"] || "";
  const payload = await rawBody(req);
  if (!signature || !payload) {
    return res.status(400).send(JSON.stringify({ ok: false, error: "Missing signature or body." }));
  }

  const secret = process.env.PADDLE_WEBHOOK_SECRET || process.env.PADDLE_NOTIFICATION_WEBHOOK_SECRET || "";

  // Single catch returning 500 on any signature, JSON, store, or handler failure so Paddle retries.
  // Never return 2xx on a failed verification or failed write.
  try {
    if (!verifyPaddleSignature(payload, signature, secret)) {
      throw new Error("Invalid Paddle signature.");
    }
    if (!store.enabled()) {
      throw new Error("Store not configured.");
    }

    const event = JSON.parse(payload);
    const type = String(event.event_type || "");
    const occurredAt = event.occurred_at || new Date().toISOString();
    const d = event.data || {};
    const custom = d.custom_data || {};

    if (CUST_EVENTS.has(type)) {
      const customerId = d.id ? String(d.id) : "";
      const email = d.email ? String(d.email).toLowerCase() : "";
      if (customerId && email) {
        await saveMapping(email, customerId, null);
        const existing = await users.get(email);
        if (existing) {
          existing.pro = Object.assign({}, existing.pro || {}, { provider: "paddle", customer: customerId });
          await users.save(existing);
        }
      }
    } else if (SUB_EVENTS.has(type)) {
      const subId = d.id ? String(d.id) : "";
      const customerId = d.customer_id ? String(d.customer_id) : "";
      const email = String(
        custom.email ||
        (await emailForSub(subId)) ||
        (await emailForCustomer(customerId)) ||
        ""
      ).toLowerCase();

      const status = String(d.status || "");
      const active = type !== "subscription.canceled" && KEEPS_PRO.has(status);
      const sched = d.scheduled_change || null;
      const periodEnd = d.current_billing_period && d.current_billing_period.ends_at;
      const untilIso = (sched && sched.action === "cancel" && sched.effective_at) || periodEnd || d.next_billed_at || null;
      const firstPrice = d.items && d.items[0] && d.items[0].price && d.items[0].price.id;

      await setProOrdered(email, {
        active,
        plan: "pro",
        status,
        subscription: subId || undefined,
        customer: customerId || undefined,
        priceId: firstPrice ? String(firstPrice) : undefined,
        scheduledAction: sched && sched.action ? String(sched.action) : null,
        until: ms(untilIso),
      }, occurredAt);
    } else if (type === "transaction.completed") {
      const customerId = d.customer_id ? String(d.customer_id) : "";
      const subId = d.subscription_id ? String(d.subscription_id) : "";
      const email = String(
        custom.email ||
        (await emailForSub(subId)) ||
        (await emailForCustomer(customerId)) ||
        ""
      ).toLowerCase();
      if (email) await saveMapping(email, customerId, subId);
    } else if (type === "transaction.payment_failed") {
      const subId = d.subscription_id ? String(d.subscription_id) : "";
      const customerId = d.customer_id ? String(d.customer_id) : "";
      const email = String(
        custom.email ||
        (await emailForSub(subId)) ||
        (await emailForCustomer(customerId)) ||
        ""
      ).toLowerCase();
      if (email) {
        await setProOrdered(email, { status: "payment_failed" }, occurredAt);
      }
    }

    return res.status(200).send(JSON.stringify({ ok: true, received: type }));
  } catch (e) {
    console.error("Paddle webhook error:", e.message);
    return res.status(500).send(JSON.stringify({ ok: false, error: "Webhook processing failed." }));
  }
};
