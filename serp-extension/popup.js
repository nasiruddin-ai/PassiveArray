// Popup: pick options, start the export in background.js, show progress and the last export.

const ALL_SITES = ["https://*/*", "http://*/*"];
const DEFAULTS = { pages: "1", fetchMeta: false, autoDownload: true };
const $ = (id) => document.getElementById(id);

let tab = null;
let job = null;

init();

async function init() {
  const settings = await chrome.storage.sync.get(DEFAULTS);
  $("pages").value = settings.pages;
  $("autoDownload").checked = settings.autoDownload;
  $("fetchMeta").checked = settings.fetchMeta && (await chrome.permissions.contains({ origins: ALL_SITES }));

  [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  job = (await chrome.storage.local.get("job")).job || null;

  // A job saved as "running" with no worker behind it was interrupted.
  if (job && job.status === "running") {
    const res = await chrome.runtime.sendMessage({ type: "ping" }).catch(() => null);
    if (!res || !res.running) { job.status = "partial"; job.error = "The export was interrupted."; }
  }
  render();

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.job) { job = changes.job.newValue; render(); }
  });
}

function googleSearch() {
  if (!tab || !tab.url) return null;
  let u;
  try { u = new URL(tab.url); } catch (e) { return null; }
  if (!/^(www\.)?google\.[a-z.]+$/i.test(u.hostname) || u.pathname !== "/search" || !u.searchParams.get("q")) return null;
  return u;
}

function render() {
  const g = googleSearch();
  const isRunning = job && job.status === "running";
  $("running").hidden = !isRunning;
  $("setup").hidden = isRunning || !g;
  $("not-google").hidden = isRunning || !!g;
  $("done").hidden = isRunning || !job || !(job.results || []).length && !job.error;

  if (g) {
    $("q").textContent = g.searchParams.get("q");
    const start = parseInt(g.searchParams.get("start") || "0", 10) || 0;
    $("host").textContent = g.hostname + (start ? " · starting at page " + (start / 10 + 1) : "");
  }
  if (isRunning) renderProgress();
  else if (job) renderDone();
}

function renderProgress() {
  let pct, phase, count;
  if (job.phase === "meta") {
    phase = "Reading each page's meta tags";
    count = job.metaDone + " of " + job.metaTotal;
    pct = 50 + 50 * (job.metaDone / Math.max(1, job.metaTotal));
  } else {
    phase = "Reading Google page " + Math.min(job.pagesDone + 1, job.pagesWanted) + " of " + job.pagesWanted;
    count = job.results.length + " results";
    pct = (job.fetchMeta ? 50 : 100) * (job.pagesDone / Math.max(1, job.pagesWanted));
  }
  $("phase").textContent = phase;
  $("count").textContent = count;
  $("fill").style.width = Math.max(4, Math.round(pct)) + "%";
}

