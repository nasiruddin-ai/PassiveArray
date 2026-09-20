# Social scheduler prototype

Sheet row in, social graphic and caption out. This folder holds the two pieces that decide whether the product works: the copywriting prompt and the first design template.

## Files

- `prompts/caption-system-prompt.md` - system prompt for the LLM node. Returns one strict JSON object per row.
- `prompts/example-input.json` - shape of the user message the node receives (brand kit, platform, template, row).
- `prompts/example-output*.json` - good responses for announcement, tip, quote, and carousel.
- `templates/announcement.html`, `tip.html`, `quote.html` - 1080x1080 single-image templates driven by `{{placeholders}}` and brand CSS variables.
- `templates/carousel.html` - inner carousel slide. The cover slide reuses `announcement.html` with the Swipe eyebrow.
- `fill-template.js` - merges brand kit and LLM output into templates. `fillPost()` returns one HTML string per image and is the body of the n8n Code node.
- `render-preview.ps1` - renders every HTML file in `out/` to PNG with headless Edge.
- `out/` - generated previews. Safe to delete.

## Local test

```powershell
node fill-template.js announcement prompts/example-output.json out
node fill-template.js tip prompts/example-output-tip.json out
node fill-template.js quote prompts/example-output-quote.json out
node fill-template.js carousel prompts/example-output-carousel.json out
.\render-preview.ps1
```

## Layout rules shared by every template

- Logo top left, handle top right, footer bottom right. Same positions on every image so a feed looks like one brand.
- Headline fixed size, clamped at two lines (four for quote, three for carousel slides). Overflow is cut, never shrunk, so the prompt limits matter.
- Text always sits on a calm surface. Decorative shapes stay behind and below 35 percent opacity.
- CTA pill bottom left. It hides itself when the LLM returns an empty cta, as it usually does for quotes.
- Carousel slides show a step pill, the slide number as a watermark, and a progress dot row.

## n8n Render workflow

`n8n/render-workflow.json` is ready to import. Regenerate it after editing the prompt, templates, or brand kit:

```powershell
node build-workflow.js        # embeds prompt + templates into n8n/render-workflow.json
node test-workflow-code.js    # runs both Code nodes outside n8n against the example copy
```

### Sheet setup

Create a Google Sheet with a tab named `Posts` and this header row:

```
id	title	context	platform	template	scheduled_at	image_url	caption	hashtags	alt_text	status	post_url	notes
```

Leave `status` blank or set it to `draft` for rows you want rendered. The workflow writes back `image_url`, `caption`, `hashtags`, `alt_text`, `notes`, and sets `status` to `rendered` or `needs_review`.

### After import

1. Open both Google Sheets nodes, pick your Google credential, and replace `YOUR_SHEET_ID` with the ID from the sheet URL.
2. On **Claude Write Copy**, create a Header Auth credential named `Anthropic API Key` with header name `x-api-key` and your key as the value. The node uses `claude-opus-5` with server-side fallbacks on, so a refused row routes to review instead of failing the run.
3. On **Render Image**, create a Basic Auth credential with your htmlcsstoimage.com user ID and API key. To use your own renderer instead, change the URL and the JSON body on that one node.
4. On **Notify Reviewer**, paste a Slack incoming webhook URL, or delete the node and connect **Write Back Row** straight back to **Loop Over Rows**.
5. Run once manually with two or three draft rows before enabling the schedule.

### What each node does

| Node | Role |
|---|---|
| Every 15 Minutes | Schedule trigger |
| Read Posts Sheet, Only Draft Rows | Pull rows and keep those with blank or draft status |
| Loop Over Rows | One row at a time, so carousel images from different posts never mix |
| Build LLM Request | Builds the Claude request with the embedded system prompt and brand kit |
| Claude Write Copy | Calls the Messages API |
| Parse and Validate Copy | Parses the JSON, enforces the text limits, fills the templates |
| Copy Valid? | Valid rows render, invalid rows go to Mark Needs Review with the reasons in notes |
| One Item Per Page, Render Image, Collect Image URLs | Render each page to PNG and gather the URLs |
| Write Back Row | Updates the sheet row and marks it rendered |
| Notify Reviewer | Posts image links and caption to Slack |

## Validation before rendering

The Code node should reject and re-run the LLM step when any of these fail, since the template clamps rather than shrinks text:

- `headline` over 8 words
- `body` over 90 characters
- `cta` over 4 words
- fewer than 3 hashtags
- `confidence` under 0.5 sends the row to review instead of rendering

## Still to build

- The Publish workflow: read `approved` rows past their `scheduled_at`, post per platform, write `post_url` and `posted`.
- The approve webhook so a reviewer can flip `status` from Slack.
- 1080x1350 portrait variants for Instagram feed.
- Light-background variants for brands with dark logos.
