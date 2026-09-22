# Chrome Web Store listing

Everything to paste into the developer console at
https://chrome.google.com/webstore/devconsole. One-time $5 registration fee on
first use. Review usually takes 1 to 3 days.

## Before you upload (checklist)

1. Push the passive-array repo so the privacy policy page is live:
   https://passivearray.vercel.app/youtube-extension/privacy/
2. In this folder run `node make-assets.js` (128 px icon and promo tiles).
3. Take 3 to 5 screenshots in Chrome at exactly 1280 x 800 (see below).
4. Run `node pack.js`. Upload `store/passive-array-youtube-v1.0.0.zip`.

## Store listing tab

**Name** (45 max)
Passive Array for YouTube

**Summary** (132 max)
Engagement rate, hidden tags, views per day, channel insights, search scores and a keyword tool, right on YouTube. Free.

**Description**

See what a YouTube video is really doing, without leaving the page.

Passive Array adds a calm stats panel to YouTube and a keyword tool to the toolbar. It is free, has no account, no ads and no upsell.

ON VIDEO PAGES
• Engagement rate with a plain grade (low to excellent)
• Views, likes, comments and subscribers, with likes and comments as a share of views
• Views per day since upload
• The video's hidden tags, one click to copy or search
• Title and description checks: length, hashtags, links

ON CHANNEL PAGES
• Engagement rate across the last 10 uploads
• Views per subscriber, uploads per month, Shorts share
• Last 30 days: uploads and views
• Channel keywords and the recent uploads that beat the channel's average

ON SEARCH RESULTS
• Under every result: views per day, engagement grade, channel size, views-to-subs ratio and tag count
• "Small channel ranking" flag when a channel under 100K subs is winning the keyword

KEYWORD TOOL (click the icon)
• Overall score out of 100 with a plain verdict, plus interest and competition
• People-also-search ideas from YouTube autocomplete
• The top 20 results with subs, age, views and views per day
• Scores are estimates from the top results, not made-up "search volume", and the tool says so

TITLE, DESCRIPTION AND TAG WRITER
• Ten title angles with character counts
• A description with timestamp and link placeholders
• A tag list that fits YouTube's 500-character limit
• Never invents facts. It only uses what you type.

HONEST BY DESIGN
Numbers come from the public data on the YouTube page and from the official YouTube Data API. The API key stays on our server, so nothing sensitive ships in the extension. Nothing is tracked, nothing is sold.

Works in Chrome, Edge and Brave. More free creator tools at passivearray.vercel.app.

**Category:** Productivity → Tools (or "Workflow & Planning" in the new taxonomy)
**Language:** English

**Store icon:** `icons/icon-128.png`
**Screenshots (1280 x 800, PNG, 1 to 5):** see next section
**Small promo tile (440 x 280):** `store/promo-small-440x280.png`
**Marquee promo tile (1400 x 560, optional):** `store/marquee-1400x560.png`

**Official URL / homepage:** https://passivearray.vercel.app/youtube-extension/
**Support URL:** https://passivearray.vercel.app/contact/

## Screenshots to take (do this in Chrome, 1280 x 800 each)

Set the Chrome window so the page area is 1280 x 800. Easiest way: open
DevTools (F12), click the device toolbar icon (Ctrl+Shift+M), type 1280 and
800 in the size boxes, then use the three-dot menu in that toolbar and pick
"Capture screenshot". Turn off the device toolbar afterwards.

1. A video page with the panel in the sidebar, light mode. Pick a video with a
   good engagement grade and 10+ tags.
2. The same in dark mode (YouTube settings → Appearance → Dark theme).
3. A search results page showing the badge rows, ideally with one "Small
   channel ranking" flag visible.
4. A channel page with the channel panel.
5. The popup open on the Keywords tab with a finished report.

Do not include personal account details in the frame. Log out or use a
guest window if your avatar shows.

## Privacy practices tab

**Single purpose description**
Shows public YouTube statistics (engagement rate, tags, views per day, channel insights, keyword scores) on YouTube pages and in a popup, to help creators judge videos, channels and topics.

**Permission justifications**

- `storage`: caches lookups on the user's device for up to 24 hours and remembers the on/off switch and the last keyword typed, so repeated views are instant and the free API quota lasts.
- `activeTab`: when the popup is opened, lets it read which YouTube page is open so it can offer to analyze that search or reuse that video's title. Only while the popup is open.
- Host permission `https://www.youtube.com/*`: the content script that draws the panels runs only on YouTube pages; the popup's keyword tool also reads YouTube's own results page to find the top videos.
- Host permission `https://passivearray.vercel.app/*`: our server, which calls the YouTube Data API with a server-side key and returns public statistics.
- Host permission `https://suggestqueries.google.com/*`: YouTube's autocomplete, for "people also search" keyword ideas.

**Remote code:** No, I am not using remote code. (All code is in the package. The extension only fetches JSON data.)

**Data usage, what the extension collects:** tick nothing except:
- "Website content" → the public statistics on the YouTube page the user is viewing (video ID, title, counts, tags). Used for the extension's core feature only.
- "User activity" → NOT collected. (Do not tick.)
- "Web history" → NOT collected. (Do not tick.)
- "Personally identifiable information", "Authentication", "Financial", "Health", "Location", "Personal communications" → NOT collected.

Certify all three statements: not sold to third parties, not used for purposes unrelated to the core function, not used for creditworthiness or lending.

**Privacy policy URL**
https://passivearray.vercel.app/youtube-extension/privacy/

## Distribution tab

- Visibility: Public
- Regions: all
- Free, no in-app purchases

## After it is approved

1. Copy the store link (it looks like https://chromewebstore.google.com/detail/...).
2. Paste it into `STORE_URL` in the passive-array repo, file `youtube-extension/pages.js`, and push. The landing page then shows an "Add to Chrome" button instead of the manual steps.
3. Add `homepage_url` in `manifest.json` if it is not there, bump the version, `node pack.js`, upload the new zip as an update.

## Versioning

- `manifest.json` → `version` must go up on every upload (1.0.0 → 1.0.1 → 1.1.0).
- Keep the popup footer's "v1.0" label roughly in sync (popup.html).
