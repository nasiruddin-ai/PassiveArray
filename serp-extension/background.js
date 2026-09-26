// Runs the export job so it keeps going after the popup closes.
//   1. Reads results from the Google tab, then steps through the next pages (&start=10, 20…)
//   2. Optionally fetches every result URL and reads its real title / meta description / H1
//   3. Saves the job to chrome.storage.local and downloads the CSV
// Nothing is sent to Passive Array or any other server; pages are fetched straight from this browser.

importScripts("serp-extract.js", "meta-parse.js", "csv.js");

const JOB_KEY = "job";
const MAX_BYTES = 600 * 1024;     // enough for <head> and the top of <body>
const FETCH_TIMEOUT = 12000;
const META_CONCURRENCY = 4;
const ALL_SITES = ["https://*/*", "http://*/*"];

let cancelled = false;
let running = false;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const save = (job) => chrome.storage.local.set({ [JOB_KEY]: job });

chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg.type === "start") {
    if (running) { reply({ ok: false, error: "An export is already running." }); return; }
    runJob(msg).catch((e) => console.error(e));
    reply({ ok: true });
  } else if (msg.type === "ping") {
    reply({ running });
  } else if (msg.type === "cancel") {
    cancelled = true;
    reply({ ok: true });
  }
});

// A job left "running" by a service worker that was shut down can never finish.
chrome.runtime.onStartup.addListener(markStale);
chrome.runtime.onInstalled.addListener(markStale);
async function markStale() {
  const { [JOB_KEY]: job } = await chrome.storage.local.get(JOB_KEY);
  if (job && job.status === "running") { job.status = "partial"; job.error = "The export was interrupted."; await save(job); }
}

async function runJob({ tabId, pages, fetchMeta, autoDownload }) {
  running = true;
  cancelled = false;
  const tab = await chrome.tabs.get(tabId);
  const firstUrl = new URL(tab.url);
  const job = {
    status: "running", phase: "serp", error: "",
    query: firstUrl.searchParams.get("q") || "", host: firstUrl.hostname,
    pagesWanted: pages, pagesDone: 0, fetchMeta: !!fetchMeta, metaDone: 0, metaTotal: 0,
    startedAt: new Date().toISOString(), finishedAt: "", results: [],
  };
  await save(job);

  try {
    const seen = new Set();
    const startAt = parseInt(firstUrl.searchParams.get("start") || "0", 10) || 0;
    for (let i = 0; i < pages; i++) {
      if (cancelled) break;
      if (i > 0) {
        const next = new URL(firstUrl);
        next.searchParams.set("start", String(startAt + i * 10));
        await sleep(2500 + Math.random() * 2000);   // be gentle with Google between pages
        if (cancelled) break;
        await loadInTab(tabId, next.toString());
      }
      const [inj] = await chrome.scripting.executeScript({ target: { tabId }, func: extractSerp });
      const page = inj && inj.result;
      if (!page) throw new Error("Could not read this page.");
      if (page.captcha) { job.error = "Google showed a \"not a robot\" check. Solve it in the tab, then export again. Results so far are saved."; break; }
      const pageNo = Math.floor(page.start / 10) + 1;
      for (const r of page.results) {
        if (seen.has(r.url)) continue;
        seen.add(r.url);
        let domain = "";
        try { domain = new URL(r.url).hostname.replace(/^www\./, ""); } catch (e) {}
        job.results.push({ position: job.results.length + 1, page: pageNo, domain, ...r });
      }
      job.pagesDone = i + 1;
      await save(job);
      if (!page.results.length || !page.hasNext) break;
    }

    if (job.fetchMeta && job.results.length && !cancelled) {
      if (!(await chrome.permissions.contains({ origins: ALL_SITES }))) {
        job.fetchMeta = false;
        job.error = "Real meta tags were skipped: the extension was not given permission to read websites.";
      } else {
        job.phase = "meta";
        job.metaTotal = job.results.length;
        await save(job);
        await pool(job.results, META_CONCURRENCY, async (r) => {
          if (cancelled) return;
          r.meta = await readPage(r.url);
          r.meta.titleStatus = compareTitles(r.title, r.meta.title);
          job.metaDone++;
          if (job.metaDone % 3 === 0 || job.metaDone === job.metaTotal) await save(job);
        });
      }
    }

    job.status = cancelled ? "partial" : job.error && !job.results.length ? "error" : job.error ? "partial" : "done";
    if (cancelled) job.error = "Stopped. Results so far are saved.";
  } catch (e) {
    job.status = job.results.length ? "partial" : "error";
    job.error = e && e.message ? e.message : String(e);
  }
  job.phase = "";
  job.finishedAt = new Date().toISOString();
  await save(job);
  running = false;

  if (autoDownload && job.results.length) {
    const url = "data:text/csv;charset=utf-8," + encodeURIComponent(toCsv(job));
    chrome.downloads.download({ url, filename: exportFilename(job, "csv"), saveAs: false }).catch(() => {});
  }
}

