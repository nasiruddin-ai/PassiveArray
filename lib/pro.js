// Pro plan rules in one place. Everything that was free stays free; Pro adds
// the things that cost money to run: watching channels with weekly alerts,
// exports, and higher daily MCP credits.
//
// The user record carries  pro: { provider, active, customer, subscription, productId, status, cancelAtPeriodEnd, until, plan, lastEventAt, updatedAt }
// written by lib/api-billing-webhook.js (Polar).

const PRICE_MONTHLY = 9;   // USD, shown on the pricing page
const PRICE_YEARLY = 79;
// Lifetime: one payment for Pro for the lifetime of the product. The first LIFETIME_LAUNCH_SEATS
// buyers pay the launch price; after that the regular price applies.
const PRICE_LIFETIME = 149;
const PRICE_LIFETIME_LAUNCH = 99;
const LIFETIME_LAUNCH_SEATS = 100;
const LIFETIME_SOLD_KEY = "lifetime:sold"; // store: { n } lifetime orders paid, minus refunds
const FREE_WATCH = 3;      // channels a free account can watch, no alerts
const PRO_WATCH = 100;

function isPro(user) {
  const p = user && user.pro;
  if (p && p.lifetime) return true; // paid once; subscription events never switch this off
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

// Lifetime needs its own one-time products in Polar: the regular one, and optionally the launch one.
function lifetimeProducts() {
  return { regular: process.env.POLAR_PRODUCT_ID_LIFETIME || "", launch: process.env.POLAR_PRODUCT_ID_LIFETIME_LAUNCH || "" };
}
function lifetimeConfigured() {
  const p = lifetimeProducts();
  return !!(process.env.POLAR_ACCESS_TOKEN && (p.regular || p.launch));
}
// What a buyer would be charged right now, given how many lifetime orders are already paid.
function lifetimeOffer(sold) {
  const p = lifetimeProducts();
  const left = Math.max(0, LIFETIME_LAUNCH_SEATS - (Number(sold) || 0));
  const launch = !!p.launch && left > 0;
  return {
    configured: lifetimeConfigured() && (launch || !!p.regular),
    productId: launch ? p.launch : p.regular,
    price: launch ? PRICE_LIFETIME_LAUNCH : PRICE_LIFETIME,
    regular: PRICE_LIFETIME, launchPrice: PRICE_LIFETIME_LAUNCH, seats: LIFETIME_LAUNCH_SEATS,
    launch, launchLeft: p.launch ? left : 0,
  };
}

function billingConfigured() {
  return !!(process.env.POLAR_ACCESS_TOKEN && process.env.POLAR_PRODUCT_ID_MONTHLY);
}

module.exports = { PRICE_LIFETIME, PRICE_LIFETIME_LAUNCH, LIFETIME_LAUNCH_SEATS, LIFETIME_SOLD_KEY, lifetimeProducts, lifetimeConfigured, lifetimeOffer, PRICE_MONTHLY, PRICE_YEARLY, FREE_WATCH, PRO_WATCH, isPro, watchLimit, planName, billingConfigured, polarEnv };
