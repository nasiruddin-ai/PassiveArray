module.exports = {
  cover: {
    kicker: "Earnings",
    title: "What *1 million views* pays",
    sub: "The arithmetic, and what moves a channel up or down the range.",
    size: 64,
    visual: { type: "stats", items: [
      { big: "$500", label: "low estimate: 1M long-form views at $0.50 RPM", note: "Bottom of our money calculator's default RPM range" },
      { big: "$4,000", label: "high estimate: the same views at $4.00 RPM", note: "Top of the default range. Finance niches can run higher" },
    ] },
  },
  figures: [
    {
      file: "1-million-views-by-rpm.webp", type: "bars",
      title: "Estimate: 1 million views at three RPMs",
      sub: "Earnings = (views / 1,000) x RPM, long-form ad revenue only.",
      bars: [
        { label: "$0.50 RPM", value: 500, display: "$500" },
        { label: "$4.00 RPM", value: 4000, display: "$4,000" },
        { label: "$10.00 RPM", value: 10000, display: "$10,000", hi: true },
      ],
      note: "Estimates. $0.50 and $4.00 are our money calculator's defaults; creators in finance, software and insurance report RPMs above $10.",
    },
    {
      file: "what-decides-1-million-views-pay.webp", type: "picks",
      title: "What decides where you land",
      sub: "The same million views can sit at either end of the range.",
      picks: [
        { name: "Audience country", tagline: "the biggest factor", points: ["Advertisers pay most for viewers in the US, UK, Canada and Australia"] },
        { name: "Niche", tagline: "what advertisers want", points: ["A credit card comparison beats a prank video", "Finance, software and insurance pay most"] },
        { name: "Length and Shorts", tagline: "ads per view", points: ["8+ minutes can carry mid-roll ads", "Mostly Shorts lands below the range"] },
        { name: "Season and no-ad views", tagline: "timing", points: ["Ads pay most in Q4, least in January", "Views with no ad earn nothing from ads"] },
      ],
      note: "Summarised from this article.",
    },
    { file: "sponsorship-price-calculator-result.webp", type: "shot", src: "how-much-does-youtube-pay-for-1-million-views--sponsorship.png" },
  ],
};
