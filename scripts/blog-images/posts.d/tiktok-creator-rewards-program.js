module.exports = {
  cover: {
    kicker: "Earnings",
    title: "How TikTok *Creator Rewards* pays",
    sub: "The Creator Fund is gone. What replaced it, who qualifies and what it pays.",
    size: 64,
    visual: { type: "stats", items: [
      { big: "10,000", label: "authentic followers to qualify", note: "TikTok Creator Rewards Program Terms (US), 2026" },
      { big: "1 min", label: "minimum length for a video to earn", note: "Plus 100,000 views in the last 30 days" },
    ] },
  },
  figures: [
    {
      file: "creator-fund-to-creator-rewards-timeline.webp", type: "timeline",
      title: "From Creator Fund to Creator Rewards",
      sub: "The old fund closed in steps. There is no way to join it in 2026.",
      events: [
        { dot: "1", when: "February 2023", what: "TikTok launches the Creativity Program Beta" },
        { dot: "2", when: "16 December 2023", what: "Creativity Program fully replaces the Creator Fund in the US, UK, France and Germany" },
        { dot: "3", when: "18 March 2024", what: "The program leaves beta and becomes the Creator Rewards Program" },
        { dot: "4", when: "20 July 2026", what: "Latest update to TikTok's US Creator Rewards Program Terms" },
      ],
      note: "Source: TikTok Newsroom (February 2023, 18 March 2024) and Creator Rewards Program Terms (US).",
    },
    { file: "tiktok-money-calculator-estimate.webp", type: "shot", src: "tiktok-creator-rewards-program--money-calculator.png" },
  ],
};
