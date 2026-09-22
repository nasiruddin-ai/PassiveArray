// Renders the extension's PNG assets with the Chrome or Edge already on this PC:
//   icons/icon-128.png              required by the Chrome Web Store
//   store/promo-small-440x280.png   small promo tile (store listing)
//   store/marquee-1400x560.png      marquee promo tile (optional, for featuring)
// Run:  node make-assets.js      (from this folder)
// Screenshots (1280x800) cannot be generated here; take them in Chrome, see STORE-LISTING.md.

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const HERE = __dirname;
const BRAND = path.join(HERE, "..", "passive-array-brand");
const BROWSERS = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];
const browser = BROWSERS.find((b) => fs.existsSync(b));
if (!browser) {
  console.error("Chrome or Edge not found. Install one and run again.");
  process.exit(1);
}

const fileUrl = (p) => "file:///" + p.replace(/\\/g, "/");
const appIcon = fs.readFileSync(path.join(BRAND, "logo", "passive-array-app-icon.svg"), "utf8");
const markSvg = fs.readFileSync(path.join(HERE, "icons", "mark.svg"), "utf8");
const sized = (svg, w, h) => svg.replace(/width="[^"]+" height="[^"]+"/, `width="${w}" height="${h}"`);

const tmp = path.join(HERE, ".render");
fs.rmSync(tmp, { recursive: true, force: true });
fs.mkdirSync(tmp);

function page(bodyHtml, w, h, bg = "transparent") {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Poppins;src:url("${fileUrl(path.join(BRAND, "fonts", "Poppins-SemiBold.ttf"))}");font-weight:600}
@font-face{font-family:Poppins;src:url("${fileUrl(path.join(BRAND, "fonts", "Poppins-Medium.ttf"))}");font-weight:500}
html,body{margin:0;padding:0;width:${w}px;height:${h}px;background:${bg};overflow:hidden;font-family:Poppins,sans-serif}
body{display:flex;align-items:center;justify-content:center}svg{display:block}
</style></head><body>${bodyHtml}</body></html>`;
}

function render(name, html, w, h) {
  const htmlPath = path.join(tmp, name.replace(/[\\/]/g, "_") + ".html");
  fs.writeFileSync(htmlPath, html);
  const png = path.join(HERE, name);
  fs.mkdirSync(path.dirname(png), { recursive: true });
  execFileSync(browser, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--no-default-browser-check",
    "--default-background-color=00000000", `--window-size=${w},${h}`, `--screenshot=${png}`, fileUrl(htmlPath),
  ], { stdio: "ignore", timeout: 60000 });
  console.log((fs.existsSync(png) ? "ok      " : "FAILED  ") + name);
}

/* Promo tile: dark ink background, mark, name, one line of what it does, three mini stat tiles. */
function promo(w, h) {
  const s = w / 440; // scale everything from the small tile
  const px = (n) => Math.round(n * s) + "px";
  return `
<div style="box-sizing:border-box;width:${w}px;height:${h}px;padding:${px(26)} ${px(28)};background:linear-gradient(135deg,#1F2A44 0%,#243256 60%,#1F2A44 100%);color:#fff;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between">
  <div style="position:absolute;right:${px(-60)};top:${px(-60)};width:${px(260)};height:${px(260)};border-radius:50%;background:radial-gradient(circle,rgba(143,211,199,.22),transparent 65%)"></div>
  <div style="display:flex;align-items:center;gap:${px(10)};position:relative">
    ${sized(markSvg, Math.round(36 * s), Math.round(36 * s))}
    <div style="font-weight:600;font-size:${px(19)};letter-spacing:-.01em;white-space:nowrap">Passive <span style="color:#8FD3C7">Array</span> <span style="font-weight:500;opacity:.8">for YouTube</span></div>
  </div>
  <div style="position:relative">
    <div style="font-weight:600;font-size:${px(23)};line-height:1.15;letter-spacing:-.01em;white-space:nowrap">See what a video is really doing.</div>
    <div style="margin-top:${px(8)};font-weight:500;font-size:${px(11.5)};opacity:.82;max-width:${px(384)};line-height:1.4">Engagement rate, hidden tags, views per day, channel insights and a keyword score, right on YouTube. Free, no account.</div>
  </div>
  <div style="display:flex;gap:${px(8)};position:relative">
    ${[["4.8%", "Engagement · Good"], ["1.4K", "Views per day"], ["16 tags", "Hidden on the page"]].map(([v, l]) => `<div style="box-sizing:border-box;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);border-radius:${px(9)};padding:${px(7)} ${px(11)};flex:1;white-space:nowrap"><div style="font-weight:600;font-size:${px(16)}">${v}</div><div style="font-size:${px(9.5)};opacity:.75">${l}</div></div>`).join("")}
  </div>
</div>`;
}

render("icons/icon-128.png", page(sized(appIcon, 128, 128), 128, 128), 128, 128);
render("store/promo-small-440x280.png", page(promo(440, 280), 440, 280, "#1F2A44"), 440, 280);
render("store/marquee-1400x560.png", page(promo(1400, 560), 1400, 560, "#1F2A44"), 1400, 560);

fs.rmSync(tmp, { recursive: true, force: true });
console.log("Done. Screenshots still need to be taken by hand, see STORE-LISTING.md.");
