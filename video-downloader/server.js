// Video Downloader - tiny server with no npm dependencies.
// Run with:  node server.js   (or double-click Start.bat)
//
// What it does:
//   1. Serves index.html (the page you see in the browser)
//   2. On first run, downloads yt-dlp (the open-source engine that knows how to
//      read Facebook, Instagram, TikTok, YouTube, X, Pinterest, Reddit and 1000+ sites)
//   3. /api/info      -> looks up a URL and lists the qualities you can download
//   4. /api/download  -> starts a download job in the background
//   5. /api/progress  -> reports how far a job is
//   6. /api/file      -> sends the finished file to the browser
//
// Optional extras (see README.md):
//   - bin/ffmpeg.exe   lets you get 1080p+ on YouTube and convert audio to MP3
//   - cookies.txt      lets you download posts that need a logged-in account

const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const { spawn, spawnSync } = require("child_process");

const PORT = process.env.PORT || 3000;
const HTML_FILE = path.join(__dirname, "index.html");
const BIN_DIR = path.join(__dirname, "bin");
const COOKIES_FILE = path.join(__dirname, "cookies.txt");
const TMP_ROOT = path.join(os.tmpdir(), "video-downloader-jobs");
const IS_WIN = process.platform === "win32";

const YTDLP_NAME = IS_WIN ? "yt-dlp.exe" : "yt-dlp";
const YTDLP_URL =
  "https://github.com/yt-dlp/yt-dlp/releases/latest/download/" +
  (IS_WIN ? "yt-dlp.exe" : process.platform === "darwin" ? "yt-dlp_macos" : "yt-dlp");

const INFO_TIMEOUT_MS = 90 * 1000; // give up on a lookup after 90 seconds
const JOB_TIMEOUT_MS = 20 * 60 * 1000; // kill a download after 20 minutes
const JOB_MAX_AGE_MS = 30 * 60 * 1000; // delete finished files after 30 minutes

// ---------- finding the tools ----------

let ytdlpPath = null; // set once we know where yt-dlp lives
let ffmpegDir = null; // folder containing ffmpeg, or null if not installed

function whichSync(name) {
  const cmd = IS_WIN ? "where" : "which";
  const r = spawnSync(cmd, [name], { encoding: "utf8" });
  if (r.status !== 0 || !r.stdout) return null;
  const first = r.stdout.split(/\r?\n/).map((s) => s.trim()).find(Boolean);
  return first || null;
}

function findFfmpeg() {
  const local = path.join(BIN_DIR, IS_WIN ? "ffmpeg.exe" : "ffmpeg");
  if (fs.existsSync(local)) return BIN_DIR;
  const sys = whichSync("ffmpeg");
  if (sys) return path.dirname(sys);
  return null;
}

const FFMPEG_ZIP_URL = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip";

function findFilesNamed(dir, names, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) findFilesNamed(p, names, out);
    else if (names.includes(entry.name.toLowerCase())) out.push(p);
  }
  return out;
}

// On Windows, fetch ffmpeg automatically (needed for YouTube 1080p+ and MP3).
// Set SKIP_FFMPEG=1 to turn this off. On Linux/macOS install it with your package manager.
async function ensureFfmpeg() {
  const found = findFfmpeg();
  if (found) return found;
  if (!IS_WIN || process.env.SKIP_FFMPEG) return null;

  console.log("  ffmpeg is not installed yet. Downloading it (about 90 MB, one time only)...");
  const zip = path.join(os.tmpdir(), "video-downloader-ffmpeg.zip");
  const unpack = path.join(os.tmpdir(), "video-downloader-ffmpeg-unpack");
  try {
    fs.mkdirSync(BIN_DIR, { recursive: true });
    let lastPct = -1;
    await downloadFile(FFMPEG_ZIP_URL, zip, (got, total) => {
      if (!total) return;
      const pct = Math.floor((got / total) * 10) * 10;
      if (pct !== lastPct) {
        lastPct = pct;
        process.stdout.write(`  ${pct}% `);
      }
    });
    console.log("\n  Unpacking ffmpeg...");
    fs.rmSync(unpack, { recursive: true, force: true });
    fs.mkdirSync(unpack, { recursive: true });
    // Windows 10+ ships tar.exe, which can open zip files. Fall back to PowerShell if it is missing.
    let r = spawnSync("tar", ["-xf", zip, "-C", unpack], { windowsHide: true });
    if (r.status !== 0) {
      r = spawnSync("powershell", ["-NoProfile", "-Command", `Expand-Archive -Path '${zip}' -DestinationPath '${unpack}' -Force`], { windowsHide: true });
    }
    if (r.status !== 0) throw new Error("could not unzip the download");
    const exes = findFilesNamed(unpack, ["ffmpeg.exe", "ffprobe.exe"]);
    if (!exes.some((p) => p.toLowerCase().endsWith("ffmpeg.exe"))) throw new Error("ffmpeg.exe was not inside the zip");
    for (const p of exes) fs.copyFileSync(p, path.join(BIN_DIR, path.basename(p)));
    console.log("  ffmpeg installed to bin/");
    return BIN_DIR;
  } catch (err) {
    console.log("  Could not install ffmpeg automatically (" + err.message + ").");
    console.log("  The tool still works, but 1080p+ YouTube and MP3 are off. Run Get-FFmpeg.bat later to add them.");
    return null;
  } finally {
    fs.rmSync(zip, { force: true });
    fs.rmSync(unpack, { recursive: true, force: true });
  }
}

