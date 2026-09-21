// Generates the whole Passive Array brand kit.
//   node make-brand.js
//
// Writes:
//   logo/*.svg            vector logos (wordmark converted to outlines, no font needed)
//   favicon/*             favicon.svg, favicon.ico, PNG icons for browsers and phones
//   social/*.png          profile picture, link preview image, logo PNGs
//   brand-guide.html      colours, fonts, spacing and usage rules
//
// PNGs are rendered with the Chrome or Edge already installed on this PC.

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const opentype = require("opentype.js");

const HERE = __dirname;
const out = (p) => path.join(HERE, p);

/* ------------------------------------------------------------------ brand */
const C = {
  ink: "#1F2A44", // Deep Ink: text, dark backgrounds
  teal: "#2A9D8F", // Array Teal: primary brand colour
  deepTeal: "#1F7F73", // Deep Teal: buttons and links (passes contrast with white text)
  indigo: "#5B6ABF", // Soft Indigo: gradient end, secondary accents
  mint: "#8FD3C7", // Mint Glow: highlight, the active node
  cloud: "#F4F7F9", // Cloud: light background
  white: "#FFFFFF",
};
const NAME = "Passive Array";
const TAGLINE = "Free tools for creators and brands";

/* ------------------------------------------------------------------ the mark */
// A 3x3 array of rounded tiles. Eight tiles carry a calm teal-to-indigo gradient;
// the last tile is a circle in mint: the one active node in a passive array.
const TILE = 30, GAP = 8, PAD = 7;
const SIZE = PAD * 2 + TILE * 3 + GAP * 2; // 120

function markSvgInner(mode, idPrefix = "pa") {
  // mode: "color" | "ink" | "white"
  let defs = "";
  let fill = C.ink;
  if (mode === "white") fill = C.white;
  if (mode === "color") {
    defs = `<defs><linearGradient id="${idPrefix}-g" gradientUnits="userSpaceOnUse" x1="${PAD}" y1="${PAD}" x2="${SIZE - PAD}" y2="${SIZE - PAD}"><stop offset="0" stop-color="${C.teal}"/><stop offset="1" stop-color="${C.indigo}"/></linearGradient></defs>`;
    fill = `url(#${idPrefix}-g)`;
  }
  let tiles = "";
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const x = PAD + c * (TILE + GAP), y = PAD + r * (TILE + GAP);
      if (r === 2 && c === 2) {
        const nodeFill = mode === "color" ? C.mint : fill;
        tiles += `<circle cx="${x + TILE / 2}" cy="${y + TILE / 2}" r="${TILE / 2}" fill="${nodeFill}"/>`;
      } else {
        tiles += `<rect x="${x}" y="${y}" width="${TILE}" height="${TILE}" rx="7" fill="${fill}"/>`;
      }
    }
  }
  return { defs, body: tiles };
}

function markSvg(mode) {
  const m = markSvgInner(mode);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}" role="img" aria-label="${NAME} mark">${m.defs}${m.body}</svg>`;
}

