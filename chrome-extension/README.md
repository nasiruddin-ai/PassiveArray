# Passive Array for YouTube (Chrome extension)

A vidIQ / TubeBuddy style extension, version 1.0.0, ready for the Chrome Web
Store. Video panel, channel panel, search-result scores, a keyword tool and an
AI writer in the popup. No login. The YouTube and Anthropic keys stay on the
Passive Array tools site, never inside the extension.

Landing page: https://passivearray.vercel.app/youtube-extension/
Privacy policy: https://passivearray.vercel.app/youtube-extension/privacy/
(both live once the passive-array repo is pushed)

## What it does

**Video pages** (no API call, reads the page itself)
- Engagement rate by views with the same grade scale as the creator-tools
  calculator (under 1% low, 1 to 2% below average, 2 to 4% average,
  4 to 6% good, above 6% excellent).
- Views, likes, comments, subscribers, views per day, publish date, length,
  category, title and description checks.
- The video's hidden tags as clickable chips, with Copy all.
- Live streams show "watching now" and no grade. Shorts and recorded streams
  are labelled. Unavailable videos show the reason.

**Channel pages** (one API call, cached 6 hours)
- Engagement rate over the last 10 uploads, subscribers, total views, videos,
  views per subscriber, last 30 days, Shorts share, created date, country,
  topics, channel keywords, and the 10 recent uploads with a "x avg" marker.

**Search results** (one API call per 50 results, cached 1 hour)
- Under every result: views per day, engagement rate grade, channel subs,
  views-to-subs ratio, tag count, LIVE and Short labels.
- "Small channel ranking" appears when a channel under 100K subs is ranking
  with more views than subscribers.

**Popup, Keywords tab** (no search quota: reads YouTube's own results page,
then one 2-unit stats call, cached 12 hours)
- Overall score out of 100 with a plain verdict, plus Interest and
  Competition scores. Estimates from the top 20 results, not real search
  volume, and the popup says so.
- Median views per day, median channel size, how many small channels rank,
  how many results are under a year old, how many beat their own subscriber
  count, typical length.
- "People also search" from YouTube autocomplete. Click a chip to analyze it.
- The top 20 results with channel, subs, age, views and views per day.
- On a YouTube search page the popup offers to analyze that search.

How the score works: Interest blends the median views per day of the top
results (log scale) with the number of results on YouTube. Competition
blends the median subscriber count, the share of channels over 1M, and how
stale the results are. Overall is a geometric mean weighted toward room to
rank, with a bonus when small channels already rank, and is capped at 45
when 70% or more of the results belong to 1M+ channels. Labels: 70+ great,
50 good, 30 fair, under 30 hard.

**Popup, AI writer tab**
- Titles (10, with character counts, over 60 flagged), Description (hook,
  what you learn, timestamps, links, hashtags) and Tags (under 500 chars).
- Written by Claude when `ANTHROPIC_API_KEY` is set on the tools site.
  Without it, built-in templates produce the same three outputs from your
  inputs, and the popup says which one you got. Neither invents facts.
- On a video page the popup offers to reuse that video's title and tags.

## Files

```
youtube-extension/
  manifest.json     Extension settings (Manifest V3). Version, permissions, icons, pages it runs on.
  content.js        Runs on youtube.com. Three modes: video, channel, search. Answers the popup's page question.
  background.js     Service worker. Tools-site API, autocomplete, keyword report, AI calls. Caches in chrome.storage.local.
  content.css       Styles, scoped under .pa-panel and .pa-badges. Follows YouTube's dark mode.
  popup.html/js     Keywords tab, AI writer tab, panel on/off switch. Remembers your inputs.
  icons/            16, 48, 128, 192 px PNG icons and the SVG mark.
  make-assets.js    Renders icon-128.png and the store promo tiles with the Chrome on this PC.
  pack.js           Builds store/passive-array-youtube-v<version>.zip for upload.
  STORE-LISTING.md  Everything to paste into the Chrome Web Store form, plus the screenshot list.
  store/            Generated: promo tiles and the zip. Not part of the extension itself.
```

Tools-site endpoints used (source in the passive-array repo):
- `GET /creator-tools/api/youtube` actions `channel` and `videos`
  (`api/creator-youtube.js`, `creator-tools/lib/youtube.js`).
- `POST /creator-tools/api/ai` actions `yt_titles`, `yt_description`,
  `yt_tags` (`api/creator-ai.js`).
- Landing and privacy pages: `youtube-extension/pages.js`, built by `build.js`.

## Load it in Chrome for testing (one minute)

1. Open Chrome and go to `chrome://extensions` (type it in the address bar).
2. Turn on **Developer mode** with the switch in the top right corner.
3. Click **Load unpacked** (top left) and choose this `youtube-extension` folder.
4. Open any YouTube video, channel, or search. Panels appear within a second
   or two. Click the extension icon for the popup.
5. After every code change, go back to `chrome://extensions` and click the
   round refresh arrow on the Passive Array card, then reload the YouTube tab.

Works the same in Edge and Brave (`edge://extensions`, `brave://extensions`).

## Publish to the Chrome Web Store

1. Push the passive-array repo so the privacy policy URL is live.
2. `node make-assets.js` then `node pack.js` in this folder.
3. Take the screenshots listed in `STORE-LISTING.md`.
4. Go to https://chrome.google.com/webstore/devconsole, pay the one-time $5
   fee, click New item, upload `store/passive-array-youtube-v1.0.0.zip`, and
   paste the text from `STORE-LISTING.md` into each tab.
5. Submit for review. 1 to 3 days. Then paste the store link into
   `STORE_URL` in the passive-array repo's `youtube-extension/pages.js`.

For every later upload, raise `version` in `manifest.json` first.

## Keys on the tools site (Vercel project settings, Environment Variables)

- `YOUTUBE_API_KEY`: already set. Free, 10,000 units a day. A channel panel
  costs about 3 units, a search page 2, a keyword report 2.
- `ANTHROPIC_API_KEY`: optional. Turns the AI writer from templates into
  Claude-written text. Paid per use, a few cents per generation.

## Known limits

- Likes and comments on a video page sometimes load a few seconds after the
  panel. It re-checks for 20 seconds. Press Refresh if not.
- YouTube changes its page structure often. If a panel disappears, the
  selectors in `content.js` (`videoMount`, `channelMount`, `resultVideoId`)
  are the first place to look.
- The keyword tool reads YouTube's results page through the browser. In
  countries with a cookie consent wall it may need you to open youtube.com
  once first.
- Shorts pages (`/shorts/...`) get no panel yet.
