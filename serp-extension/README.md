# Passive Array SERP Exporter

A Chrome extension that exports Google search results to CSV. Manifest V3, no build step.

## What it exports

| Column | Source |
|---|---|
| Position, Page | Order on the results page(s) |
| Site Name, Google Title, URL, Domain, Displayed URL | Google's result card |
| Google Snippet, Date Shown | Google's snippet ("Jan 7, 2026 — …" is split into date + text) |
| Real Title, Title Length, Meta Description, Description Length, H1, Canonical, Final URL, Robots | The page itself (only with **Fetch real meta tags** on) |
| Title vs Google | `Same`, `Truncated` (Google added "…"), `Shortened` (Google dropped the end, usually the brand), `Brand added`, `Rewritten` |
| Fetch Status | `OK`, `HTTP 404`, `Blocked (bot check)`, `Timed out`, `Could not connect`, `No tags found (page may need JavaScript)` |
| Keyword, Google Domain, Exported At | The search itself |

Ads, "People also ask", video/news carousels and Google's own pages are skipped. Duplicate URLs across pages are dropped.

## Install for testing (load unpacked)

1. Open `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and pick this `serp-extension` folder.
4. Pin the extension (puzzle icon in the toolbar → pin **Passive Array SERP Exporter**).
5. Search something on Google, click the icon, click **Export results**.

After editing any file, click the reload arrow on the extension's card in `chrome://extensions`, then reload the Google tab.

## How it works

- `serp-extract.js` — `extractSerp()` is injected into the Google tab. It finds results by structure (a link wrapping an `<h3>`) because Google renames its CSS classes often.
- `background.js` — runs the job so it survives the popup closing. For more than one page it loads `&start=10`, `&start=20`… in the same tab, waiting 2.5–4.5 s between pages. If Google shows a "not a robot" page it stops and keeps what it has.
- `meta-parse.js` — reads `<title>`, meta description, first `<h1>`, canonical and robots from the first 600 KB of each page. 4 pages at a time, 12 s timeout each.
- `csv.js` — CSV with a UTF-8 BOM (so Excel shows non-English text correctly) and TSV for pasting into Sheets. Cells starting with `= + - @` are prefixed with `'` so spreadsheets don't run them as formulas.

## Permissions

- `activeTab`, `scripting` — read the Google tab.
- Host access to the main Google domains (google.com, google.com.bd, google.co.uk and 37 others). Other Google domains ask once on first export.
- `https://*/*`, `http://*/*` — **optional**, asked only when the user turns on **Fetch real meta tags**.
- `downloads` — save the CSV. `storage` — remember options and the last export.

No data goes to Passive Array or anywhere else. Pages are fetched straight from the user's browser without cookies.

## Publish

`node pack.js` → `store/passive-array-serp-exporter-v<version>.zip`. Upload at https://chrome.google.com/webstore/devconsole. Bump `version` in `manifest.json` for every upload.

Store review note: the optional all-sites permission needs a justification in the privacy tab, e.g. "Only requested when the user turns on 'Fetch real meta tags'. Used to download each search result's HTML and read its title, meta description and H1 for the export. Nothing is stored remotely or sent to us."
