// Submit Passive Array URLs to IndexNow (Bing, Yandex, Seznam, Naver share submissions).
//   node scripts/indexnow.js            every URL in the live sitemap
//   node scripts/indexnow.js changed    only URLs whose sitemap date is today
//   node scripts/indexnow.js /a/ /b/    specific paths
// The key file https://passivearray.com/<key>.txt must be live first (it is written by build.js).
const KEY = "e3928c4f16234a16a612080c80a35cd8";
const HOST = "passivearray.com";
const SITE = "https://" + HOST;

(async () => {
  const args = process.argv.slice(2);
  let urls;
  if (args.length && args[0] !== "changed") {
    urls = args.map((p) => (p.startsWith("http") ? p : SITE + p));
  } else {
    const xml = await (await fetch(SITE + "/sitemap.xml")).text();
    const entries = [...xml.matchAll(/<loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g)].map((m) => ({ loc: m[1], mod: m[2] }));
    const today = new Date().toISOString().slice(0, 10);
    urls = (args[0] === "changed" ? entries.filter((e) => e.mod === today) : entries).map((e) => e.loc);
  }
  if (!urls.length) return console.log("Nothing to submit.");
  const keyCheck = await fetch(SITE + "/" + KEY + ".txt");
  if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) throw new Error("Key file is not live at " + SITE + "/" + KEY + ".txt. Deploy first.");
  for (let i = 0; i < urls.length; i += 10000) {
    const batch = urls.slice(i, i + 10000);
    const r = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: SITE + "/" + KEY + ".txt", urlList: batch }),
    });
    const meaning = { 200: "OK, URLs accepted", 202: "Accepted, key validation pending", 400: "Bad request", 403: "Key not valid", 422: "URLs do not belong to the host or key mismatch", 429: "Too many requests" }[r.status] || "";
    console.log("Submitted " + batch.length + " URLs: HTTP " + r.status + " " + meaning);
    if (r.status >= 400) console.log(await r.text());
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
