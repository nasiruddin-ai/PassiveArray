module.exports = {
  cover: {
    kicker: "TikTok",
    title: "Grow on *TikTok* the honest way",
    sub: "How For You picks videos, how to read your engagement rate, and a 30-day plan.",
    size: 64,
    visual: { type: "shot", src: "how-to-grow-on-tiktok--engagement.png", label: "TikTok Engagement Rate Calculator", tag: "Free, no account", style: "height:360px;object-fit:cover;object-position:left top" },
  },
  figures: [
    { file: "tiktok-engagement-rate-calculator-example.webp", type: "shot", src: "how-to-grow-on-tiktok--engagement.png" },
    {
      file: "tiktok-engagement-rate-by-follower-tier.webp", type: "bars",
      title: "Typical TikTok engagement by followers",
      sub: "The rate by followers falls as accounts grow, so grade against your size tier.",
      bars: [
        { label: "Nano (under 10K)", value: 12, display: "12%", hi: true },
        { label: "Micro (10K to 100K)", value: 8, display: "8%" },
        { label: "Mid (100K to 500K)", value: 6, display: "6%" },
        { label: "Macro (500K to 1M)", value: 5, display: "5%" },
        { label: "Mega (over 1M)", value: 4, display: "4%" },
      ],
      note: "Passive Array's reference points, used by our TikTok tools. Not figures published by TikTok.",
    },
    {
      file: "tiktok-30-day-growth-plan.webp", type: "timeline",
      title: "A 30-day TikTok plan",
      sub: "Measure, copy what works, post a series, then measure again.",
      events: [
        { dot: "1", when: "Days 1 to 2", what: "Baseline: engagement rate from your last 12 videos, run the audit" },
        { dot: "2", when: "Days 3 to 5", what: "Study your three best and three worst videos of the last 60 days" },
        { dot: "3", when: "Days 6 to 25", what: "Post a series of at least five videos; reply to comments with videos" },
        { dot: "4", when: "Days 26 to 28", what: "Recalculate and compare followers per 1,000 views" },
        { dot: "5", when: "Days 29 to 30", what: "Keep the format that converted best" },
      ],
      note: "Our suggestion, not a TikTok rule.",
    },
  ],
};
