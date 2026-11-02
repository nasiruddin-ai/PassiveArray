module.exports = {
  cover: {
    kicker: "For brands",
    title: "Influencer marketing *trends* for 2026",
    sub: "Nine trends from what platforms, regulators and named reports actually said.",
    size: 60,
    visual: { type: "stats", items: [
      { big: "$37B", label: "US creator ad spend projected for 2025", note: "IAB, Creator Economy Ad Spend & Strategy Report, November 2025" },
      { big: "79%", label: "of enterprise marketers struggle to measure ROI", note: "Linqia, 2026 State of Influencer Marketing" },
    ] },
  },
  figures: [
    {
      file: "us-creator-ad-spend-iab.webp", type: "bars",
      title: "US creator ad spend, per the IAB",
      sub: "Up 26% in 2025, about 4 times faster than the media industry overall.",
      bars: [
        { label: "2021", value: 13.9, display: "$13.9 billion" },
        { label: "2024", value: 29.5, display: "$29.5 billion" },
        { label: "2025 (projected)", value: 37, display: "$37 billion", hi: true },
      ],
      note: "Source: IAB, Creator Economy Ad Spend & Strategy Report, November 2025. The 2025 figure is a projection.",
    },
    {
      file: "expansion-intent-by-creator-size.webp", type: "bars",
      title: "Where brands plan to expand, by creator size",
      sub: "Share of respondents showing expansion intent for each creator tier.",
      bars: [
        { label: "Micro creators", value: 52.83, display: "52.83%", hi: true },
        { label: "Nano creators", value: 51.43, display: "51.43%", hi: true },
        { label: "Macro creators", value: 20.59, display: "20.59%" },
      ],
      note: "Source: Influencer Marketing Hub, Influencer Marketing Benchmark Report 2026 (600+ respondents).",
    },
    {
      file: "social-commerce-platforms.webp", type: "bars",
      title: "Social commerce: which platforms adopters use",
      sub: "Among respondents using social commerce. 53.33% were not using it at all.",
      bars: [
        { label: "TikTok Shop", value: 66.17, display: "66.17%", hi: true },
        { label: "Instagram Checkout", value: 13.16, display: "13.16%" },
        { label: "YouTube Shopping", value: 9.02, display: "9.02%" },
      ],
      note: "Source: Influencer Marketing Hub, Influencer Marketing Benchmark Report 2026. Share of platform selections among adopters.",
    },
  ],
};
