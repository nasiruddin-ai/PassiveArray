// The list of every tool in the Creator Tools pack.
//
// build-tools.js turns each entry into a page at public/<slug>/index.html and
// public/shared.js does the maths in the browser (function named after the slug
// in COMPUTE). Tools with "api" also call a Netlify Function:
//   youtube -> netlify/functions/creator-youtube.mjs
//   twitch  -> netlify/functions/creator-twitch.mjs
//   ai      -> netlify/functions/creator-ai.mjs (optional upgrade, works without it)
//
// Input types: text, number, select, textarea.
// "compare" tools repeat the same fields for 2 or 3 accounts (prefix a_, b_, c_).

const IG_FIELDS = [
  { id: "followers", label: "Followers", type: "number", placeholder: "e.g. 25,000", min: 0 },
  { id: "following", label: "Following", type: "number", placeholder: "e.g. 800", min: 0 },
  { id: "posts", label: "Posts", type: "number", placeholder: "e.g. 340", min: 0 },
  { id: "likes", label: "Average likes per post", type: "number", placeholder: "e.g. 900", min: 0, hint: "Average of the last 12 posts" },
  { id: "comments", label: "Average comments per post", type: "number", placeholder: "e.g. 40", min: 0 },
];

const TT_FIELDS = [
  { id: "followers", label: "Followers", type: "number", placeholder: "e.g. 50,000", min: 0 },
  { id: "totalLikes", label: "Total likes", type: "number", placeholder: "e.g. 1,200,000", min: 0 },
  { id: "views", label: "Average views per video", type: "number", placeholder: "e.g. 30,000", min: 0, hint: "Average of the last 12 videos" },
  { id: "likes", label: "Average likes per video", type: "number", placeholder: "e.g. 2,500", min: 0 },
  { id: "comments", label: "Average comments per video", type: "number", placeholder: "e.g. 60", min: 0 },
  { id: "shares", label: "Average shares per video", type: "number", placeholder: "e.g. 90", min: 0 },
];

const COUNTRIES = [
  ["", "Any country"], ["US", "United States"], ["GB", "United Kingdom"], ["CA", "Canada"], ["AU", "Australia"],
  ["IN", "India"], ["PK", "Pakistan"], ["BD", "Bangladesh"], ["DE", "Germany"], ["FR", "France"], ["ES", "Spain"],
  ["IT", "Italy"], ["NL", "Netherlands"], ["BR", "Brazil"], ["MX", "Mexico"], ["AR", "Argentina"], ["JP", "Japan"],
  ["KR", "South Korea"], ["ID", "Indonesia"], ["PH", "Philippines"], ["VN", "Vietnam"], ["TH", "Thailand"],
  ["TR", "Turkey"], ["SA", "Saudi Arabia"], ["AE", "United Arab Emirates"], ["EG", "Egypt"], ["NG", "Nigeria"],
  ["ZA", "South Africa"], ["RU", "Russia"], ["UA", "Ukraine"], ["PL", "Poland"], ["SE", "Sweden"], ["NO", "Norway"],
  ["DK", "Denmark"], ["IE", "Ireland"], ["NZ", "New Zealand"], ["SG", "Singapore"], ["MY", "Malaysia"],
];

const NICHES = [
  "beauty", "fashion", "fitness", "food", "travel", "tech", "gaming", "business", "finance", "education",
  "parenting", "pets", "photography", "art", "music", "comedy", "lifestyle", "health", "real estate", "web design",
];

const TONES = [["friendly", "Friendly"], ["professional", "Professional"], ["bold", "Bold"], ["playful", "Playful"], ["minimal", "Minimal"]];

