// User records and password handling.
//
// A record lives at  u:<email>  and looks like:
//   { email, created, verified, google, weekly, pw: { salt, hash, n, r, p } }
//
// Passwords are hashed with scrypt, which is memory-hard and built into Node,
// so there is no dependency to keep patched. The plain password is never
// stored, never logged and never leaves this module.

const crypto = require("crypto");
const store = require("./store.js");

// Deliberately slow. Raising N makes every guess more expensive for an
// attacker who ever gets hold of the records.
const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64, maxmem: 96 * 1024 * 1024 };

const MIN_PASSWORD = 10;
// Not a full list, just the handful that appear at the top of every breach
// dump. The length rule does most of the work.
const OBVIOUS = new Set([
  "password", "password1", "password123", "passw0rd", "letmein123",
  "12345678910", "1234567890", "qwertyuiop", "qwerty12345", "iloveyou123",
  "adminadmin", "welcome123", "abc123456", "passive array", "passivearray",
]);

function key(email) {
  return "u:" + String(email).trim().toLowerCase();
}

function scrypt(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p, maxmem: SCRYPT.maxmem }, (err, key) => {
      if (err) reject(err); else resolve(key);
    });
  });
}

/** Returns a complaint string, or null when the password is acceptable. */
function checkPassword(password, email) {
  const p = String(password || "");
  if (p.length < MIN_PASSWORD) return "Use at least " + MIN_PASSWORD + " characters.";
  if (p.length > 200) return "That password is too long.";
  const lower = p.toLowerCase();
  if (OBVIOUS.has(lower)) return "That password is one of the most guessed ones. Pick another.";
  if (email && lower.includes(String(email).toLowerCase().split("@")[0])) return "Do not put your email address in your password.";
  if (/^(.)\1+$/.test(p)) return "That is the same character repeated. Pick another.";
  return null;
}

async function makeHash(password) {
  const salt = crypto.randomBytes(16).toString("base64url");
  const hash = await scrypt(password, salt);
  return { salt, hash: hash.toString("base64url"), n: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p };
}

async function matches(password, pw) {
  if (!pw || !pw.salt || !pw.hash) return false;
  const expected = Buffer.from(pw.hash, "base64url");
  const given = await scrypt(password, pw.salt);
  if (given.length !== expected.length) return false;
  return crypto.timingSafeEqual(given, expected);
}

async function get(email) {
  return store.getJson(key(email));
}

async function save(user) {
  await store.setJson(key(user.email), user);
  return user;
}

function blank(email, extra) {
  return Object.assign({
    email: String(email).trim().toLowerCase(),
    created: new Date().toISOString().slice(0, 10),
    verified: false,
    google: false,
    weekly: true,
  }, extra || {});
}

/** Creates the record if it is missing, otherwise merges the flags in. */
async function upsert(email, extra) {
  const existing = await get(email);
  if (!existing) return save(blank(email, extra));
  return save(Object.assign(existing, extra || {}));
}

async function setPassword(email, password) {
  const user = (await get(email)) || blank(email);
  user.pw = await makeHash(password);
  return save(user);
}

/** True only when the record exists, has a password, and it matches. */
async function checkLogin(email, password) {
  const user = await get(email);
  if (!user || !user.pw) return null;
  const ok = await matches(password, user.pw);
  return ok ? user : null;
}

async function remove(email) {
  await store.del(key(email));
}

module.exports = {
  MIN_PASSWORD, checkPassword, get, save, upsert, setPassword, checkLogin, remove, blank,
};
