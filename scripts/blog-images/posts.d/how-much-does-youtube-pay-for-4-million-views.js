module.exports = {
  cover: {
    kicker: "Earnings",
    title: "What *4 million views* pays",
    sub: "The arithmetic, four realistic scenarios and how to check a real video.",
    size: 64,
    visual: { type: "stats", items: [
      { big: "$2,000", label: "low estimate: 4M long-form views at $0.50 RPM", note: "Bottom of our money calculator's default RPM range" },
      { big: "$16,000", label: "high estimate: the same views at $4.00 RPM", note: "Top of the default range. A Short earns far less" },
    ] },
  },
  figures: [
    {
      file: "4-million-views-by-rpm.webp", type: "bars",
      title: "Estimate: 4 million views at five RPMs",
      sub: "Earnings = (views / 1,000) x RPM. The same views, very different pay.",
      bars: [
        { label: "$0.50 RPM", value: 2000, display: "$2,000" },
        { label: "$1.00 RPM", value: 4000, display: "$4,000" },
        { label: "$2.00 RPM", value: 8000, display: "$8,000" },
        { label: "$4.00 RPM", value: 16000, display: "$16,000" },
        { label: "$10.00 RPM", value: 40000, display: "$40,000", hi: true },
      ],
      note: "Estimates, long-form ad revenue only. $0.50 to $4.00 is our money calculator's default RPM range; $10 is seen in finance, business software and insurance.",
    },
    {
      file: "4-million-views-scenarios.webp", type: "picks",
      title: "Four ways 4 million views can pay",
      sub: "Estimated ad revenue for the same view count in four situations.",
      picks: [
        { name: "Viral, global", tagline: "about $2K to $4K", points: ["Many views from countries where advertisers pay little"] },
        { name: "Tutorial", tagline: "$8K to $16K or more", points: ["Watched mostly in the US, UK, Canada and Australia", "Long enough for mid-roll ads"] },
        { name: "A Short", tagline: "far below the long-form range", points: ["Paid from a shared pool, not from ads on your video"] },
        { name: "Not monetized", tagline: "$0", points: ["No Partner Program, no ad revenue, whatever the views"] },
      ],
      note: "Estimates from this article's scenarios, using our money calculator's default RPM range.",
    },
    { file: "monetization-checker-result.webp", type: "shot", src: "how-much-does-youtube-pay-for-4-million-views--monetization-checker.png", maxHeight: 595 },
  ],
};
