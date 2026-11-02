// Renders blog covers and figures from posts.js into blog/images/<slug>/.
//   cover.webp (page hero) + cover.jpg (share preview), 1200x630
//   <figure>.webp, 1200 wide, for ![alt](file.webp "caption") lines in the post
// Tool screenshots are captured first with shots.js into scripts/blog-images/shots/.
//   NODE_PATH=<dir with puppeteer-core> node scripts/blog-images/make.js [slug ...]
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const HERE = __dirname;
const OUT = path.join(HERE, "..", "..", "blog", "images");
// posts.js holds the first posts; posts.d/<slug>.js holds one post each (module.exports = { cover, figures }).
const POSTS = { ...require("./posts.js") };
const PD = path.join(HERE, "posts.d");
if (fs.existsSync(PD)) for (const f of fs.readdirSync(PD).filter((f) => f.endsWith(".js"))) POSTS[f.replace(/\.js$/, "")] = require(path.join(PD, f));
const fileUrl = (p) => "file:///" + p.replace(/\\/g, "/");

(async () => {
  const only = process.argv.slice(2);
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--allow-file-access-from-files"] });
  const page = await browser.newPage();
  let renders = 0;
  const render = async (data, w, h) => {
    await page.setViewport({ width: w, height: h || 800, deviceScaleFactor: 1 });
    await page.goto(fileUrl(path.join(HERE, "template.html")) + "?n=" + (++renders) + "#" + encodeURIComponent(JSON.stringify(data)), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => Promise.all([...document.images].map((i) => i.complete || new Promise((r) => { i.onload = i.onerror = r; }))));
    return page.$(data.kind === "cover" ? "#cover" : "#figure");
  };

  for (const [slug, cfg] of Object.entries(POSTS)) {
    if (only.length && !only.includes(slug)) continue;
    const dir = path.join(OUT, slug);
    fs.mkdirSync(dir, { recursive: true });
    const shot = (f) => fileUrl(path.join(HERE, "shots", f));

    const c = cfg.cover;
    const v = { ...c.visual };
    if (v.type === "shot") v.src = shot(v.src);
    const el = await render({ kind: "cover", ...c, visual: v }, 1200, 630);
    await el.screenshot({ path: path.join(dir, "cover.webp"), type: "webp", quality: 82 });
    await el.screenshot({ path: path.join(dir, "cover.jpg"), type: "jpeg", quality: 84 });

    for (const f of cfg.figures || []) {
      const file = path.join(dir, f.file);
      if (f.type === "shot") {
        // A real tool screenshot, scaled to 1200 wide and cropped to the part that matters.
        await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 1 });
        await page.setContent(`<body style="margin:0;background:#0F1524"><img id="i" src="${shot(f.src)}" style="display:block;width:1200px"></body>`);
        await page.evaluate(() => new Promise((r) => { const i = document.getElementById("i"); i.complete ? r() : (i.onload = r); }));
        const full = await page.$eval("#i", (i) => i.getBoundingClientRect().height);
        await page.screenshot({ path: file, type: "webp", quality: 82, clip: { x: 0, y: 0, width: 1200, height: Math.round(Math.min(full, f.maxHeight || full)) } });
      } else {
        const fig = await render({ kind: "figure", ...f }, 1200, 800);
        await fig.screenshot({ path: file, type: "webp", quality: 85 });
      }
    }
    console.log("ok", slug, 1 + (cfg.figures || []).length, "images");
  }
  await browser.close();
})();