async function downloadFile(url, dest, onProgress) {
  const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": "VideoDownloader/1.0" } });
  if (!res.ok) throw new Error(`Download failed (${res.status}) for ${url}`);
  const total = Number(res.headers.get("content-length")) || 0;
  const tmp = dest + ".part";
  const out = fs.createWriteStream(tmp);
  let got = 0;
  const reader = res.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    got += value.length;
    out.write(Buffer.from(value));
    if (onProgress) onProgress(got, total);
  }
  await new Promise((resolve, reject) => out.end((e) => (e ? reject(e) : resolve())));
  fs.renameSync(tmp, dest);
}

async function ensureYtdlp() {
  if (process.env.YTDLP_PATH && fs.existsSync(process.env.YTDLP_PATH)) return process.env.YTDLP_PATH;

  const local = path.join(BIN_DIR, YTDLP_NAME);
  if (fs.existsSync(local)) return local;

  const sys = whichSync("yt-dlp");
  if (sys) return sys;

  console.log("  yt-dlp is not installed yet. Downloading it (about 18 MB, one time only)...");
  fs.mkdirSync(BIN_DIR, { recursive: true });
  let lastPct = -1;
  await downloadFile(YTDLP_URL, local, (got, total) => {
    if (!total) return;
    const pct = Math.floor((got / total) * 10) * 10;
    if (pct !== lastPct) {
      lastPct = pct;
      process.stdout.write(`  ${pct}% `);
    }
  });
  console.log("\n  yt-dlp downloaded to bin/" + YTDLP_NAME);
  if (!IS_WIN) fs.chmodSync(local, 0o755);
  return local;
}

// ---------- running yt-dlp ----------

function baseArgs() {
  const args = ["--no-warnings", "--no-check-certificates", "--no-playlist", "--windows-filenames"];
  if (ffmpegDir) args.push("--ffmpeg-location", ffmpegDir);
  if (fs.existsSync(COOKIES_FILE)) args.push("--cookies", COOKIES_FILE);
  return args;
}

function runYtdlp(args, { timeoutMs, onLine } = {}) {
  return new Promise((resolve) => {
    const child = spawn(ytdlpPath, args, { windowsHide: true });
    let stdout = "";
    let stderr = "";
    let killed = false;
    const timer = setTimeout(() => {
      killed = true;
      child.kill();
    }, timeoutMs || INFO_TIMEOUT_MS);

    let buf = "";
    child.stdout.on("data", (d) => {
      const s = d.toString();
      stdout += s;
      if (onLine) {
        buf += s;
        const lines = buf.split(/\r?\n/);
        buf = lines.pop();
        lines.forEach(onLine);
      }
    });
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({ code: -1, stdout, stderr: stderr + "\n" + err.message, killed });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (onLine && buf) onLine(buf);
      resolve({ code, stdout, stderr, killed });
    });
    return child;
  });
}

