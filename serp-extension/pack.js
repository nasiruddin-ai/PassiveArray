// Packs the extension into the zip you upload to the Chrome Web Store.
// Run:  node pack.js      (from this folder)
// Output: store/passive-array-serp-exporter-v<version>.zip
// Only runtime files go in. README, this script and the store folder stay out.
// The zip is written here in plain Node so entry names use forward slashes,
// which the Chrome Web Store requires (Windows' Compress-Archive uses backslashes).

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const HERE = __dirname;
const manifest = JSON.parse(fs.readFileSync(path.join(HERE, "manifest.json"), "utf8"));
const FILES = ["manifest.json", "background.js", "serp-extract.js", "meta-parse.js", "csv.js", "popup.html", "popup.js",
  "icons/icon-16.png", "icons/icon-48.png", "icons/icon-128.png", "icons/icon-192.png", "icons/mark.svg"];

for (const f of FILES) if (!fs.existsSync(path.join(HERE, f))) fail("Missing " + f + (f.endsWith("icon-128.png") ? "" : ""));
for (const size of Object.keys(manifest.icons || {})) {
  if (!fs.existsSync(path.join(HERE, manifest.icons[size]))) fail("manifest.json points at a missing icon: " + manifest.icons[size]);
}

/* ---- minimal ZIP writer (deflate, forward-slash names) ---- */
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(buf) { let c = 0xFFFFFFFF; for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function dosTime(d) { return ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1)) & 0xFFFF; }
function dosDate(d) { return (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xFFFF; }

function zip(entries) {
  const locals = [], centrals = [];
  let offset = 0;
  const now = new Date();
  for (const { name, data } of entries) {
    const nameBuf = Buffer.from(name, "utf8");
    const deflated = zlib.deflateRawSync(data, { level: 9 });
    const useDeflate = deflated.length < data.length;
    const body = useDeflate ? deflated : data;
    const method = useDeflate ? 8 : 0;
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x0800, 6); local.writeUInt16LE(method, 8);
    local.writeUInt16LE(dosTime(now), 10); local.writeUInt16LE(dosDate(now), 12); local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18); local.writeUInt32LE(data.length, 22); local.writeUInt16LE(nameBuf.length, 26); local.writeUInt16LE(0, 28);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6); central.writeUInt16LE(0x0800, 8); central.writeUInt16LE(method, 10);
    central.writeUInt16LE(dosTime(now), 12); central.writeUInt16LE(dosDate(now), 14); central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(body.length, 20); central.writeUInt32LE(data.length, 24); central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt16LE(0, 30); central.writeUInt16LE(0, 32); central.writeUInt16LE(0, 34); central.writeUInt16LE(0, 36); central.writeUInt32LE(0, 38); central.writeUInt32LE(offset, 42);
    locals.push(local, nameBuf, body);
    centrals.push(central, nameBuf);
    offset += local.length + nameBuf.length + body.length;
  }
  const centralSize = centrals.reduce((a, b) => a + b.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(0, 4); end.writeUInt16LE(0, 6); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralSize, 12); end.writeUInt32LE(offset, 16); end.writeUInt16LE(0, 20);
  return Buffer.concat([...locals, ...centrals, end]);
}

const outDir = path.join(HERE, "store");
fs.mkdirSync(outDir, { recursive: true });
const zipPath = path.join(outDir, "passive-array-serp-exporter-v" + manifest.version + ".zip");
fs.writeFileSync(zipPath, zip(FILES.map((f) => ({ name: f, data: fs.readFileSync(path.join(HERE, f)) }))));

const kb = Math.round(fs.statSync(zipPath).size / 1024);
console.log("Packed v" + manifest.version + " (" + FILES.length + " files) -> " + path.relative(HERE, zipPath) + " (" + kb + " KB)");
console.log("Upload this file at https://chrome.google.com/webstore/devconsole");

function fail(msg) {
  console.error("Cannot pack: " + msg);
  process.exit(1);
}
