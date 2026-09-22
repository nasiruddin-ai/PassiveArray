// Verifies the ID token that Google Identity Services hands the browser.
//
// The token is an RS256 JWT signed by Google. We fetch Google's public keys,
// check the signature ourselves and then check every claim that matters. This
// is done locally rather than by calling Google's tokeninfo endpoint, so a
// sign-in costs no extra round trip once the keys are cached.
//
// Needs GOOGLE_CLIENT_ID, the OAuth client ID from the Google Cloud console.

const crypto = require("crypto");

const CERTS = "https://www.googleapis.com/oauth2/v3/certs";
const ISSUERS = new Set(["accounts.google.com", "https://accounts.google.com"]);

let cache = { keys: null, until: 0 };

function clientId() {
  return process.env.GOOGLE_CLIENT_ID || "";
}

async function publicKeys() {
  if (cache.keys && cache.until > Date.now()) return cache.keys;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const r = await fetch(CERTS, { signal: ctrl.signal });
    if (!r.ok) throw new Error("Google key fetch answered " + r.status);
    const data = await r.json();
    // Respect Google's own cache header, with a floor and a ceiling.
    const m = /max-age=(\d+)/.exec(r.headers.get("cache-control") || "");
    const ttl = Math.min(Math.max(m ? Number(m[1]) : 3600, 300), 24 * 3600);
    cache = { keys: data.keys || [], until: Date.now() + ttl * 1000 };
    return cache.keys;
  } finally {
    clearTimeout(timer);
  }
}

function decode(part) {
  return JSON.parse(Buffer.from(part, "base64url").toString("utf8"));
}

/**
 * Returns { email, name, picture, sub } for a valid token, or throws.
 * Every failure path throws, so a caller that gets a value can trust it.
 */
async function verifyIdToken(idToken) {
  const id = clientId();
  if (!id) throw new Error("GOOGLE_CLIENT_ID is not set");
  if (typeof idToken !== "string" || idToken.length > 8000) throw new Error("malformed token");

  const parts = idToken.split(".");
  if (parts.length !== 3) throw new Error("malformed token");

  let header, payload;
  try {
    header = decode(parts[0]);
    payload = decode(parts[1]);
  } catch (_) {
    throw new Error("malformed token");
  }
  if (header.alg !== "RS256") throw new Error("unexpected signing algorithm");

  const keys = await publicKeys();
  const jwk = keys.find((k) => k.kid === header.kid);
  if (!jwk) throw new Error("signing key not recognised");

  const key = crypto.createPublicKey({ key: jwk, format: "jwk" });
  const signed = Buffer.from(parts[0] + "." + parts[1]);
  const signature = Buffer.from(parts[2], "base64url");
  if (!crypto.verify("RSA-SHA256", signed, key, signature)) throw new Error("signature does not match");

  const now = Math.floor(Date.now() / 1000);
  if (!ISSUERS.has(payload.iss)) throw new Error("wrong issuer");
  if (payload.aud !== id) throw new Error("token was issued for a different app");
  if (!payload.exp || payload.exp < now - 60) throw new Error("token has expired");
  if (payload.iat && payload.iat > now + 300) throw new Error("token is from the future");
  if (!payload.email) throw new Error("token carries no email address");
  if (payload.email_verified === false) throw new Error("that Google account has an unverified email address");

  return {
    email: String(payload.email).trim().toLowerCase(),
    name: payload.name || "",
    picture: payload.picture || "",
    sub: payload.sub || "",
  };
}

module.exports = { verifyIdToken, clientId };
