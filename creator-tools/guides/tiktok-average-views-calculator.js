// Guide and FAQ for /creator-tools/tiktok-average-views-calculator/. Merged into tools.js by build-tools.js.
// Matches COMPUTE["tiktok-average-views-calculator"] in public/shared.js: average, median, median / followers,
// outliers above 3x the median, consistency from the coefficient of variation (<0.5 steady, <1 up and down).
module.exports = {
  seoTitle: "TikTok Average Views Calculator: Median Views & Viral Outliers | Passive Array",
  seoDescription: "Work out a TikTok account's average and median views from its recent videos, with views per follower, viral outliers and consistency. Free, no sign-up.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "Why average views mislead on TikTok",
      p: [
        "One TikTok can get 2 million views and the next 8,000. Add them up and divide, and the average says the account gets about a million views a video, which is not what a brand will see.",
        "The <b>median</b> fixes that. It is the middle video when you line them up from fewest to most views, so one viral hit cannot drag it up. This calculator shows both, and tells you when they are far apart.",
      ],
    },
    {
      h: "How to use it",
      ordered: true,
      list: [
        "Open the TikTok profile and note the follower count.",
        "Write down the view counts of the latest 10 to 30 videos, newest first. Skip pinned videos at the top, because they are usually older hits.",
        "Paste them in, one per line or separated by commas. Numbers like 12.4K and 1.2M work.",
      ],
    },
    {
      h: "What the results mean",
      table: {
        head: ["Result", "What it tells you"],
        rows: [
          ["Median views", "What a typical new video gets. The fairest number for pricing a sponsored post"],
          ["Average views", "Pulled up by viral videos. Useful only next to the median"],
          ["Median views ÷ followers", "How much of the following a typical video reaches. Above 100% is normal on TikTok, because most views come from the For You feed"],
          ["Viral outliers", "Videos with more than 3x the median. Study what they did differently"],
          ["Consistency", "Steady, up and down, or hit-driven, from how widely views swing between videos"],
        ],
      },
      after: ["To turn the median into a price, use the <a href=\"../tiktok-pricing-calculator/\">TikTok pricing calculator</a>. For likes and comments, use the <a href=\"../tiktok-engagement-rate-calculator/\">TikTok engagement rate calculator</a>."],
    },
  ],
  faq: [
    ["How do I calculate average views on TikTok?", "Add up the views of the recent videos and divide by how many videos there are. Paste the views here and the calculator does it, along with the median, which is usually more useful."],
    ["What is the difference between average and median views?", "The average adds everything up, so one viral video inflates it. The median is the middle video, so it shows what a typical video gets."],
    ["How many videos should I use?", "10 to 30 recent videos, skipping pinned ones. Fewer than 10 makes the numbers jumpy."],
    ["Is it normal to get more views than followers on TikTok?", "Yes. Most TikTok views come from the For You feed, not from followers, so views above the follower count are common."],
    ["Is it free?", "Yes. It runs in your browser with no account."],
  ],
};