// Turn yt-dlp's error text into something a normal person can read.
function friendlyError(stderr, killed) {
  if (killed) return "The site took too long to respond. Please try again.";
  const s = String(stderr || "");
  const line = (s.match(/ERROR:\s*(.+)/) || [])[1] || s.trim().split("\n").pop() || "Unknown error";
  if (/login|log in|sign in|cookies|rate-limit|rate limit|429|not available to you/i.test(line))
    return "This site wants you to be logged in to see that post. Add a cookies.txt file next to server.js (see README.md) and try again.";
  if (/private|unavailable|not exist|404|removed|deleted|no video/i.test(line))
    return "That post is private, was removed, or the link is wrong. Double-check the URL.";
  if (/unsupported url/i.test(line)) return "This link is not from a supported site, or it points to a page rather than a video.";
  if (/ffmpeg/i.test(line)) return "This quality needs ffmpeg. Run Get-FFmpeg.bat once, restart the tool, and try again.";
  if (/There is no video in this post/i.test(line)) return "That post contains photos only. Only videos can be downloaded.";
  return line.replace(/^\[[^\]]+\]\s*/, "").slice(0, 300);
}

// ---------- building the quality list ----------

function humanSize(bytes) {
  if (!bytes || bytes <= 0) return null;
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return (i === 0 ? n : n.toFixed(n >= 10 ? 0 : 1)) + " " + units[i];
}

function heightLabel(f) {
  if (f.height) return f.height + "p";
  const note = String(f.format_note || f.format_id || "").toLowerCase();
  if (/\bhd\b|high|1080|720/.test(note)) return "HD";
  if (/\bsd\b|low|standard|360|480/.test(note)) return "SD";
  return f.format_note || f.format_id || "Video";
}

function buildOptions(entry) {
  const formats = (entry.formats || []).filter((f) => f && f.url && f.protocol !== "mhtml");
  const options = [];
  const seen = new Set();

  // 1. Formats that already contain video + audio in one file (no ffmpeg needed)
  const progressive = formats
    .filter((f) => f.vcodec && f.vcodec !== "none" && f.acodec && f.acodec !== "none")
    .sort((a, b) => (b.height || 0) - (a.height || 0) || (b.tbr || 0) - (a.tbr || 0));

  for (const f of progressive) {
    const key = "p:" + heightLabel(f) + ":" + (f.ext || "");
    if (seen.has(key)) continue;
    seen.add(key);
    options.push({
      id: f.format_id,
      label: heightLabel(f),
      ext: f.ext || "mp4",
      size: humanSize(f.filesize || f.filesize_approx),
      kind: "video",
      needsFfmpeg: false,
    });
  }

  // 2. Video-only formats (YouTube 1080p and up) - need ffmpeg to merge with audio
  const videoOnly = formats
    .filter((f) => f.vcodec && f.vcodec !== "none" && (!f.acodec || f.acodec === "none") && f.height)
    .sort((a, b) => (b.height || 0) - (a.height || 0) || (b.tbr || 0) - (a.tbr || 0));
  const hasAudioOnly = formats.some((f) => (!f.vcodec || f.vcodec === "none") && f.acodec && f.acodec !== "none");

  if (hasAudioOnly) {
    const progressiveHeights = new Set(progressive.map((f) => f.height).filter(Boolean));
    for (const f of videoOnly) {
      const key = "m:" + f.height;
      if (seen.has(key) || progressiveHeights.has(f.height)) continue;
      // prefer mp4/h264 streams so the result plays everywhere
      const isMp4 = (f.ext === "mp4" || /avc1|h264/.test(f.vcodec || ""));
      const better = videoOnly.find((g) => g.height === f.height && (g.ext === "mp4" || /avc1|h264/.test(g.vcodec || "")));
      const pick = isMp4 ? f : better || f;
      seen.add(key);
      options.push({
        id: `${pick.format_id}+bestaudio[ext=m4a]/${pick.format_id}+bestaudio`,
        label: f.height + "p",
        ext: "mp4",
        size: humanSize((pick.filesize || pick.filesize_approx || 0) + 0),
        kind: "video",
        needsFfmpeg: true,
      });
    }
  }

  // 3. Audio only
  if (hasAudioOnly) {
    const bestAudio = formats
      .filter((f) => (!f.vcodec || f.vcodec === "none") && f.acodec && f.acodec !== "none")
      .sort((a, b) => (b.abr || b.tbr || 0) - (a.abr || a.tbr || 0))[0];
    options.push({
      id: "bestaudio[ext=m4a]/bestaudio",
      label: "Audio only",
      ext: bestAudio && bestAudio.ext ? bestAudio.ext : "m4a",
      size: bestAudio ? humanSize(bestAudio.filesize || bestAudio.filesize_approx) : null,
      kind: "audio",
      needsFfmpeg: false,
    });
    options.push({
      id: "bestaudio/best",
      label: "MP3",
      ext: "mp3",
      size: null,
      kind: "mp3",
      needsFfmpeg: true,
    });
  } else if (progressive.length && ffmpegDir) {
    // Site only offers combined files - we can still extract MP3 with ffmpeg
    options.push({ id: "best", label: "MP3", ext: "mp3", size: null, kind: "mp3", needsFfmpeg: true });
  }

  // Sort videos by height (largest first), keep audio at the end
  const order = { video: 0, audio: 1, mp3: 2 };
  options.sort((a, b) => {
    if (order[a.kind] !== order[b.kind]) return order[a.kind] - order[b.kind];
    const ha = parseInt(a.label, 10) || 0;
    const hb = parseInt(b.label, 10) || 0;
    return hb - ha;
  });

  // If nothing matched (rare), fall back to "best"
  if (!options.some((o) => o.kind === "video")) {
    options.unshift({ id: "best", label: "Best available", ext: entry.ext || "mp4", size: null, kind: "video", needsFfmpeg: false });
  }

  return options.map((o) => ({ ...o, available: !o.needsFfmpeg || !!ffmpegDir }));
}

