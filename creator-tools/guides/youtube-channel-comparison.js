// Guide and FAQ for /creator-tools/youtube-channel-comparison/. Merged into tools.js by build-tools.js.
// Rows, formulas and the leader rule match COMPUTE["youtube-channel-comparison"] and compareTable() in public/shared.js,
// and summarizeRecent() in lib/youtube.js: averages from the last 10 uploads, uploads per month from their dates,
// higher value leads on every row, ties get no leader, channel age is never marked.
module.exports = {
  seoTitle: "Compare YouTube Channels Side by Side: Free Tool | Passive Array",
  seoDescription: "Compare two or three YouTube channels side by side: subscribers, average views, views per subscriber, engagement and upload pace. Free, no sign-up needed.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this YouTube channel comparison shows",
      p: ["Enter two or three channels and you get one table with a column for each. Every number comes from the official YouTube Data API, and the recent figures use each channel's last 10 public uploads:"],
      table: {
        head: ["Row", "How it is worked out"],
        rows: [
          ["Subscribers", "The public subscriber count"],
          ["Total views", "Lifetime views across the whole channel"],
          ["Videos", "Public videos on the channel"],
          ["Average views (last 10)", "Total views on the last 10 uploads / 10"],
          ["Views per subscriber", "Average views on the last 10 uploads / subscribers, as a percentage"],
          ["Engagement by views", "(Average likes + average comments) / average views, on the last 10 uploads"],
          ["Average comments", "Comments per upload, on the last 10 uploads"],
          ["Uploads per month", "Measured from the dates of the last 10 uploads"],
          ["Channel age (years)", "Time since the channel was created"],
        ],
      },
      after: ["The highest value on each row is shown in green. If two channels tie for the top, no leader is marked. Channel age is never marked, because older is not better or worse on its own."],
    },
    {
      h: "How to compare two YouTube channels",
      ordered: true,
      list: [
        "Paste a link, @handle or channel name into <b>Channel A</b> and <b>Channel B</b>. A plain name uses the top search match, so a link or @handle is safer.",
        "Add a third channel in <b>Channel C</b> if you want one. It is optional.",
        "Press <b>Compare</b>. No login is needed.",
        "Read the green cells, then read the rows that matter for your goal. The next section explains which ones those are.",
      ],
      after: [
        "If one channel cannot be found, the table still loads as long as two did, and a note names the one that failed. Use <b>Copy link to this result</b> to share the exact comparison with a colleague or client.",
        "One thing to keep in mind: on every row the higher number gets the green mark, including <b>Videos</b>. A channel with 2,000 uploads beats one with 200 on that row, but that says nothing about which is the better channel. Treat green as \"highest\", not as \"best\".",
      ],
    },
    {
      h: "Which numbers matter most when you compare channels?",
      p: ["It depends on why you are comparing. Subscribers are the number everyone looks at first and the one that tells you least, because a subscriber who stopped watching two years ago still counts."],
      table: {
        head: ["You are", "Look at first", "Why"],
        rows: [
          ["A brand choosing a creator", "Average views, views per subscriber, engagement by views", "You pay for the people who watch the next video, not for the subscriber count"],
          ["A creator benchmarking a rival", "Views per subscriber, uploads per month, engagement by views", "These are the parts you control, and they show how the other channel earns its reach"],
          ["Checking for a bought audience", "Views per subscriber and engagement together", "A big count with both figures low is the usual warning sign"],
          ["Sizing up a niche", "Average views and uploads per month across three peers", "Shows what a normal channel in that space gets and how often it posts"],
        ],
      },
      after: [
        "Views per subscriber is the single most useful row. Our article on <a href=\"../../blog/views-per-subscriber/\">views per subscriber</a> explains what a healthy figure looks like and why it falls as a channel grows. For engagement, see the <a href=\"../../blog/youtube-engagement-rate-benchmarks/\">YouTube engagement rate benchmarks</a>.",
      ],
    },
    {
      h: "A worked example: the bigger channel is not always the better buy",
      p: ["Take two channels in the same niche. These numbers are made up to show how to read the table:"],
      table: {
        head: ["Row", "Channel A", "Channel B"],
        rows: [
          ["Subscribers", "800K", "120K"],
          ["Average views (last 10)", "40K", "30K"],
          ["Views per subscriber", "5.0%", "25.0%"],
          ["Engagement by views", "1.5%", "4.0%"],
          ["Uploads per month", "1.2", "4.3"],
        ],
      },
      after: [
        "Channel A wins on subscribers and on average views. Channel B wins on everything else. For a brand, A delivers about a third more views per video. But only 1 in 20 of its subscribers watches a new upload, and its viewers react less. B's audience turns up, comments, and gets a new video roughly every week.",
        "If A and B quote similar prices, B is usually the safer deal: you get most of the views with an audience that clearly listens. If A quotes far more because of its subscriber count, the table gives you a reason to negotiate. Put each channel through the <a href=\"../youtube-sponsorship-price-calculator/\">sponsorship price calculator</a> to see a fair range based on views.",
      ],
    },
    {
      h: "What a side-by-side comparison cannot see",
      p: ["Everything in the table is public data, so some important things are missing:"],
      list: [
        "<b>Watch time, retention and audience country</b> are private to the channel owner. Ask the creator for screenshots from YouTube Studio before a deal. Our guide on <a href=\"../../blog/how-to-vet-an-influencer-before-you-pay/\">vetting an influencer before you pay</a> lists what to ask for.",
        "<b>Only the last 10 uploads count.</b> One viral video in that window can lift average views, views per subscriber and engagement. Open the channel and check for an outlier.",
        "<b>Shorts and long videos are mixed.</b> A channel posting mostly Shorts will show a higher upload pace and different view numbers than a long-form channel. Compare like with like.",
        "<b>Hidden subscriber counts</b> leave nothing to divide by, so views per subscriber reads zero for that channel.",
        "<b>Data is cached for up to 6 hours</b>, so a video uploaded this morning may not be in the window yet.",
      ],
      after: [
        "For a single score instead of a table, use the <a href=\"../youtube-channel-quality-checker/\">channel quality checker</a>. To follow a comparison over weeks rather than once, add the channels to the free <a href=\"../../app/\">dashboard</a>: it keeps a watchlist, records each channel daily, and has a one-click \"You vs\" comparison against your own channel.",
      ],
    },
  ],
  faq: [
    ["How do I compare two YouTube channels for free?", "Paste both channels into the boxes above and press Compare. You get subscribers, total views, videos, average views, views per subscriber, engagement, average comments, uploads per month and channel age side by side. No sign-up is needed."],
    ["Can I compare more than two channels?", "Yes, up to three at once. Channel C is optional. To compare a bigger set, run several comparisons or add the channels to the watchlist in the <a href=\"../../app/\">dashboard</a>."],
    ["What does the green highlight mean?", "It marks the highest value on that row. Ties get no highlight, and channel age is never highlighted. Higher is not always better: more videos, for example, just means a longer back catalogue."],
    ["What is views per subscriber?", "Average views on the last 10 uploads divided by the subscriber count, as a percentage. It shows how much of an audience still watches new videos. Read more in <a href=\"../../blog/views-per-subscriber/\">views per subscriber</a>."],
    ["How is engagement calculated in the comparison?", "Average likes plus average comments, divided by average views, on each channel's 10 most recent public uploads. It is the same figure the <a href=\"../youtube-engagement-rate-calculator/\">engagement rate calculator</a> shows as engagement by views."],
    ["Can I compare my channel with a competitor?", "Yes. Put your own channel in Channel A and up to two competitors next to it. If you want to repeat that comparison over time, the dashboard's \"You vs\" view does it in one click."],
    ["Why are some numbers rounded?", "The YouTube API returns subscriber counts rounded for channels above a certain size, the same way YouTube shows them publicly. Views, likes and comments on videos are exact."],
    ["Is the YouTube channel comparison tool free?", "Yes. No sign-up and no limit beyond a fair daily quota shared by all visitors."],
  ],
};