// App icon: the mark on a dark rounded square, for favicons and profile pictures.
function badgeSvg(size = 512, bg = C.ink) {
  const m = markSvgInner("color", "badge");
  const scale = (size * 0.62) / SIZE; // mark takes 62% of the badge
  const off = (size - SIZE * scale) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="${NAME} icon">${m.defs}<rect width="${size}" height="${size}" rx="${size * 0.22}" fill="${bg}"/><g transform="translate(${off} ${off}) scale(${scale})">${m.body}</g></svg>`;
}

/* ------------------------------------------------------------------ the wordmark */
const fontBuf = fs.readFileSync(out("fonts/Poppins-SemiBold.ttf"));
const font = opentype.parse(fontBuf.buffer.slice(fontBuf.byteOffset, fontBuf.byteOffset + fontBuf.byteLength));

function textPath(text, x, y, size) {
  const p = font.getPath(text, x, y, size, { kerning: true, letterSpacing: -0.01 });
  return { d: p.toPathData(2), box: p.getBoundingBox(), advance: font.getAdvanceWidth(text, size, { kerning: true, letterSpacing: -0.01 }) };
}

function logoSvg({ layout, onDark }) {
  const inkColor = onDark ? C.white : C.ink;
  const accent = onDark ? C.mint : C.teal;
  const markMode = "color";
  const m = markSvgInner(markMode, layout + (onDark ? "d" : "l"));

  if (layout === "horizontal") {
    const markH = 64, scale = markH / SIZE;
    const fontSize = 44;
    const gap = 22;
    const first = textPath("Passive ", 0, 0, fontSize);
    const second = textPath("Array", first.advance, 0, fontSize);
    const textW = first.advance + second.advance;
    // Vertically centre the caps on the mark: cap height of Poppins is ~0.7em.
    const capH = fontSize * 0.7;
    const baseline = markH / 2 + capH / 2;
    const W = Math.ceil(markH + gap + textW), H = markH;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${NAME}">${m.defs}<g transform="scale(${scale})">${m.body}</g><g transform="translate(${markH + gap} ${baseline})"><path d="${first.d}" fill="${inkColor}"/><path d="${second.d}" fill="${accent}"/></g></svg>`;
  }
  // stacked
  const markH = 96, scale = markH / SIZE;
  const fontSize = 40;
  const first = textPath("Passive ", 0, 0, fontSize);
  const second = textPath("Array", first.advance, 0, fontSize);
  const textW = first.advance + second.advance;
  const W = Math.ceil(Math.max(textW, markH) + 16), H = markH + 24 + fontSize;
  const markX = (W - markH) / 2, textX = (W - textW) / 2, baseline = markH + 24 + fontSize * 0.72;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${NAME}">${m.defs}<g transform="translate(${markX} 0) scale(${scale})">${m.body}</g><g transform="translate(${textX} ${baseline})"><path d="${first.d}" fill="${inkColor}"/><path d="${second.d}" fill="${accent}"/></g></svg>`;
}

/* ------------------------------------------------------------------ write SVGs */
const svgs = {
  "logo/passive-array-logo-horizontal.svg": logoSvg({ layout: "horizontal", onDark: false }),
  "logo/passive-array-logo-horizontal-on-dark.svg": logoSvg({ layout: "horizontal", onDark: true }),
  "logo/passive-array-logo-stacked.svg": logoSvg({ layout: "stacked", onDark: false }),
  "logo/passive-array-logo-stacked-on-dark.svg": logoSvg({ layout: "stacked", onDark: true }),
  "logo/passive-array-mark.svg": markSvg("color"),
  "logo/passive-array-mark-ink.svg": markSvg("ink"),
  "logo/passive-array-mark-white.svg": markSvg("white"),
  "logo/passive-array-app-icon.svg": badgeSvg(512),
  "favicon/favicon.svg": badgeSvg(64),
};
for (const [file, svg] of Object.entries(svgs)) {
  fs.mkdirSync(path.dirname(out(file)), { recursive: true });
  fs.writeFileSync(out(file), svg);
}

/* ------------------------------------------------------------------ PNG rendering via Chrome/Edge */
const BROWSERS = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];
const browser = BROWSERS.find((b) => fs.existsSync(b));