const tools = [
  // ------------------------------------------------------------------ YouTube (live data)
  {
    slug: "youtube-subscriber-count-checker",
    name: "YouTube Subscriber Count Checker",
    platform: "YouTube",
    api: "youtube",
    action: "channel",
    short: "Look up any channel's subscribers, views, uploads and average views per video.",
    intro: "Paste a channel link, @handle or name. You get the current subscriber count plus totals and averages taken from the channel's last 10 uploads.",
    inputs: [{ id: "channel", label: "Channel link, @handle or name", type: "text", placeholder: "Paste a link or @handle" }],
    how: [
      "Data comes straight from the YouTube Data API, so numbers match what YouTube shows publicly.",
      "Averages use the channel's 10 most recent uploads.",
      "YouTube rounds public subscriber counts, so the figure can lag the live count by a few hours.",
    ],
  },
  {
    slug: "youtube-engagement-rate-calculator",
    name: "YouTube Engagement Rate Calculator",
    platform: "YouTube",
    api: "youtube",
    action: "channel",
    short: "Engagement per view and per subscriber from the last 10 videos, with a benchmark.",
    intro: "Enter a channel and get its engagement rate two ways: likes plus comments divided by views, and divided by subscribers. Both use the last 10 uploads.",
    inputs: [{ id: "channel", label: "Channel link, @handle or name", type: "text", placeholder: "Paste a link or @handle" }],
    how: [
      "Engagement by view = (likes + comments) / views x 100. Above 3 percent is good, above 6 percent is excellent.",
      "Engagement by subscriber shows how much of the audience actually reacts. Around 1 to 3 percent is typical.",
      "Comments are weighted the same as likes, the common industry convention.",
    ],
  },
  {
    slug: "youtube-money-calculator",
    name: "YouTube Money Calculator",
    platform: "YouTube",
    api: "youtube",
    action: "channel",
    short: "Estimated monthly and yearly AdSense earnings for any channel, shown as a range.",
    intro: "Estimates how much a channel earns from ads. It looks at views on videos from the last 30 days and applies a revenue-per-thousand-views range you can adjust.",
    inputs: [
      { id: "channel", label: "Channel link, @handle or name", type: "text", placeholder: "Paste a link or @handle" },
      { id: "rpmLow", label: "Low RPM ($ per 1,000 views)", type: "number", value: 0.5, step: 0.05, min: 0, hint: "Music, kids and entertainment sit near the low end" },
      { id: "rpmHigh", label: "High RPM ($ per 1,000 views)", type: "number", value: 4, step: 0.05, min: 0, hint: "Finance, tech and business can exceed $10" },
    ],
    how: [
      "Monthly views = views on videos uploaded in the last 30 days. If nothing was uploaded, the average of the last 10 videos times upload frequency is used.",
      "Earnings = monthly views / 1,000 x RPM. RPM is what the creator keeps after YouTube's 45 percent share.",
      "This is an estimate from public data. It does not include sponsorships, memberships or Shorts revenue.",
    ],
  },
  {
    slug: "youtube-sponsorship-price-calculator",
    name: "YouTube Sponsorship Price Calculator",
    platform: "YouTube",
    api: "youtube",
    action: "channel",
    short: "What a channel should charge for an integration, a dedicated video or a Shorts mention.",
    intro: "Brands pay for views, not subscribers. This tool takes the channel's average views on recent uploads and applies the CPM ranges brands typically pay for YouTube placements.",
    inputs: [
      { id: "channel", label: "Channel link, @handle or name", type: "text", placeholder: "Paste a link or @handle" },
      { id: "cpmLow", label: "Low CPM brands pay ($ per 1,000 views)", type: "number", value: 20, min: 0 },
      { id: "cpmHigh", label: "High CPM brands pay ($ per 1,000 views)", type: "number", value: 50, min: 0 },
    ],
    how: [
      "60-second integration = average views x CPM. Dedicated video = 1.75x that. Shorts mention = 0.25x.",
      "Channels with engagement above 4 percent get a 20 percent uplift, below 1.5 percent a 20 percent discount.",
      "Use the range as a negotiation band, not a fixed rate. Niche and audience country move prices a lot.",
    ],
  },
  {
    slug: "youtube-channel-comparison",
    name: "Compare YouTube Channels",
    platform: "YouTube",
    api: "youtube",
    action: "compare",
    short: "Two or three channels side by side: subscribers, views, engagement, upload pace.",
    intro: "Enter two or three channels and see every key metric next to each other, with the leader marked on each row.",
    inputs: [
      { id: "a", label: "Channel A", type: "text", placeholder: "Paste a link or @handle" },
      { id: "b", label: "Channel B", type: "text", placeholder: "Paste a link or @handle" },
      { id: "c", label: "Channel C (optional)", type: "text", placeholder: "Paste a link or @handle", optional: true },
    ],
    how: [
      "Averages and engagement use each channel's last 10 uploads.",
      "Uploads per month is measured from the dates of those 10 videos.",
      "Views per subscriber shows how much of each audience actually watches new videos.",
    ],
  },
  {
    slug: "youtube-channel-quality-checker",
    name: "YouTube Channel Quality Checker",
    platform: "YouTube",
    api: "youtube",
    action: "channel",
    short: "A 0 to 100 quality score built from engagement, reach, consistency and audience size.",
    intro: "One score that tells a brand or a creator how healthy a channel is. The breakdown shows exactly where the points come from.",
    inputs: [{ id: "channel", label: "Channel link, @handle or name", type: "text", placeholder: "Paste a link or @handle" }],
    how: [
      "Engagement (35 points): likes plus comments per view on the last 10 uploads.",
      "Reach (25 points): average views divided by subscribers. 30 percent or more earns full marks.",
      "Consistency (20 points): uploads per month. Audience (20 points): subscriber count and channel age.",
    ],
  },
  {
    slug: "find-youtube-influencers-by-niche",
    name: "Find YouTube Influencers in Your Niche",
    platform: "YouTube",
    api: "youtube",
    action: "search",
    short: "Search channels by topic and filter by subscriber range and country.",
    intro: "Type a topic and get a list of matching channels with subscribers, total views and video count, filtered to the size and country you want.",
    inputs: [
      { id: "q", label: "Topic or keyword", type: "text", placeholder: "Type a topic, e.g. home workout" },
      { id: "minSubs", label: "Minimum subscribers", type: "number", value: 10000, min: 0 },
      { id: "maxSubs", label: "Maximum subscribers", type: "number", value: 1000000, min: 0 },
      { id: "country", label: "Country", type: "select", options: COUNTRIES },
    ],
    how: [
      "Uses YouTube search for channels, then pulls live statistics for each result.",
      "Up to 25 channels are returned per search. Narrow the keyword for better matches.",
      "Country is the channel's self-declared country, which many creators leave blank.",
    ],
  },
  {
    slug: "search-youtube-influencers-by-location",
    name: "Search YouTube Influencers by Location",
    platform: "YouTube",
    api: "youtube",
    action: "search",
    short: "Channels from a specific country, optionally narrowed by keyword.",
    intro: "Pick a country and an optional keyword. Results are limited to channels that list that country on their About page.",
    inputs: [
      { id: "country", label: "Country", type: "select", options: COUNTRIES.slice(1) },
      { id: "q", label: "Keyword (optional)", type: "text", placeholder: "Type a keyword, e.g. cooking", optional: true },
      { id: "minSubs", label: "Minimum subscribers", type: "number", value: 1000, min: 0 },
      { id: "maxSubs", label: "Maximum subscribers", type: "number", value: 10000000, min: 0 },
    ],
    how: [
      "YouTube search is run with the country as region, then results are filtered to channels whose declared country matches.",
      "Channels that never set a country are dropped, so smaller markets return fewer results.",
      "Combine with the niche finder to build a local creator shortlist.",
    ],
  },
  {
    slug: "youtube-lookalike-finder",
    name: "YouTube Lookalike Channel Finder",
    platform: "YouTube",
    api: "youtube",
    action: "lookalike",
    short: "Channels similar to one you already like, based on its topics and keywords.",
    intro: "Give one channel you already work with or admire. The tool reads its topics and keywords and finds channels covering the same ground.",
    inputs: [{ id: "channel", label: "Channel link, @handle or name", type: "text", placeholder: "Paste a link or @handle" }],
    how: [
      "Reads the seed channel's topic categories and channel keywords from the YouTube API.",
      "Searches for channels matching those terms and removes the seed channel from the list.",
      "Results are sorted by how close their subscriber count is to the seed channel.",
    ],
  },

  // ------------------------------------------------------------------ Twitch (live data)
  {
    slug: "twitch-follower-count-checker",
    name: "Twitch Follower Count Checker",
    platform: "Twitch",
    api: "twitch",
    action: "channel",
    short: "Followers, live status, current viewers and average VOD views for any streamer.",
    intro: "Enter a Twitch username. You get the follower count, whether the channel is live right now, and average views on the last 10 videos.",
    inputs: [{ id: "login", label: "Twitch username", type: "text", placeholder: "Paste a twitch.tv link or username" }],
    how: [
      "Data comes from the official Twitch Helix API.",
      "Average VOD views use the 10 most recent archived broadcasts or uploads.",
      "Partner and affiliate status is shown when Twitch exposes it.",
    ],
  },
  {
    slug: "twitch-channel-comparison",
    name: "Compare Twitch Channels",
    platform: "Twitch",
    api: "twitch",
    action: "compare",
    short: "Two or three streamers side by side: followers, live viewers, VOD views, account age.",
    intro: "Enter two or three usernames and compare followers, current viewers, average VOD views and account age in one table.",
    inputs: [
      { id: "a", label: "Streamer A", type: "text", placeholder: "Paste a link or username" },
      { id: "b", label: "Streamer B", type: "text", placeholder: "Paste a link or username" },
      { id: "c", label: "Streamer C (optional)", type: "text", placeholder: "Paste a link or username", optional: true },
    ],
    how: [
      "Live viewers only appear for channels streaming at the moment you run the check.",
      "Average VOD views use the last 10 videos on each channel.",
      "Followers per year shows growth pace regardless of account age.",
    ],
  },

  // ------------------------------------------------------------------ Instagram (manual input)
  {
    slug: "instagram-engagement-rate-calculator",
    name: "Instagram Engagement Rate Calculator",
    platform: "Instagram",
    short: "Engagement rate from followers, likes and comments, with a benchmark for the account size.",
    intro: "Type the follower count and the average likes and comments from the last 12 posts. You get the engagement rate and how it compares with accounts of the same size.",
    inputs: [
      { id: "followers", label: "Followers", type: "number", placeholder: "e.g. 25,000", min: 0 },
      { id: "likes", label: "Average likes per post", type: "number", placeholder: "e.g. 900", min: 0, hint: "Average of the last 12 posts" },
      { id: "comments", label: "Average comments per post", type: "number", placeholder: "e.g. 40", min: 0 },
    ],
    how: [
      "Engagement rate = (average likes + average comments) / followers x 100.",
      "Typical rates fall as accounts grow: about 4 percent under 10k followers, 2 percent to 100k, 1.2 percent to 1M, under 1 percent above.",
      "Use posts from the last 30 to 60 days so the average reflects the current audience.",
    ],
  },
  {
    slug: "instagram-engagement-rate-benchmark",
    name: "Instagram Engagement Rate Benchmark",
    platform: "Instagram",
    short: "See where an engagement rate sits against typical rates for each follower tier.",
    intro: "Enter followers and an engagement rate. The tool places it on the benchmark table and tells you whether it is low, average, good or excellent for that size.",
    inputs: [
      { id: "followers", label: "Followers", type: "number", placeholder: "e.g. 80,000", min: 0 },
      { id: "er", label: "Engagement rate (%)", type: "number", placeholder: "e.g. 2.4", min: 0, step: 0.01 },
    ],
    how: [
      "Benchmarks are typical 2025 to 2026 ranges by tier: nano, micro, mid, macro and mega.",
      "Excellent is roughly 1.5x the tier average. Low is under half of it.",
      "Rates vary by niche. Pets and comedy run high, fashion and business run lower.",
    ],
  },
  {
    slug: "instagram-follower-to-following-ratio",
    name: "Instagram Follower to Following Ratio",
    platform: "Instagram",
    short: "Ratio of followers to following and what it says about the account.",
    intro: "A quick popularity and authenticity check. Accounts that follow far more people than follow them back often grew through follow-for-follow tactics.",
    inputs: [
      { id: "followers", label: "Followers", type: "number", placeholder: "e.g. 12,000", min: 0 },
      { id: "following", label: "Following", type: "number", placeholder: "e.g. 600", min: 0 },
    ],
    how: [
      "Ratio = followers / following. Above 10 reads as an established creator, 2 to 10 as a growing account, under 1 as a personal or follow-back account.",
      "Brands treat a ratio under 1 on a large account as a red flag for bought or traded followers.",
      "The ratio alone is not proof of anything. Pair it with the engagement rate.",
    ],
  },
  {
    slug: "instagram-likes-to-followers-ratio",
    name: "Instagram Likes to Followers Ratio",
    platform: "Instagram",
    short: "Like rate per post as a share of followers, with a tier benchmark.",
    intro: "Shows what share of followers like a typical post. It is the simplest health check when comment data is not available.",
    inputs: [
      { id: "followers", label: "Followers", type: "number", placeholder: "e.g. 40,000", min: 0 },
      { id: "likes", label: "Average likes per post", type: "number", placeholder: "e.g. 1,200", min: 0 },
    ],
    how: [
      "Like rate = average likes / followers x 100.",
      "Healthy accounts under 100k followers usually see 2 to 5 percent. Above 1M, 0.5 to 1.5 percent is normal.",
      "Hidden like counts on some accounts make this metric unavailable. Ask the creator for a screenshot of insights.",
    ],
  },
  {
    slug: "instagram-money-calculator",
    name: "Instagram Money Calculator",
    platform: "Instagram",
    short: "Estimated earnings per sponsored post and per month from followers and engagement.",
    intro: "Estimates what a creator can earn from sponsored content. Enter followers, engagement rate and how many sponsored posts they run a month.",
    inputs: [
      { id: "followers", label: "Followers", type: "number", placeholder: "e.g. 60,000", min: 0 },
      { id: "er", label: "Engagement rate (%)", type: "number", placeholder: "e.g. 2.5", min: 0, step: 0.01 },
      { id: "postsPerMonth", label: "Sponsored posts per month", type: "number", value: 4, min: 0 },
    ],
    how: [
      "Base price = followers / 1,000 x $10, then adjusted by how the engagement rate compares with the tier average (0.6x to 1.6x).",
      "The range shown is 30 percent either side of that figure.",
      "Real deals also depend on niche, audience country, exclusivity and usage rights.",
    ],
  },
  {
    slug: "instagram-pricing-calculator",
    name: "Instagram Influencer Pricing Calculator",
    platform: "Instagram",
    short: "Fair price ranges for a feed post, a story and a reel from one account.",
    intro: "For brands and creators negotiating a deal. Enter followers and engagement rate and get a price band for each Instagram format.",
    inputs: [
      { id: "followers", label: "Followers", type: "number", placeholder: "e.g. 150,000", min: 0 },
      { id: "er", label: "Engagement rate (%)", type: "number", placeholder: "e.g. 1.8", min: 0, step: 0.01 },
    ],
    how: [
      "Feed post = followers / 1,000 x $10, adjusted for engagement. Reel = 1.3x a post. Story = 0.4x a post. Story set of 3 = 1x a post.",
      "Ranges are 30 percent either side of the midpoint.",
      "Add 20 to 50 percent for exclusivity, whitelisting or usage rights beyond 30 days.",
    ],
  },
  {
    slug: "instagram-emv-calculator",
    name: "Earned Media Value Calculator",
    platform: "Instagram",
    short: "Put a dollar value on impressions, likes, comments, shares and saves from a campaign.",
    intro: "Earned media value (EMV) translates organic engagement into what the same attention would cost in paid ads. Enter the totals from a post or a whole campaign.",
    inputs: [
      { id: "impressions", label: "Impressions", type: "number", placeholder: "e.g. 250,000", min: 0 },
      { id: "likes", label: "Likes", type: "number", placeholder: "e.g. 8,000", min: 0 },
      { id: "comments", label: "Comments", type: "number", placeholder: "e.g. 300", min: 0 },
      { id: "shares", label: "Shares", type: "number", placeholder: "e.g. 150", min: 0 },
      { id: "saves", label: "Saves", type: "number", placeholder: "e.g. 400", min: 0 },
      { id: "clicks", label: "Link clicks (optional)", type: "number", placeholder: "Leave blank if none", min: 0, optional: true },
    ],
    how: [
      "Impressions are valued at $6 per 1,000 (a typical Instagram ad CPM), likes at $0.10, comments at $0.50, shares at $1.50, saves at $0.40 and clicks at $0.60.",
      "The range uses a $4 to $10 CPM to show how much the impression assumption matters.",
      "EMV is a comparison metric between campaigns, not cash. Use the same weights every time.",
    ],
  },
  {
    slug: "instagram-fake-follower-checker",
    name: "Instagram Fake Follower Estimator",
    platform: "Instagram",
    short: "A suspicion score and estimated fake follower share from public profile numbers.",
    intro: "Enter the numbers you can see on any profile. The tool checks them against what real audiences of that size normally produce and flags the patterns bought followers leave behind.",
    inputs: IG_FIELDS,
    how: [
      "Engagement far below the tier average is the strongest signal. Comments under 0.3 percent of likes points to bought likes.",
      "Following more accounts than followers, or very few posts for a large following, adds to the score.",
      "This is an estimate from public data. A full audit needs follower-list analysis.",
    ],
  },
  {
    slug: "instagram-audit",
    name: "Instagram Account Audit",
    platform: "Instagram",
    short: "An audience quality score out of 100 covering engagement, authenticity, growth and consistency.",
    intro: "A one-page health check for any Instagram account. Enter the visible numbers plus the follower count from 30 days ago and how often the account posts.",
    inputs: [
      ...IG_FIELDS,
      { id: "followersBefore", label: "Followers 30 days ago", type: "number", placeholder: "e.g. 24,000", min: 0, hint: "Use Social Blade or the account's own insights" },
      { id: "postsPerWeek", label: "Posts per week", type: "number", placeholder: "e.g. 4", min: 0, step: 0.5 },
    ],
    how: [
      "Engagement 35 points, authenticity 25, growth 20, consistency 20.",
      "Growth of 5 percent or more in 30 days earns full growth points. Negative growth earns none.",
      "3 to 7 posts a week is treated as ideal consistency.",
    ],
  },
  {
    slug: "instagram-account-comparison",
    name: "Compare Instagram Accounts",
    platform: "Instagram",
    short: "Two or three accounts side by side on followers, ratio, engagement and like rate.",
    intro: "Enter the visible numbers for two or three accounts. Each metric is shown side by side with the leader marked.",
    compare: { labels: ["Account A", "Account B", "Account C"], fields: [{ id: "name", label: "Username", type: "text", placeholder: "Type the @username" }, ...IG_FIELDS] },
    how: [
      "Engagement rate = (likes + comments) / followers x 100.",
      "Comment rate = comments / likes x 100, a rough authenticity check.",
      "The leader is marked per row. No single winner is declared because brands weigh metrics differently.",
    ],
  },
  {
    slug: "instagram-caption-analyzer",
    name: "Instagram Caption Analyzer",
    platform: "Instagram",
    short: "Length, hashtags, mentions, emoji, call to action and readability for any caption.",
    intro: "Paste a caption before you post it. The analyzer checks it against Instagram's limits and the habits of high-performing posts.",
    inputs: [{ id: "caption", label: "Caption", type: "textarea", placeholder: "Paste the caption here, hashtags included", rows: 8 }],
    how: [
      "Instagram cuts captions at 2,200 characters and shows only the first 125 before 'more'.",
      "3 to 5 relevant hashtags outperform 30 generic ones for most accounts.",
      "A question or a clear call to action in the first two lines lifts comments.",
    ],
  },

  // ------------------------------------------------------------------ TikTok (manual input)
  {
    slug: "tiktok-engagement-rate-calculator",
    name: "TikTok Engagement Rate Calculator",
    platform: "TikTok",
    short: "Engagement by views and by followers from likes, comments and shares.",
    intro: "TikTok reach depends on the For You page, so engagement should be measured against views as well as followers. Enter averages from the last 12 videos.",
    inputs: [
      { id: "followers", label: "Followers", type: "number", placeholder: "e.g. 50,000", min: 0 },
      { id: "views", label: "Average views per video", type: "number", placeholder: "e.g. 30,000", min: 0 },
      { id: "likes", label: "Average likes per video", type: "number", placeholder: "e.g. 2,500", min: 0 },
      { id: "comments", label: "Average comments per video", type: "number", placeholder: "e.g. 60", min: 0 },
      { id: "shares", label: "Average shares per video", type: "number", placeholder: "e.g. 90", min: 0 },
    ],
    how: [
      "Engagement by views = (likes + comments + shares) / views x 100. 5 to 9 percent is typical, above 12 is excellent.",
      "Engagement by followers uses followers as the base. It runs higher than Instagram, often 6 to 10 percent for accounts under 100k.",
      "Shares count double in some agency formulas. This tool weights all three equally.",
    ],
  },
  {
    slug: "tiktok-likes-to-followers-ratio",
    name: "TikTok Likes to Followers Ratio",
    platform: "TikTok",
    short: "Total likes per follower, the number shown on every TikTok profile.",
    intro: "Every TikTok profile shows followers and total likes. Their ratio tells you whether the account earns its audience with content or grew some other way.",
    inputs: [
      { id: "followers", label: "Followers", type: "number", placeholder: "e.g. 50,000", min: 0 },
      { id: "totalLikes", label: "Total likes", type: "number", placeholder: "e.g. 1,200,000", min: 0 },
    ],
    how: [
      "Ratio = total likes / followers. Healthy creator accounts usually sit between 10 and 40.",
      "Under 5 on an account with many videos suggests followers who do not watch.",
      "Very high ratios are normal for accounts with one or two viral videos.",
    ],
  },
  {
    slug: "tiktok-money-calculator",
    name: "TikTok Money Calculator",
    platform: "TikTok",
    short: "Creator Rewards estimate from monthly views plus a sponsored video price band.",
    intro: "Two income lines in one: what TikTok's Creator Rewards Program pays on qualified views, and what a brand would pay for a sponsored video.",
    inputs: [
      { id: "followers", label: "Followers", type: "number", placeholder: "e.g. 120,000", min: 0 },
      { id: "monthlyViews", label: "Total views per month", type: "number", placeholder: "e.g. 2,000,000", min: 0 },
      { id: "qualifiedShare", label: "Share of views on videos over 1 minute (%)", type: "number", value: 60, min: 0, max: 100 },
      { id: "avgViews", label: "Average views per video", type: "number", placeholder: "e.g. 40,000", min: 0 },
    ],
    how: [
      "Creator Rewards pays roughly $0.40 to $1.00 per 1,000 qualified views. Only videos over one minute qualify.",
      "Sponsored video = average views / 1,000 x $10 to $20.",
      "Live gifts, TikTok Shop commissions and affiliate income are not included.",
    ],
  },
  {
    slug: "tiktok-pricing-calculator",
    name: "TikTok Influencer Pricing Calculator",
    platform: "TikTok",
    short: "Fair price range for a sponsored TikTok from average views and engagement.",
    intro: "For negotiating a sponsored TikTok. Views matter more than followers here because the For You page decides reach.",
    inputs: [
      { id: "followers", label: "Followers", type: "number", placeholder: "e.g. 120,000", min: 0 },
      { id: "avgViews", label: "Average views per video", type: "number", placeholder: "e.g. 40,000", min: 0 },
      { id: "er", label: "Engagement rate by views (%)", type: "number", placeholder: "e.g. 7", min: 0, step: 0.1 },
    ],
    how: [
      "Price = average views / 1,000 x $10 to $20, adjusted 0.7x to 1.4x by engagement.",
      "A series of 3 videos is priced at 2.5x a single video.",
      "Spark Ads rights (the brand boosts the creator's post) typically add 30 to 50 percent.",
    ],
  },
  {
    slug: "tiktok-fake-follower-checker",
    name: "TikTok Fake Follower Estimator",
    platform: "TikTok",
    short: "Suspicion score for a TikTok account from views, likes, comments and follower count.",
    intro: "Bought TikTok followers do not watch videos. Enter the public numbers and the tool checks whether views and engagement match the follower count.",
    inputs: TT_FIELDS,
    how: [
      "Average views under 5 percent of followers is the strongest signal on TikTok.",
      "Total likes under 3 per follower, or comments under 0.5 percent of likes, add to the score.",
      "This is an estimate from public data. A full audit needs follower-list analysis.",
    ],
  },
  {
    slug: "tiktok-audit",
    name: "TikTok Account Audit",
    platform: "TikTok",
    short: "Audience quality score out of 100 covering engagement, reach, authenticity and growth.",
    intro: "A quick health check for any TikTok account before a deal. Enter the public numbers plus the follower count 30 days ago.",
    inputs: [
      ...TT_FIELDS,
      { id: "followersBefore", label: "Followers 30 days ago", type: "number", placeholder: "e.g. 46,000", min: 0 },
      { id: "videosPerWeek", label: "Videos per week", type: "number", placeholder: "e.g. 5", min: 0, step: 0.5 },
    ],
    how: [
      "Engagement 30 points, reach (views per follower) 25, authenticity 25, growth and consistency 20.",
      "Views per follower of 50 percent or more earns full reach points.",
      "Growth of 8 percent or more in 30 days earns full growth points, since TikTok grows faster than Instagram.",
    ],
  },
  {
    slug: "tiktok-account-comparison",
    name: "Compare TikTok Accounts",
    platform: "TikTok",
    short: "Two or three TikTok accounts side by side on reach, engagement and likes per follower.",
    intro: "Enter the public numbers for two or three accounts and compare them metric by metric.",
    compare: { labels: ["Account A", "Account B", "Account C"], fields: [{ id: "name", label: "Username", type: "text", placeholder: "Type the @username" }, ...TT_FIELDS] },
    how: [
      "Views per follower shows how well each account reaches beyond its followers.",
      "Engagement by views = (likes + comments + shares) / views x 100.",
      "Likes per follower uses the total likes shown on the profile.",
    ],
  },

  // ------------------------------------------------------------------ X (manual input)
  {
    slug: "x-follower-to-following-ratio",
    name: "X (Twitter) Follower to Following Ratio",
    platform: "X",
    short: "Ratio of followers to following on X and what it signals.",
    intro: "On X the follower to following ratio is the first thing people look at. Enter both numbers to get the ratio and a plain reading of it.",
    inputs: [
      { id: "followers", label: "Followers", type: "number", placeholder: "e.g. 18,000", min: 0 },
      { id: "following", label: "Following", type: "number", placeholder: "e.g. 900", min: 0 },
    ],
    how: [
      "Ratio = followers / following. Above 10 reads as an authority account, 1 to 10 as a normal active user, under 1 as a follow-back account.",
      "X caps following at 5,000 until you have a comparable follower count, which keeps most ratios near 1 early on.",
      "Combine with reply and repost counts for a real engagement view.",
    ],
  },
  {
    slug: "x-account-comparison",
    name: "Compare X (Twitter) Accounts",
    platform: "X",
    short: "Two or three X accounts side by side on followers, ratio and engagement per post.",
    intro: "Enter the visible numbers for two or three X accounts and compare them on every metric.",
    compare: {
      labels: ["Account A", "Account B", "Account C"],
      fields: [
        { id: "name", label: "Username", type: "text", placeholder: "Type the @username" },
        { id: "followers", label: "Followers", type: "number", placeholder: "e.g. 18,000", min: 0 },
        { id: "following", label: "Following", type: "number", placeholder: "e.g. 900", min: 0 },
        { id: "posts", label: "Posts", type: "number", placeholder: "e.g. 5,400", min: 0 },
        { id: "likes", label: "Average likes per post", type: "number", placeholder: "e.g. 120", min: 0 },
        { id: "reposts", label: "Average reposts per post", type: "number", placeholder: "e.g. 15", min: 0 },
        { id: "replies", label: "Average replies per post", type: "number", placeholder: "e.g. 10", min: 0 },
      ],
    },
    how: [
      "Engagement rate = (likes + reposts + replies) / followers x 100. On X, 0.5 to 2 percent is typical.",
      "Reposts are the reach metric on X. Reposts per 1,000 followers is shown for that reason.",
      "The leader is marked per row.",
    ],
  },

  // ------------------------------------------------------------------ Generators (rule based, AI optional)
  {
    slug: "instagram-hashtag-generator",
    name: "Instagram Hashtag Generator",
    platform: "Instagram",
    api: "ai",
    action: "hashtags",
    short: "30 hashtags for any topic, mixed across broad, medium and niche sizes, ready to copy.",
    intro: "Type your topic and niche. You get a hashtag set built the way growth accounts do it: a few broad tags for discovery, most in the middle, and niche tags where you can actually rank.",
    inputs: [
      { id: "topic", label: "Post topic", type: "text", placeholder: "Type the post topic, e.g. morning skincare routine" },
      { id: "niche", label: "Niche", type: "select", options: NICHES.map((n) => [n, n[0].toUpperCase() + n.slice(1)]) },
      { id: "count", label: "How many hashtags", type: "select", options: [["10", "10"], ["15", "15"], ["20", "20"], ["30", "30"]], value: "20" },
    ],
    how: [
      "Tags are built from your topic words, common Instagram suffixes and a curated pool for each niche.",
      "The mix is about 20 percent broad, 50 percent medium and 30 percent niche.",
      "When the site owner adds a Claude API key, the generator upgrades to AI-written tags. It works without one.",
    ],
  },
  {
    slug: "instagram-bio-generator",
    name: "Instagram Bio Generator",
    platform: "Instagram",
    api: "ai",
    action: "bio",
    short: "Five bio options under 150 characters with a clear line for who you help and a call to action.",
    intro: "Fill in what you do, who it is for and the tone you want. You get five bios that fit Instagram's 150-character limit, each with a call to action.",
    inputs: [
      { id: "name", label: "Name or brand", type: "text", placeholder: "Type your name or brand" },
      { id: "what", label: "What you do", type: "text", placeholder: "Say what you do in a few words" },
      { id: "audience", label: "Who it is for", type: "text", placeholder: "Say who it is for, e.g. coaches and consultants" },
      { id: "cta", label: "Call to action", type: "text", placeholder: "Type your call to action, e.g. Book a free call", value: "Link below" },
      { id: "tone", label: "Tone", type: "select", options: TONES },
    ],
    how: [
      "Every bio follows the structure that converts: what you do, who for, proof or personality, then the call to action.",
      "Character counts are shown so you never hit the 150 limit.",
      "With a Claude API key set on the server the bios are AI-written. Without one, proven templates are used.",
    ],
  },
  {
    slug: "instagram-content-ideas-generator",
    name: "Instagram Content Ideas Generator",
    platform: "Instagram",
    api: "ai",
    action: "ideas",
    short: "Twelve post ideas for your niche and audience across reels, carousels and stories.",
    intro: "Stuck on what to post? Enter your niche, your audience and the format you want, and get a dozen concrete ideas with a hook for each.",
    inputs: [
      { id: "niche", label: "Niche", type: "text", placeholder: "Type your niche, e.g. web design" },
      { id: "audience", label: "Audience", type: "text", placeholder: "Describe your audience, e.g. small business owners" },
      { id: "format", label: "Format", type: "select", options: [["mixed", "Mixed"], ["reel", "Reels"], ["carousel", "Carousels"], ["story", "Stories"], ["post", "Single posts"]] },
    ],
    how: [
      "Ideas come from 40 proven content patterns (mistakes, before and after, myths, behind the scenes, checklists) filled with your niche and audience.",
      "Each idea includes a hook line you can use as the first caption line or reel text.",
      "With a Claude API key set on the server the ideas are AI-written for your exact niche.",
    ],
  },
  {
    slug: "instagram-growth-advisor",
    name: "Instagram Growth Advisor",
    platform: "Instagram",
    api: "ai",
    action: "advisor",
    short: "A prioritised action plan from your current numbers and your goal.",
    intro: "Enter where the account is now and what you want. You get the three to five changes most likely to move the number, in priority order, with the reason for each.",
    inputs: [
      { id: "followers", label: "Followers", type: "number", placeholder: "e.g. 3,200", min: 0 },
      { id: "er", label: "Engagement rate (%)", type: "number", placeholder: "e.g. 3.1", min: 0, step: 0.1 },
      { id: "postsPerWeek", label: "Posts per week", type: "number", placeholder: "e.g. 3", min: 0, step: 0.5 },
      { id: "reelsShare", label: "Share of posts that are reels (%)", type: "number", placeholder: "e.g. 30", min: 0, max: 100 },
      { id: "storiesPerWeek", label: "Stories per week", type: "number", placeholder: "e.g. 5", min: 0 },
      { id: "goal", label: "Main goal", type: "select", options: [["followers", "More followers"], ["engagement", "More engagement"], ["leads", "More leads and sales"], ["brand", "Brand deals"]] },
      { id: "niche", label: "Niche", type: "text", placeholder: "Type your niche, e.g. web design", optional: true },
    ],
    how: [
      "Rules compare your numbers with what works for accounts of your size and goal, then rank the gaps.",
      "Each recommendation says what to change, why, and what number to watch.",
      "With a Claude API key set on the server the plan is written by AI using the same inputs.",
    ],
  },
].concat(require("./tools-youtube-studio.js")(NICHES));

module.exports = { tools, COUNTRIES, NICHES };
