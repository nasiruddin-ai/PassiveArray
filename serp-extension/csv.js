// Turns an export job into CSV (for files) or TSV (for pasting into Google Sheets / Excel).
// Shared by background.js (auto-download) and popup.js (download / copy buttons).

const BASE_COLS = [
  ["Position", (r) => r.position],
  ["Page", (r) => r.page],
  ["Site Name", (r) => r.site],
  ["Google Title", (r) => r.title],
  ["URL", (r) => r.url],
  ["Domain", (r) => r.domain],
  ["Displayed URL", (r) => r.displayedUrl],
  ["Google Snippet", (r) => r.snippet],
  ["Date Shown", (r) => r.date],
];
const META_COLS = [
  ["Real Title", (r) => r.meta && r.meta.title],
  ["Title Length", (r) => r.meta && r.meta.title ? [...r.meta.title].length : ""],
  ["Title vs Google", (r) => r.meta && r.meta.titleStatus],
  ["Meta Description", (r) => r.meta && r.meta.description],
  ["Description Length", (r) => r.meta && r.meta.description ? [...r.meta.description].length : ""],
  ["H1", (r) => r.meta && r.meta.h1],
  ["Canonical", (r) => r.meta && r.meta.canonical],
  ["Final URL", (r) => r.meta && r.meta.finalUrl],
  ["Robots", (r) => r.meta && r.meta.robots],
  ["Fetch Status", (r) => r.meta && r.meta.status],
];
const TAIL_COLS = [
  ["Keyword", (r, job) => job.query],
  ["Google Domain", (r, job) => job.host],
  ["Exported At", (r, job) => job.finishedAt || job.startedAt],
];

function exportColumns(job) {
  return [...BASE_COLS, ...(job.fetchMeta ? META_COLS : []), ...TAIL_COLS];
}

function toRows(job) {
  const cols = exportColumns(job);
  return [cols.map((c) => c[0]), ...(job.results || []).map((r) => cols.map((c) => { const v = c[1](r, job); return v == null ? "" : String(v); }))];
}

function toCsv(job) {
  const esc = (v) => (/[",\r\n]/.test(v) || /^[=+\-@]/.test(v) ? '"' + (/^[=+\-@]/.test(v) ? "'" : "") + v.replace(/"/g, '""') + '"' : v);
  // BOM so Excel opens non-English text (Bangla, accents) correctly.
  return "﻿" + toRows(job).map((row) => row.map(esc).join(",")).join("\r\n") + "\r\n";
}

function toTsv(job) {
  return toRows(job).map((row) => row.map((v) => v.replace(/[\t\r\n]+/g, " ").replace(/^[=+\-@]/, "'$&")).join("\t")).join("\n");
}

function exportFilename(job, ext) {
  const slug = (job.query || "serp").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "serp";
  const d = new Date(job.finishedAt || job.startedAt || Date.now());
  const stamp = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  return "serp-" + slug + "-" + stamp + "." + ext;
}

if (typeof module !== "undefined") module.exports = { toCsv, toTsv, toRows, exportFilename };
