// Pro plan rules in one place. Everything that was free stays free; Pro adds
// the things that cost money to run: watching channels with weekly alerts,
// exports, and (later) bulk checks.
//
// The user record carries  pro: { provider, active, customer, subscription, priceId, status, scheduledAction, until, plan, lastEventAt, updatedAt }
// written by lib/api-billing-webhook.js (Paddle Billing).

const PRICE_MONTHLY = 9;   // USD, shown on the pricing page
const PRICE_YEARLY = 79;
const FREE_WATCH = 3;      // channels a free account can watch, no alerts
const PRO_WATCH = 100;

function isPro(user) {
  const p = user && user.pro;
  if (!p || !p.active) return false;
  if (p.until && Date.now() > p.until + 3 * 86400000) return false; // 3 days of grace after a missed renewal
  return true;
}

function watchLimit(user) {
  return isPro(user) ? PRO_WATCH : FREE_WATCH;
}

function planName(user) {
  return isPro(user) ? "Pro" : "Free";
}

function paddleEnv() {
  return "production";
}

function billingConfigured() {
  const hasPrice = !!process.env.PADDLE_PRICE_ID_MONTHLY;
  const hasClient = !!(process.env.PADDLE_CLIENT_TOKEN || process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN);
  const hasApi = !!process.env.PADDLE_API_KEY;
  return !!(hasPrice && (hasClient || hasApi));
}

module.exports = { PRICE_MONTHLY, PRICE_YEARLY, FREE_WATCH, PRO_WATCH, isPro, watchLimit, planName, billingConfigured, paddleEnv };