function summarizeEntry(entry, playlistIndex) {
  return {
    title: entry.title || entry.fulltitle || "Untitled",
    thumbnail: entry.thumbnail || (Array.isArray(entry.thumbnails) && entry.thumbnails.length ? entry.thumbnails[entry.thumbnails.length - 1].url : null),
    duration: entry.duration || null,
    uploader: entry.uploader || entry.channel || entry.uploader_id || null,
    site: entry.extractor_key || entry.extractor || null,
    url: entry.webpage_url || entry.original_url || null,
    playlistIndex: playlistIndex || null,
    options: buildOptions(entry),
  };
}

// ---------- API: info ----------

function sendJson(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(obj));
}

function cleanUrl(raw) {
  let s = String(raw || "").trim();
  const m = s.match(/https?:\/\/[^\s<>"']+/i);
  if (m) s = m[0];
  return s;
}

function isHttpUrl(s) {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (_) {
    return false;
  }
}

async function handleInfo(req, res, url) {
  const target = cleanUrl(url.searchParams.get("url"));
  if (!target) return sendJson(res, 400, { ok: false, error: "Please paste a link first." });
  if (!isHttpUrl(target)) return sendJson(res, 400, { ok: false, error: "That does not look like a link. It should start with http:// or https://" });

  // -J prints everything yt-dlp knows about the page as JSON, without downloading.
  // We drop --no-playlist here so Instagram carousels / multi-video posts show all their videos.
  const args = baseArgs().filter((a) => a !== "--no-playlist");
  args.push("-J", "--flat-playlist", "--playlist-items", "1:10", "--", target);

  const r = await runYtdlp(args, { timeoutMs: INFO_TIMEOUT_MS });
  if (r.code !== 0 || !r.stdout.trim()) {
    return sendJson(res, 422, { ok: false, error: friendlyError(r.stderr, r.killed) });
  }

  let data;
  try {
    data = JSON.parse(r.stdout);
  } catch (_) {
    return sendJson(res, 502, { ok: false, error: "The site returned something unexpected. Please try again." });
  }

  let items = [];
  if (data._type === "playlist" && Array.isArray(data.entries)) {
    const entries = data.entries.filter(Boolean);
    // --flat-playlist gives shallow entries without formats; fetch each one fully (max 10)
    for (let i = 0; i < entries.length && i < 10; i++) {
      const e = entries[i];
      if (Array.isArray(e.formats) && e.formats.length) {
        items.push(summarizeEntry(e, i + 1));
        continue;
      }
      const sub = await runYtdlp([...baseArgs(), "-J", "--", e.url || e.webpage_url || target], { timeoutMs: INFO_TIMEOUT_MS });
      if (sub.code === 0 && sub.stdout.trim()) {
        try {
          const full = JSON.parse(sub.stdout);
          items.push(summarizeEntry(full, null));
        } catch (_) {
          /* skip bad entry */
        }
      }
    }
    if (!items.length) return sendJson(res, 422, { ok: false, error: "No downloadable videos were found in that post." });
  } else {
    items = [summarizeEntry(data, null)];
  }

  sendJson(res, 200, {
    ok: true,
    input: target,
    ffmpeg: !!ffmpegDir,
    cookies: fs.existsSync(COOKIES_FILE),
    items,
  });
}

// ---------- API: download jobs ----------

const jobs = new Map();

function readBody(req) {
  return new Promise((resolve) => {
    let s = "";
    req.on("data", (d) => {
      s += d;
      if (s.length > 1e5) req.destroy();
    });
    req.on("end", () => resolve(s));
  });
}

const SAFE_FORMAT = /^[A-Za-z0-9+\-\[\]=/.,*<>!_ ]{1,200}$/;

async function handleStartDownload(req, res) {
  let body = {};
  try {
    body = JSON.parse((await readBody(req)) || "{}");
  } catch (_) {
    return sendJson(res, 400, { ok: false, error: "Bad request." });
  }

  const target = cleanUrl(body.url);
  const format = String(body.format || "best");
  const kind = body.kind === "mp3" ? "mp3" : body.kind === "audio" ? "audio" : "video";
  const playlistIndex = Number(body.playlistIndex) || null;

  if (!isHttpUrl(target)) return sendJson(res, 400, { ok: false, error: "Invalid link." });
  if (!SAFE_FORMAT.test(format) || format.startsWith("-")) return sendJson(res, 400, { ok: false, error: "Invalid format." });
  if (kind === "mp3" && !ffmpegDir) return sendJson(res, 400, { ok: false, error: "MP3 conversion needs ffmpeg. Run Get-FFmpeg.bat first." });

  const id = crypto.randomBytes(8).toString("hex");
  const dir = path.join(TMP_ROOT, id);
  fs.mkdirSync(dir, { recursive: true });

  const job = { id, status: "running", progress: 0, speed: null, eta: null, error: null, file: null, filename: null, createdAt: Date.now(), dir };
  jobs.set(id, job);

  const args = baseArgs();
  if (playlistIndex) {
    const i = args.indexOf("--no-playlist");
    if (i >= 0) args.splice(i, 1);
    args.push("--playlist-items", String(playlistIndex));
  }
  args.push("--newline", "--no-part", "-o", path.join(dir, "%(title).100B [%(id)s].%(ext)s"));
  if (kind === "mp3") {
    args.push("-f", format, "-x", "--audio-format", "mp3", "--audio-quality", "0");
  } else {
    args.push("-f", format);
    if (format.includes("+")) args.push("--merge-output-format", "mp4");
  }
  args.push("--", target);

  runYtdlp(args, {
    timeoutMs: JOB_TIMEOUT_MS,
    onLine: (line) => {
      const m = line.match(/\[download\]\s+([\d.]+)%(?:\s+of\s+~?\s*([\d.]+\w+))?(?:\s+at\s+([\d.]+\w+\/s))?(?:\s+ETA\s+([\d:]+))?/);
      if (m) {
        job.progress = parseFloat(m[1]);
        job.speed = m[3] || job.speed;
        job.eta = m[4] || job.eta;
      } else if (/\[Merger\]|\[ExtractAudio\]|\[ffmpeg\]/.test(line)) {
        job.progress = 100;
        job.status = "processing";
      }
    },
  }).then((r) => {
    if (r.code !== 0) {
      job.status = "error";
      job.error = friendlyError(r.stderr, r.killed);
      return;
    }
    // Find the finished file (ignore leftovers like .part or .ytdl)
    const files = fs
      .readdirSync(dir)
      .filter((f) => !/\.(part|ytdl|temp)$/i.test(f))
      .map((f) => ({ f, size: fs.statSync(path.join(dir, f)).size }))
      .sort((a, b) => b.size - a.size);
    if (!files.length) {
      job.status = "error";
      job.error = "The download finished but no file was produced.";
      return;
    }
    job.file = path.join(dir, files[0].f);
    job.filename = files[0].f;
    job.size = files[0].size;
    job.progress = 100;
    job.status = "done";
  });

  sendJson(res, 200, { ok: true, id });
}

function handleProgress(req, res, url) {
  const job = jobs.get(url.searchParams.get("id"));
  if (!job) return sendJson(res, 404, { ok: false, error: "Unknown download." });
  sendJson(res, 200, {
    ok: true,
    status: job.status,
    progress: job.progress,
    speed: job.speed,
    eta: job.eta,
    error: job.error,
    filename: job.filename,
    size: job.size ? humanSize(job.size) : null,
  });
}

function handleFile(req, res, url) {
  const job = jobs.get(url.searchParams.get("id"));
  if (!job || job.status !== "done" || !job.file) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    return res.end("File not ready.");
  }
  const stat = fs.statSync(job.file);
  const name = job.filename;
  const asciiName = name.replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "_");
  const ext = path.extname(name).toLowerCase();
  const type = { ".mp4": "video/mp4", ".webm": "video/webm", ".mkv": "video/x-matroska", ".mp3": "audio/mpeg", ".m4a": "audio/mp4", ".opus": "audio/ogg" }[ext] || "application/octet-stream";
  res.writeHead(200, {
    "Content-Type": type,
    "Content-Length": stat.size,
    "Content-Disposition": `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(name)}`,
    "Cache-Control": "no-store",
  });
  fs.createReadStream(job.file).pipe(res);
}