const fontUrl = (f) => "file:///" + out("fonts/" + f).replace(/\\/g, "/");
function page(bodyHtml, w, h, bg = "transparent") {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Poppins;src:url("${fontUrl("Poppins-SemiBold.ttf")}");font-weight:600}
@font-face{font-family:Poppins;src:url("${fontUrl("Poppins-Medium.ttf")}");font-weight:500}
html,body{margin:0;padding:0;width:${w}px;height:${h}px;background:${bg};overflow:hidden}body{display:flex;align-items:center;justify-content:center}svg{display:block}</style></head><body>${bodyHtml}</body></html>`;
}

const tmpDir = out(".render");
fs.rmSync(tmpDir, { recursive: true, force: true });
fs.mkdirSync(tmpDir);

function renderPng(name, html, w, h) {
  if (!browser) return false;
  const htmlPath = path.join(tmpDir, name.replace(/[\\/]/g, "_") + ".html");
  fs.writeFileSync(htmlPath, html);
  const png = out(name);
  fs.mkdirSync(path.dirname(png), { recursive: true });
  execFileSync(browser, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--no-default-browser-check",
    "--default-background-color=00000000", `--window-size=${w},${h}`, `--screenshot=${png}`, "file:///" + htmlPath.replace(/\\/g, "/"),
  ], { stdio: "ignore", timeout: 60000 });
  return fs.existsSync(png);
}

const sized = (svg, w, h) => svg.replace(/width="[^"]+" height="[^"]+"/, `width="${w}" height="${h}"`);

const renders = [];
// Favicons and app icons (transparent background, badge shape carries its own colour)
for (const s of [16, 32, 48, 180, 192, 512]) {
  const name = s === 180 ? "favicon/apple-touch-icon.png" : `favicon/icon-${s}.png`;
  renders.push([name, page(sized(badgeSvg(s), s, s), s, s), s, s]);
}
// Profile picture 1080 x 1080 (Instagram, X, LinkedIn, YouTube)
renders.push(["social/profile-1080.png", page(sized(badgeSvg(1080), 1080, 1080), 1080, 1080), 1080, 1080]);
// Logo PNGs at 2x for documents and slides
const hLight = svgs["logo/passive-array-logo-horizontal.svg"], hDark = svgs["logo/passive-array-logo-horizontal-on-dark.svg"];
const hW = Number(/viewBox="0 0 (\d+) (\d+)"/.exec(hLight)[1]), hH = Number(/viewBox="0 0 (\d+) (\d+)"/.exec(hLight)[2]);
renders.push(["social/logo-horizontal-2x.png", page(sized(hLight, hW * 4, hH * 4), hW * 4 + 160, hH * 4 + 160), hW * 4 + 160, hH * 4 + 160]);
renders.push(["social/logo-horizontal-on-dark-2x.png", page(sized(hDark, hW * 4, hH * 4), hW * 4 + 160, hH * 4 + 160, C.ink), hW * 4 + 160, hH * 4 + 160]);
// Link preview / Open Graph 1200 x 630
const og = `<div style="width:1200px;height:630px;background:linear-gradient(135deg,${C.cloud} 0%,#E6F3F1 100%);display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding:0 96px;box-sizing:border-box;font-family:Poppins,'Segoe UI',sans-serif;position:relative">
  ${sized(hLight, hW * 2.6, hH * 2.6)}
  <div style="margin-top:44px;font-size:40px;font-weight:500;color:${C.ink};letter-spacing:-0.01em">${TAGLINE}</div>
  <div style="margin-top:14px;font-size:26px;color:#5A6478">YouTube · Instagram · TikTok · Twitch · X</div>
  <div style="position:absolute;right:-60px;bottom:-60px;opacity:.14;transform:rotate(-8deg)">${sized(markSvg("color"), 520, 520)}</div>
</div>`;
renders.push(["social/og-image-1200x630.png", page(og, 1200, 630, C.cloud), 1200, 630]);
// Social cover 1500 x 500 (X header) and 1584 x 396 (LinkedIn) share one design centred
const cover = (w, h) => `<div style="width:${w}px;height:${h}px;background:${C.ink};display:flex;align-items:center;justify-content:center;gap:48px;font-family:Poppins,'Segoe UI',sans-serif">
  ${sized(hDark, hW * 2, hH * 2)}
  <div style="width:2px;height:${hH * 1.6}px;background:${C.indigo};opacity:.6"></div>
  <div style="font-size:34px;color:${C.mint};font-weight:500">${TAGLINE}</div>
