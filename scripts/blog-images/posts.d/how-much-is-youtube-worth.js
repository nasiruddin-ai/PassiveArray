module.exports = {
  cover: {
    kicker: "Earnings",
    title: "How much is *YouTube* worth?",
    sub: "What Alphabet actually reports, and why every valuation is a guess.",
    size: 64,
    visual: { type: "stats", items: [
      { big: "$40.4B", label: "YouTube ad revenue in 2025", note: "Alphabet annual report, up from $36.1B in 2024" },
      { big: "$100B+", label: "paid to creators, artists and media companies", note: "In the four years before September 2025, per YouTube" },
    ] },
  },
  figures: [
    {
      file: "youtube-revenue-timeline.webp", type: "timeline",
      title: "YouTube's money, from purchase to 2026",
      sub: "Reported figures only. Alphabet does not publish a YouTube valuation.",
      events: [
        { dot: "1", when: "2006", what: "Google buys YouTube for $1.65 billion in stock" },
        { dot: "2", when: "2024", what: "YouTube ads revenue: $36.15 billion" },
        { dot: "3", when: "2025", what: "Ads revenue $40.37 billion; ads and subscriptions together over $60 billion" },
        { dot: "4", when: "Q3 2026", what: "Ads revenue $11.21 billion, about 9% above Q3 2025" },
      ],
      note: "Sources: Alphabet quarterly and annual reports filed with the SEC, and Alphabet's 2025 results.",
    },
    { file: "channel-value-calculator-estimate.webp", type: "shot", src: "how-much-is-youtube-worth--channel-value.png", maxHeight: 580 },
  ],
};
