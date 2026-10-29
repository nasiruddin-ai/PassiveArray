// Long-form guide for /creator-tools/youtube-most-subscribed-channels/. Merged into tools.js by build-tools.js.
// Matches action "top" in lib/youtube.js: a fixed list of large channel IDs read with one channels.list call,
// cached six hours, sorted by public subscriber count. No figures are written here; the page reads them live.
module.exports = {
  seoTitle: "Most Subscribed YouTube Channels: Live Ranking | Passive Array",
  seoDescription: "The most subscribed YouTube channels ranked by live subscriber counts from the official YouTube API, with total views and videos. Free, updated every six hours.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "How this ranking works",
      p: [
        "YouTube does not publish an official list of its biggest channels. This page keeps a list of the channels known to sit at the top and reads their current public numbers from the YouTube Data API every six hours, so the order and counts are live rather than copied from somewhere else.",
        "Rank by subscribers, total views or videos uploaded. Each channel links to its full statistics in the <a href=\"../youtube-subscriber-count-checker/\">subscriber count checker</a>.",
      ],
    },
    {
      h: "Why some numbers look rounded",
      p: [
        "YouTube rounds the subscriber counts it shows publicly once a channel is large. A channel with tens of millions of subscribers is shown to three significant figures, so two channels can show the same count while being some way apart. Total views and video counts are exact.",
      ],
    },
    {
      h: "What is left out",
      list: [
        "<b>Topic channels.</b> YouTube generates channels such as Music, Gaming and Sports automatically. Nobody runs them, so they are not ranked here.",
        "<b>Hidden counts.</b> A channel that hides its subscriber count is skipped, because there is nothing public to rank.",
      ],
      after: ["If a channel belongs in this list and is missing, tell us through the <a href=\"../../contact/\">contact page</a> and we will add it."],
    },
  ],
  faq: [
    ["Which YouTube channel has the most subscribers?", "The channel at the top of the table above. The ranking is read live, so it stays correct when places change."],
    ["How often is the list updated?", "The counts are refreshed from the YouTube Data API every six hours."],
    ["Are these counts exact?", "Views and video counts are exact. Subscriber counts are the rounded figures YouTube makes public."],
    ["How do I track a channel's growth?", "Add it to the <a href=\"../youtube-channel-growth-tracker/\">growth tracker</a>, which records its subscribers and views every day."],
    ["What do the biggest channels get from YouTube?", "Creator Awards at subscriber milestones, from Silver at 100,000 up to Red Diamond at 100 million. See <a href=\"../../blog/youtube-play-button-levels/\">YouTube play button levels</a>."],
  ],
};
