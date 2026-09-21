# Plagiarism Checker

A Duplichecker-style tool. Paste up to 1,000 words, upload a file, or pull text
from a URL. Every sentence is marked **Plagiarized** or **Unique**, with the
source it matched, plus overall percentages and a downloadable report.

## How to run it

1. Double-click **Start.bat**.
2. Your browser opens at `http://localhost:3100`.
3. Paste text and click **Check Plagiarism**, or use the **Compare two texts** tab.

Close the black window to stop it.

## Two modes

| Mode | Needs setup? | What it does |
|---|---|---|
| **Compare two texts** | No | Finds sentences from Text 1 that appear in Text 2. Works offline. |
| **Check against the web** | Yes, 5 minutes | Searches Google for each sentence and flags matches with the source link. |

## Setting up the web check (free)

Checking text against the whole internet needs a search engine. Google gives
100 searches per day free, which is roughly 2 to 3 full checks of 1,000 words.

1. Go to https://programmablesearchengine.google.com and click **Add**.
   Name it anything, choose **Search the entire web**, and create it.
   Copy the **Search engine ID** (looks like `a1b2c3d4e5f6g7h8i`).
2. Go to https://developers.google.com/custom-search/v1/overview and click
   **Get a Key**. Create or pick a project and copy the **API key**.
3. Open `config.json` in Notepad and fill in both values:

```json
{
  "googleApiKey": "PASTE-YOUR-API-KEY-HERE",
  "googleCx": "PASTE-YOUR-SEARCH-ENGINE-ID-HERE",
  "maxQueriesPerCheck": 40,
  "wordLimit": 1000,
  "port": 3100
}
```

4. Close the black window and double-click **Start.bat** again.
   The window should now say `Web check (Google search): ENABLED`.

### Settings you can change in config.json

- `maxQueriesPerCheck`: how many sentences are searched per check. Each one uses
  one Google query. 40 means about 2 checks per day on the free tier. Raise it
  if you pay for more quota.
- `wordLimit`: the maximum words allowed per check.
- `port`: change if 3100 is already used on your computer.

## What is in this folder

| File | What it does |
|---|---|
| `index.html` | The page. Change text, colours or layout here. |
| `server.js` | Splits text into sentences, runs the searches, compares texts, fetches URLs. |
| `config.json` | Your API key and settings. |
| `Start.bat` | Starts the tool. |

## How the web check works

Each sentence is trimmed to a 12-word phrase and searched as an exact match.
If a result's snippet contains that phrase (or most of it), the sentence is
marked plagiarized and the top result becomes its source. The percentage is
the share of checked words that were flagged. Sentences under 5 words are
skipped. A URL in the **Exclude** box is ignored as a source, which is useful
when checking your own published page.

## Limits

- Runs on your computer only. To put it online, host `server.js` on a Node.js
  host (Render, Railway, Fly.io, a VPS) and keep `config.json` private.
- Google's free tier is 100 searches per day. The tool shows a clear message
  when the quota runs out.
- Exact-phrase search catches copied text, not paraphrased text.
- Reading `.docx` and `.pdf` files needs an internet connection the first time,
  because two small helper libraries load from a CDN.
