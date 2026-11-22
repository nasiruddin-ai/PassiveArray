// Pro plan rules in one place. Everything that was free stays free; Pro adds
// the things that cost money to run: watching channels with weekly alerts,
// exports, and higher daily MCP credits.
//
// The user record carries  pro: { provider, active, customer, subscription, productId, status, cancelAtPeriodEnd, until, plan, lastEventAt, updatedAt }
// written by lib/api-billing-webhook.js (Polar).

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

function polarEnv() {
  return String(process.env.POLAR_ENV || "production").toLowerCase() === "sandbox" ? "sandbox" : "production";
}

function billingConfigured() {
  return !!(process.env.POLAR_ACCESS_TOKEN && process.env.POLAR_PRODUCT_ID_MONTHLY);
}

module.exports = { PRICE_MONTHLY, PRICE_YEARLY, FREE_WATCH, PRO_WATCH, isPro, watchLimit, planName, billingConfigured, polarEnv };