function renderDone() {
  const results = job.results || [];
  const note = $("done-note");
  const g = googleSearch();
  const sameQuery = g && g.searchParams.get("q") === job.query;
  if (job.error) { note.textContent = job.error; note.className = "hint bad"; }
  else { note.textContent = (sameQuery ? "Exported " : "Last export: “" + job.query + "”, ") + results.length + " results."; note.className = "hint good"; }

  $("s-results").textContent = results.length;
  $("s-domains").textContent = new Set(results.map((r) => r.domain)).size;
  const withTitle = results.filter((r) => r.meta && r.meta.title);
  if (job.fetchMeta && withTitle.length) {
    $("s-third-l").textContent = "Titles rewritten";
    $("s-third").textContent = withTitle.filter((r) => r.meta.titleStatus === "Rewritten").length + " / " + withTitle.length;
  } else {
    $("s-third-l").textContent = "Pages";
    $("s-third").textContent = job.pagesDone;
  }
  $("dl").disabled = $("copy").disabled = !results.length;

  $("preview-h").textContent = results.length ? "Top " + Math.min(10, results.length) + (results.length > 10 ? " of " + results.length : "") : "";
  const box = $("preview");
  box.textContent = "";
  for (const r of results.slice(0, 10)) {
    const a = document.createElement("a");
    a.className = "res";
    a.href = r.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.title = r.url;
    const rank = document.createElement("span");
    rank.className = "rank";
    rank.textContent = r.position;
    const body = document.createElement("div");
    body.style.minWidth = "0";
    const t = document.createElement("div");
    t.className = "t";
    t.textContent = r.title;
    const m = document.createElement("div");
    m.className = "m";
    m.textContent = r.site + " · " + r.domain;
    if (r.meta) {
      const s = r.meta.titleStatus;
      if (s) m.appendChild(tag(s === "Same" ? "Title same" : s === "Rewritten" ? "Title rewritten" : s, s === "Rewritten" ? "warn" : ""));
      if (r.meta.status && r.meta.status !== "OK") m.appendChild(tag(r.meta.status.replace(/ \(.*$/, ""), "bad"));
    }
    body.append(t, m);
    a.append(rank, body);
    box.appendChild(a);
  }
}

function tag(text, cls) {
  const s = document.createElement("span");
  s.className = "tag" + (cls ? " " + cls : "");
  s.textContent = text;
  return s;
}

/* ---- options ---- */
$("pages").addEventListener("change", () => chrome.storage.sync.set({ pages: $("pages").value }));
$("autoDownload").addEventListener("change", () => chrome.storage.sync.set({ autoDownload: $("autoDownload").checked }));
$("fetchMeta").addEventListener("change", () => {
  const box = $("fetchMeta");
  if (!box.checked) { chrome.storage.sync.set({ fetchMeta: false }); return; }
  // Saved first: on some systems Chrome closes the popup while its permission prompt is open.
  chrome.storage.sync.set({ fetchMeta: true });
  // Must be called straight from the click so Chrome shows its permission prompt.
  chrome.permissions.request({ origins: ALL_SITES }).then((ok) => {
    box.checked = ok;
    chrome.storage.sync.set({ fetchMeta: ok });
    showPermNote(ok ? "" : "Permission not given, so only Google's titles and snippets will be exported.");
  });
});

function showPermNote(text) {
  $("perm-note").textContent = text;
  $("perm-note").hidden = !text;
}

/* ---- start / stop ---- */
$("start").addEventListener("click", () => {
  const g = googleSearch();
  if (!g) return;
  const fetchMeta = $("fetchMeta").checked;
  const origins = [g.origin + "/*"].concat(fetchMeta ? ALL_SITES : []);
  // Google sites not listed in the manifest (e.g. google.lk) need a one-time yes; listed ones pass silently.
  chrome.permissions.request({ origins }).then(async (ok) => {
    if (!ok) { showPermNote("Chrome needs permission to read " + g.hostname + " to export from it."); return; }
    showPermNote("");
    $("start").disabled = true;
    const res = await chrome.runtime.sendMessage({
      type: "start", tabId: tab.id, pages: parseInt($("pages").value, 10) || 1,
      fetchMeta, autoDownload: $("autoDownload").checked,
    });
    $("start").disabled = false;
    if (!res || !res.ok) showPermNote((res && res.error) || "Could not start the export.");
  });
});

$("cancel").addEventListener("click", () => chrome.runtime.sendMessage({ type: "cancel" }));

/* ---- output ---- */
$("dl").addEventListener("click", () => {
  const url = URL.createObjectURL(new Blob([toCsv(job)], { type: "text/csv;charset=utf-8" }));
  chrome.downloads.download({ url, filename: exportFilename(job, "csv"), saveAs: false })
    .finally(() => setTimeout(() => URL.revokeObjectURL(url), 10000));
});

$("copy").addEventListener("click", async () => {
  await navigator.clipboard.writeText(toTsv(job));
  const b = $("copy");
  b.textContent = "Copied. Paste in Sheets";
  setTimeout(() => (b.textContent = "Copy for Sheets"), 1800);
});
