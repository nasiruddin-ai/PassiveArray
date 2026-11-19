// Long-form guide for /creator-tools/youtube-watch-hours-calculator/. Matches COMPUTE["youtube-watch-hours-calculator"]:
// watchEstimate() in lib/youtube.js (action "watchhours"), the same estimate as the monetization checker.
module.exports = {
  seoTitle: "YouTube Watch Hours Calculator: Estimate 4,000 Hours | Passive Array",
  seoDescription: "Free YouTube watch hours calculator. Estimate any channel's public watch hours a year from its views and video lengths, and see how close it is to 4,000.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "How to estimate a channel's watch hours",
      ordered: true,
      list: [
        "Paste the channel's link or @handle.",
        "Read the estimated range of public watch hours a year, and how close it is to the 4,000-hour and 3,000-hour thresholds.",
        "For your own channel, check the real number in YouTube Studio as well: this is an estimate from public data.",
      ],
    },
    {
      h: "Why it is a range",
      p: [
        "Watch hours are private. Only the channel owner sees them. What is public is how many views videos get and how long they are, so the calculator turns views into hours by assuming viewers watch 30 to 50 percent of a typical long video.",
        "Where Passive Array has recorded the channel's daily views for at least two weeks, it uses those measured views. Otherwise it estimates yearly views from recent uploads plus an allowance for older videos that keep getting watched.",
      ],
    },
    {
      h: "The thresholds",
      table: {
        head: ["Tier", "Watch hours", "Other conditions"],
        rows: [
          ["Full Partner Program (ad revenue)", "4,000 public watch hours in the last 12 months", "1,000 subscribers; or 10 million public Shorts views in 90 days instead of the hours"],
          ["Expanded Partner Program (fan funding, Shopping)", "3,000 public watch hours in the last 12 months", "500 subscribers and 3 public uploads in the last 90 days; or 3 million Shorts views"],
        ],
      },
      p: ["From 1 February 2027 YouTube raises the numbers for new applicants. The <a href=\"../../blog/youtube-monetization-requirements/\">monetization requirements guide</a> has the full detail."],
    },
    {
      h: "What does not count",
      list: [
        "Views on Shorts do not count toward watch hours. Shorts have their own route.",
        "Private, unlisted and deleted videos do not count as public watch hours.",
        "Only the last 12 months count, so old hours drop off as time passes.",
      ],
    },
  ],
  faq: [
    ["How do I see my real watch hours?", "In YouTube Studio, open the Earn section. It shows your public watch hours for the last 12 months against the requirement. That number is exact; this calculator is for estimates and for checking other channels."],
    ["Why is my estimate different from YouTube Studio?", "Because viewers on your channel may watch more or less than the 30 to 50 percent assumed here. Channels with very long videos or very loyal viewers often differ most."],
    ["Do Shorts views count toward 4,000 hours?", "No. Shorts views count toward the separate Shorts route, measured in views over 90 days, not toward watch hours."],
    ["Is it safe to buy watch hours?", "No. Paid or artificial views break YouTube's fake engagement policy, are removed, and can get a channel rejected from the Partner Program or terminated."],
  ],
};