</div>`;
renders.push(["social/cover-x-1500x500.png", page(cover(1500, 500), 1500, 500, C.ink), 1500, 500]);
renders.push(["social/cover-linkedin-1584x396.png", page(cover(1584, 396), 1584, 396, C.ink), 1584, 396]);

let rendered = 0;
for (const [name, html, w, h] of renders) if (renderPng(name, html, w, h)) rendered++;

/* ------------------------------------------------------------------ favicon.ico (PNG-in-ICO, all modern browsers) */
function writeIco(pngFiles, dest) {
  const pngs = pngFiles.map((f) => fs.readFileSync(out(f)));
  const sizes = [16, 32, 48];
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
  const dir = Buffer.alloc(16 * pngs.length);
  let offset = 6 + 16 * pngs.length;
  pngs.forEach((buf, i) => {
    const o = i * 16;
    dir.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], o); dir.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], o + 1);
    dir.writeUInt8(0, o + 2); dir.writeUInt8(0, o + 3); dir.writeUInt16LE(1, o + 4); dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(buf.length, o + 8); dir.writeUInt32LE(offset, o + 12);
    offset += buf.length;
  });
  fs.writeFileSync(out(dest), Buffer.concat([header, dir, ...pngs]));
}
if (rendered && fs.existsSync(out("favicon/icon-48.png"))) writeIco(["favicon/icon-16.png", "favicon/icon-32.png", "favicon/icon-48.png"], "favicon/favicon.ico");

fs.writeFileSync(out("favicon/site.webmanifest"), JSON.stringify({
  name: NAME, short_name: NAME, description: TAGLINE, start_url: "/", display: "standalone",
  background_color: C.cloud, theme_color: C.ink,
  icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/icon-512.png", sizes: "512x512", type: "image/png" }],
}, null, 2));

fs.writeFileSync(out("favicon/head-snippet.html"), `<!-- Paste inside <head>. Copy the favicon folder's files to the site root first. -->
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${C.ink}">
<meta property="og:image" content="/og-image-1200x630.png">
`);

/* ------------------------------------------------------------------ brand guide */
const swatch = (hex, name, use) => `<div class="sw"><div class="chip" style="background:${hex}"></div><b>${name}</b><code>${hex}</code><span>${use}</span></div>`;
const guide = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Passive Array Brand Guide</title>
<link rel="icon" href="favicon/favicon.svg">
<style>
@font-face{font-family:Poppins;src:url(fonts/Poppins-SemiBold.ttf);font-weight:600}
@font-face{font-family:Poppins;src:url(fonts/Poppins-Medium.ttf);font-weight:500}
:root{--ink:${C.ink};--teal:${C.teal};--deep:${C.deepTeal};--indigo:${C.indigo};--mint:${C.mint};--cloud:${C.cloud}}
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,"Segoe UI",sans-serif;color:var(--ink);background:#fff;line-height:1.55}
h1,h2,h3{font-family:Poppins,system-ui,sans-serif;font-weight:600;letter-spacing:-.01em}
.wrap{max-width:1000px;margin:0 auto;padding:40px 24px 80px}
h1{font-size:2.2rem;margin:0 0 6px}h2{font-size:1.4rem;margin:48px 0 14px;padding-top:24px;border-top:1px solid #E3E8EE}
.lead{color:#5A6478;max-width:700px}
.row{display:flex;gap:16px;flex-wrap:wrap}
.card{background:var(--cloud);border-radius:14px;padding:28px;flex:1 1 300px;display:flex;align-items:center;justify-content:center;min-height:180px}
.card.dark{background:var(--ink)}.card.white{background:#fff;border:1px solid #E3E8EE}
.card img{max-width:100%;max-height:140px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px}
.sw{background:#fff;border:1px solid #E3E8EE;border-radius:12px;padding:12px;font-size:.9rem}
.sw .chip{height:64px;border-radius:8px;margin-bottom:10px}.sw b{display:block}.sw code{display:block;color:#5A6478;margin:2px 0 6px}.sw span{color:#5A6478;font-size:.85rem}
.type p{margin:6px 0}.h1s{font-family:Poppins;font-weight:600;font-size:44px;line-height:1.1}.h2s{font-family:Poppins;font-weight:600;font-size:28px}.h3s{font-family:Poppins;font-weight:500;font-size:20px}
.btn{display:inline-block;background:var(--deep);color:#fff;padding:12px 22px;border-radius:10px;font-weight:600;text-decoration:none}
.btn.ghost{background:transparent;color:var(--deep);border:2px solid var(--deep)}
ul{padding-left:20px}li{margin-bottom:6px}
table{border-collapse:collapse;width:100%;font-size:.95rem}td,th{text-align:left;padding:8px 10px;border-bottom:1px solid #E3E8EE;vertical-align:top}th{color:#5A6478;font-weight:600}
.dont{color:#B42318}.do{color:${C.deepTeal}}
</style></head><body><div class="wrap">
<img src="logo/passive-array-logo-horizontal.svg" alt="Passive Array" style="height:56px">
<h1 style="margin-top:28px">Passive Array brand guide</h1>
<p class="lead">Passive Array is a set of free tools for creators and brands. The brand should feel calm, precise and trustworthy: a quiet grid that does the work while you get on with yours.</p>

<h2>The idea</h2>
<p>An <b>array</b> is a grid of things that work together. <b>Passive</b> means it runs quietly in the background. The mark is a 3 by 3 array of rounded tiles in a calm teal-to-indigo gradient, with one tile turned into a mint circle: the single active node inside a passive array. It reads as data, tools and a friendly dot of life, without shouting.</p>

<h2>Logo</h2>
<div class="row">
  <div class="card white"><img src="logo/passive-array-logo-horizontal.svg" alt="Horizontal logo on light"></div>
  <div class="card dark"><img src="logo/passive-array-logo-horizontal-on-dark.svg" alt="Horizontal logo on dark"></div>
</div>
<div class="row" style="margin-top:16px">
  <div class="card white"><img src="logo/passive-array-logo-stacked.svg" alt="Stacked logo" style="max-height:170px"></div>
  <div class="card"><img src="logo/passive-array-mark.svg" alt="Mark" style="max-height:120px"></div>
  <div class="card dark"><img src="logo/passive-array-mark-white.svg" alt="White mark" style="max-height:120px"></div>
  <div class="card white"><img src="logo/passive-array-app-icon.svg" alt="App icon" style="max-height:120px;border-radius:26px"></div>
</div>
<table style="margin-top:18px">
<tr><th>File</th><th>Use it for</th></tr>
<tr><td><code>logo/passive-array-logo-horizontal.svg</code></td><td>Website header, documents, email signatures on light backgrounds</td></tr>
<tr><td><code>logo/passive-array-logo-horizontal-on-dark.svg</code></td><td>The same on dark backgrounds (white text, mint accent)</td></tr>
<tr><td><code>logo/passive-array-logo-stacked.svg</code></td><td>Square spaces, footers, print</td></tr>
<tr><td><code>logo/passive-array-mark.svg</code></td><td>The mark alone when the name is already visible nearby</td></tr>
<tr><td><code>logo/passive-array-mark-ink.svg</code>, <code>-white.svg</code></td><td>Single colour situations: embossing, watermarks, tiny sizes</td></tr>
<tr><td><code>logo/passive-array-app-icon.svg</code>, <code>social/profile-1080.png</code></td><td>Profile pictures and app icons</td></tr>
</table>
<h3>Rules</h3>
<ul>
<li>Keep clear space around the logo equal to the height of one tile (about a quarter of the mark's height).</li>
<li>Minimum size: mark 24px tall on screen, horizontal logo 120px wide. Below that use the mark alone.</li>
<li>Do not stretch, rotate, add shadows or outlines, or recolour the tiles outside the palette.</li>
<li>Never place the colour logo on busy photos. Use the white or ink mark on a solid colour instead.</li>
<li>"Passive" is always ink (or white on dark). "Array" is always teal (or mint on dark). Do not swap them.</li>
</ul>

<h2>Colour</h2>
<p class="lead">Soft teal and indigo borrowed from the calmer end of social media, grounded by a deep ink. Eye-soothing on long sessions, still distinct next to red YouTube and pink Instagram buttons.</p>
<div class="grid">
${swatch(C.ink, "Deep Ink", "Headlines, body text, dark backgrounds")}
${swatch(C.teal, "Array Teal", "Brand colour, 'Array' in the wordmark, large headings, icons")}
${swatch(C.deepTeal, "Deep Teal", "Buttons, links, anything with white text (passes contrast)")}
${swatch(C.indigo, "Soft Indigo", "Gradient end, secondary accents, charts")}
${swatch(C.mint, "Mint Glow", "The active node, highlights on dark, success states")}
${swatch(C.cloud, "Cloud", "Page and card backgrounds")}
</div>
<h3>Contrast</h3>
<ul>
<li>Body text: Deep Ink on Cloud or white only.</li>
<li>White text goes on Deep Ink or Deep Teal, never on Array Teal or Mint.</li>
<li>Array Teal is for text 24px and larger, icons and decoration.</li>
<li>Gradient: Array Teal to Soft Indigo at 135 degrees. Use it in the mark and in hero shapes, not behind text.</li>
</ul>

<h2>Type</h2>
<div class="type">
<p class="h1s">Poppins SemiBold for headlines</p>
<p class="h2s">Poppins SemiBold for section titles</p>
<p class="h3s">Poppins Medium for labels and buttons</p>
<p>Inter Regular for body copy. It is the workhorse: readable at 16px, neutral, free on Google Fonts. Both fonts are free under the Open Font License and are included in <code>fonts/</code>.</p>
</div>
<p style="margin-top:14px"><a class="btn" href="#">Primary button</a> &nbsp; <a class="btn ghost" href="#">Secondary button</a></p>
<p>Google Fonts: <code>https://fonts.googleapis.com/css2?family=Poppins:wght@500;600&family=Inter:wght@400;500&display=swap</code></p>

<h2>Voice</h2>
<ul>
<li>Plain words, short sentences. Say what a tool does and what the number means.</li>
<li>Calm confidence, no hype. "Estimated" and "typical" are good words; "guaranteed" is not.</li>
<li>Talk to one person. "Paste a channel link" beats "Users can enter channel URLs".</li>
</ul>

<h2>Ready-made assets</h2>
<table>
<tr><th>File</th><th>Size</th><th>Where</th></tr>
<tr><td><code>social/profile-1080.png</code></td><td>1080 x 1080</td><td>Profile picture on every network</td></tr>
<tr><td><code>social/og-image-1200x630.png</code></td><td>1200 x 630</td><td>Link preview when the site is shared</td></tr>
<tr><td><code>social/cover-x-1500x500.png</code></td><td>1500 x 500</td><td>X header</td></tr>
<tr><td><code>social/cover-linkedin-1584x396.png</code></td><td>1584 x 396</td><td>LinkedIn page cover</td></tr>
<tr><td><code>social/logo-horizontal-2x.png</code>, <code>-on-dark-2x.png</code></td><td>Large</td><td>Slides, documents, partners who cannot use SVG</td></tr>
<tr><td><code>favicon/</code></td><td>16 to 512</td><td>Copy to the site root, paste <code>head-snippet.html</code> into the page head</td></tr>
</table>
<p style="color:#5A6478;margin-top:40px;font-size:.9rem">Regenerate everything with <code>node make-brand.js</code> in this folder. Edit colours or the tagline at the top of that file.</p>
</div></body></html>`;
fs.writeFileSync(out("brand-guide.html"), guide);

fs.rmSync(tmpDir, { recursive: true, force: true });
console.log(`Passive Array brand kit: ${Object.keys(svgs).length} SVG files, ${rendered}/${renders.length} PNG renders${browser ? "" : " (no Chrome or Edge found, PNGs skipped)"}, favicon.ico ${fs.existsSync(out("favicon/favicon.ico")) ? "written" : "skipped"}, brand-guide.html written.`);