// Delete old jobs so the temp folder does not fill up
function cleanupJobs() {
  const now = Date.now();
  for (const [id, job] of jobs) {
    if (now - job.createdAt > JOB_MAX_AGE_MS) {
      fs.rm(job.dir, { recursive: true, force: true }, () => {});
      jobs.delete(id);
    }
  }
}
setInterval(cleanupJobs, 60 * 1000).unref();

// ---------- API: thumbnail proxy (some sites block images being shown on other pages) ----------

async function handleThumb(req, res, url) {
  const u = url.searchParams.get("u");
  if (!isHttpUrl(u)) {
    res.writeHead(400);
    return res.end();
  }
  try {
    const r = await fetch(u, { headers: { "User-Agent": "Mozilla/5.0" }, redirect: "follow" });
    if (!r.ok) throw new Error("bad status");
    res.writeHead(200, { "Content-Type": r.headers.get("content-type") || "image/jpeg", "Cache-Control": "public, max-age=3600" });
    res.end(Buffer.from(await r.arrayBuffer()));
  } catch (_) {
    res.writeHead(404);
    res.end();
  }
}

// ---------- API: update yt-dlp (sites change often; this fixes most "stopped working" cases) ----------

async function handleUpdate(req, res) {
  const r = await runYtdlp(["-U"], { timeoutMs: 120 * 1000 });
  const out = (r.stdout + "\n" + r.stderr).trim();
  const ok = r.code === 0;
  sendJson(res, ok ? 200 : 500, { ok, message: out.split("\n").filter(Boolean).slice(-2).join(" ") });
}