function loadInTab(tabId, url) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { chrome.tabs.onUpdated.removeListener(onUpd); reject(new Error("Google took too long to load the next page.")); }, 25000);
    function onUpd(id, info, t) {
      if (id !== tabId || info.status !== "complete" || !t.url || t.url === "about:blank") return;
      clearTimeout(timer);
      chrome.tabs.onUpdated.removeListener(onUpd);
      setTimeout(resolve, 700);   // let Google finish drawing results
    }
    chrome.tabs.onUpdated.addListener(onUpd);
    chrome.tabs.update(tabId, { url }).catch((e) => { clearTimeout(timer); chrome.tabs.onUpdated.removeListener(onUpd); reject(new Error("The Google tab was closed.")); });
  });
}

async function pool(items, size, fn) {
  let i = 0;
  const workers = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (i < items.length) await fn(items[i++]);
  });
  await Promise.all(workers);
}

async function readPage(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT);
  const empty = { title: "", description: "", h1: "", canonical: "", robots: "", finalUrl: "", status: "" };
  try {
    const res = await fetch(url, {
      signal: ctrl.signal, redirect: "follow", credentials: "omit", cache: "no-store",
      headers: { Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5" },
    });
    const finalUrl = res.url && res.url !== url ? res.url : "";
    const type = res.headers.get("content-type") || "";
    if (type && !/html|xml/i.test(type)) return { ...empty, finalUrl, status: "Not a web page (" + type.split(";")[0] + ")" };

    const bytes = await readCapped(res, MAX_BYTES);
    const html = new TextDecoder(sniffCharset(type, bytes)).decode(bytes);
    const meta = parseMeta(html);
    const botCheck = /just a moment|attention required|access denied|are you a robot|security check|captcha/i.test(meta.title);
    let status = "OK";
    if (botCheck || (res.status === 403 || res.status === 503) && /cloudflare|cf-ray/i.test(html.slice(0, 20000) + (res.headers.get("server") || ""))) status = "Blocked (bot check)";
    else if (!res.ok) status = "HTTP " + res.status;
    else if (!meta.title && !meta.description) status = "No tags found (page may need JavaScript)";
    if (status.startsWith("Blocked")) return { ...empty, finalUrl, status };
    return { title: meta.title, description: meta.description, h1: meta.h1, canonical: meta.canonical, robots: meta.robots, finalUrl, status };
  } catch (e) {
    return { ...empty, status: e.name === "AbortError" ? "Timed out" : "Could not connect" };
  } finally {
    clearTimeout(timer);
  }
}

async function readCapped(res, max) {
  if (!res.body) return new Uint8Array(await res.arrayBuffer()).subarray(0, max);
  const reader = res.body.getReader();
  const chunks = [];
  let total = 0;
  while (total < max) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.length;
  }
  reader.cancel().catch(() => {});
  const out = new Uint8Array(Math.min(total, max));
  let off = 0;
  for (const c of chunks) { const n = Math.min(c.length, out.length - off); out.set(c.subarray(0, n), off); off += n; if (off >= out.length) break; }
  return out;
}
