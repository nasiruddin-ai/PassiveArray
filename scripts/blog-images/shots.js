// Captures the result panel of a live Passive Array tool for covers and figures.
//   NODE_PATH=<dir with puppeteer-core> node scripts/blog-images/shots.js <name> <tool-slug> '<json of selector: value>' [click-selector] [--hide-dollars]
// Example: ... shots.js yt-keywords youtube-keyword-generator '{"#keyword":"youtube seo"}'
// Text inputs are typed, <select> values are chosen, checkboxes with value true are ticked.
// Writes scripts/blog-images/shots/<name>.png (2x scale).
const puppeteer = require("puppeteer-core"), path = require("path"), fs = require("fs");
const args = process.argv.slice(2).filter((a) => a !== "--hide-dollars");
const hideDollars = process.argv.includes("--hide-dollars");
const [name, tool, fillJson = "{}", button = "#go"] = args;
if (!name || !tool) { console.error("usage: shots.js <name> <tool-slug> '<json>' [button]"); process.exit(1); }
const OUT = path.join(__dirname, "shots"); fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
  const p = await b.newPage();
  await p.setViewport({ width: 1100, height: 900, deviceScaleFactor: 2 });
  await p.goto(`https://passivearray.com/creator-tools/${tool}/`, { waitUntil: "networkidle2" });
  await p.evaluate(() => [...document.querySelectorAll("button")].find((x) => /no thanks/i.test(x.textContent))?.click());
  for (const [sel, v] of Object.entries(JSON.parse(fillJson))) {
    const tag = await p.$eval(sel, (e) => e.tagName + ":" + (e.type || ""));
    if (tag.startsWith("SELECT")) await p.select(sel, String(v));
    else if (/checkbox|radio/.test(tag)) { const on = await p.$eval(sel, (e) => e.checked); if (on !== !!v) await p.click(sel); }
    else { await p.click(sel, { clickCount: 3 }); await p.keyboard.press("Backspace"); await p.type(sel, String(v)); }
  }
  await p.click(button);
  await p.waitForFunction(() => { const r = document.querySelector("#results"); return r && r.innerText.length > 80; }, { timeout: 45000 });
  await wait(1500);
  // Some results show modelled dollar ranges a post does not state; hide them so the image adds no numbers.
  if (hideDollars) await p.evaluate(() => {
    const w = document.createTreeWalker(document.querySelector("#results"), NodeFilter.SHOW_TEXT);
    for (let n; (n = w.nextNode());) if (/\$\d/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/\$[\d.,]+(\s*(to|-|–)\s*\$[\d.,]+)?/g, "").trim();
  });
  await (await p.$("#results")).screenshot({ path: path.join(OUT, name + ".png") });
  console.log("ok", path.join(OUT, name + ".png"));
  await b.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