// ---------- server ----------

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  try {
    if (url.pathname === "/api/info") return await handleInfo(req, res, url);
    if (url.pathname === "/api/download" && req.method === "POST") return await handleStartDownload(req, res);
    if (url.pathname === "/api/progress") return handleProgress(req, res, url);
    if (url.pathname === "/api/file") return handleFile(req, res, url);
    if (url.pathname === "/api/thumb") return await handleThumb(req, res, url);
    if (url.pathname === "/api/update" && req.method === "POST") return await handleUpdate(req, res);
    if (url.pathname === "/api/status") return sendJson(res, 200, { ok: true, ffmpeg: !!ffmpegDir, cookies: fs.existsSync(COOKIES_FILE) });
  } catch (err) {
    return sendJson(res, 500, { ok: false, error: "Server error: " + (err && err.message ? err.message : "unknown") });
  }

  if (url.pathname === "/" || url.pathname === "/index.html") {
    fs.readFile(HTML_FILE, (err, buf) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("index.html is missing next to server.js");
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(buf);
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

(async () => {
  try {
    ytdlpPath = await ensureYtdlp();
  } catch (err) {
    console.error("");
    console.error("  Could not download yt-dlp: " + err.message);
    console.error("  Check your internet connection, or download yt-dlp.exe yourself from");
    console.error("  https://github.com/yt-dlp/yt-dlp/releases/latest and put it in the bin folder.");
    process.exit(1);
  }
  ffmpegDir = await ensureFfmpeg();
  fs.mkdirSync(TMP_ROOT, { recursive: true });

  server.listen(PORT, () => {
    console.log("");
    console.log("  Video Downloader is running.");
    console.log("  Open this in your browser:  http://localhost:" + PORT);
    console.log("  yt-dlp:  " + ytdlpPath);
    console.log("  ffmpeg:  " + (ffmpegDir ? ffmpegDir : "not found (run Get-FFmpeg.bat for 1080p+ and MP3)"));
    console.log("  cookies: " + (fs.existsSync(COOKIES_FILE) ? "cookies.txt loaded" : "none (only public posts will work)"));
    console.log("  Press Ctrl+C in this window to stop it.");
    console.log("");
  });
})();
