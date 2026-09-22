# Creator Tools

35 free tools for creators, brands and agencies, modelled on the free-tools
section of influencer platforms such as HypeAuditor. One folder, one shared
front end, one page per tool. Lives at `/creator-tools/` on the Passive Array
site and runs on your PC with `Start.bat`.

## What is in the pack

| Group | Tools | Data source |
|---|---|---|
| YouTube (9) | Subscriber count checker, engagement rate calculator, money calculator, sponsorship price calculator, channel comparison, channel quality checker, find influencers by niche, search influencers by location, lookalike finder | Live, YouTube Data API v3 |
| Twitch (2) | Follower count checker, channel comparison | Live, Twitch Helix API |
| Instagram (15) | Engagement rate calculator, engagement benchmark, follower to following ratio, likes to followers ratio, money calculator, pricing calculator, EMV calculator, fake follower estimator, account audit, account comparison, caption analyzer, hashtag generator, bio generator, content ideas generator, growth advisor | Numbers you type in (Instagram has no free public API) |
| TikTok (7) | Engagement rate calculator, likes to followers ratio, money calculator, pricing calculator, fake follower estimator, account audit, account comparison | Numbers you type in |
| X (2) | Follower to following ratio, account comparison | Numbers you type in |

Not built, on purpose: Instagram, TikTok and X follower-count lookups, lookalike
and "find influencers" for those platforms. They need a scraped database that
breaks the platforms' terms. HypeAuditor has one; we do not.

## Files

```
creator-tools/
  tools.js              The list of tools: name, inputs, description. Edit this to add or change a tool.
  build-tools.js        Turns tools.js into pages. Used by the root build.js and by server.js.
  template.html         The page template every tool uses.
  public/shared.css     Styles, matches the rest of the site.
  public/shared.js      All the calculations and the built-in generators. One function per tool slug.
  lib/youtube.js        YouTube Data API helper (used by server.js and the Netlify Function).
  lib/twitch.js         Twitch Helix API helper.
  server.js, Start.bat  Local server on http://localhost:3002/creator-tools/
  config.example.json   Copy to config.json and add keys for local use. config.json is ignored by git.
  .out/                 Generated pages for local use. Ignored by git.
netlify/functions/
  creator-youtube.mjs   -> /creator-tools/api/youtube
  creator-twitch.mjs    -> /creator-tools/api/twitch
  creator-ai.mjs        -> /creator-tools/api/ai (optional Claude upgrade for the generators)
```

## Running on your PC

1. Double-click `Start.bat`. A black window opens and stays open; your browser
   opens http://localhost:3002/creator-tools/ by itself after a second or two.
2. If the browser does not open, type that address into it yourself. The black
   window shows the exact address (it uses port 3003 or higher when 3002 is
   already taken by another tool).
3. Keep the black window open while you use the tools. Closing it stops the
   server, and "localhost" then shows nothing until you run Start.bat again.
4. Every calculator and generator works straight away. The YouTube and Twitch
   tools show "not set up" until you add keys (next section).

If the black window closes at once, Node.js is missing. Install it from
https://nodejs.org (the LTS button) and try again.

## Keys (all free)

### YouTube, 5 minutes

1. Go to https://console.cloud.google.com and pick or create a project.
2. Menu > APIs & Services > Library > search "YouTube Data API v3" > Enable.
3. APIs & Services > Credentials > Create credentials > API key. Copy it.
4. Click the key > Application restrictions: none. API restrictions: restrict to
   YouTube Data API v3. Save.
5. Locally: copy `config.example.json` to `config.json` and paste the key as
   `YOUTUBE_API_KEY`. On Netlify: Project configuration > Environment variables >
   add `YOUTUBE_API_KEY`. Redeploy.

The free quota is 10,000 units a day. A channel lookup costs 3 units, a niche
or location search costs about 102. Results are cached for 6 hours, so the
quota goes a long way. If you already use `GOOGLE_API_KEY` for the plagiarism
checker, enabling YouTube Data API v3 on that project lets this reuse it.

### Twitch, 5 minutes

1. Go to https://dev.twitch.tv/console and log in with a Twitch account.
2. Register Your Application. Name: anything. OAuth Redirect URL:
   `http://localhost`. Category: Analytics Tool.
3. Manage > copy the Client ID > New Secret > copy the Client Secret.
4. Add both as `TWITCH_CLIENT_ID` and `TWITCH_CLIENT_SECRET` in `config.json`
   (local) or Netlify environment variables (site).

### Claude for the generators, optional, paid

The hashtag, bio, content idea and growth advisor tools work with built-in
templates. To have Claude write them instead, add `ANTHROPIC_API_KEY` from
https://console.anthropic.com to the Netlify environment variables and
redeploy. The site uses the `@anthropic-ai/sdk` package listed in the root
`package.json`; Netlify installs it during the build. Each generation costs a
fraction of a cent. Without the key nothing breaks.

## Adding a tool

1. Add an entry to `tools.js` with a unique `slug`, `name`, `platform`,
   `short`, `intro`, `inputs` (or `compare`) and `how`.
2. Add `COMPUTE["your-slug"] = function (values, apiData) { ... }` in
   `public/shared.js`. Return `{ hero, rows, table, list, note }` and
   `render()` draws it.
3. Run `node build-tools.js` to check the page generates, then `node ../build.js`
   from the root to rebuild the site.

## How the estimates work

Every formula is stated on its tool page under "How it works". The main
assumptions:

- Instagram typical engagement by tier: 4.0% under 10K followers, 2.0% to
  100K, 1.4% to 500K, 1.1% to 1M, 0.8% above.
- Instagram sponsored post: $10 per 1,000 followers, adjusted 0.6x to 1.6x by
  engagement against the tier average, shown as a 30% band.
- YouTube creator RPM: $0.50 to $4.00 per 1,000 views by default, adjustable.
- YouTube sponsorship CPM brands pay: $20 to $50 per 1,000 views by default.
- TikTok Creator Rewards: $0.40 to $1.00 per 1,000 qualified views.
- EMV weights: impressions $6 per 1,000, like $0.10, comment $0.50, share
  $1.50, save $0.40, click $0.60.

These are typical 2025 to 2026 industry figures, not platform-published rates.
