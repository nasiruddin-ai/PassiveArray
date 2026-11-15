module.exports = {
  cover: {
    kicker: "Earnings",
    title: "What *1 million subscribers* pays",
    sub: "YouTube pays for views, not subscribers. How to turn one into the other.",
    size: 60,
    visual: { type: "stats", items: [
      { big: "$0", label: "paid by YouTube for subscribers themselves", note: "Revenue is shared on views, ads and fan payments" },
      { big: "1M", label: "subscribers: the Gold Creator Award", note: "Given after YouTube reviews the channel" },
    ] },
  },
  figures: [
    {
      file: "subscribers-to-income-steps.webp", type: "flow",
      title: "From subscribers to an income estimate",
      sub: "Subscribers do not pay. Each step moves closer to the number that does.",
      steps: [
        { title: "Subscribers", text: "1 million subscribers. YouTube pays nothing for the count itself." },
        { title: "Views per upload", text: "Average views on recent uploads. 10% to 30% of subscribers is normal." },
        { title: "Monthly views", text: "Average views per upload x uploads per month." },
        { title: "Ad income", text: "(Monthly views / 1,000) x RPM, at $0.50 to $4.00." },
      ],
      note: "The views per subscriber bands and the RPM range are Passive Array estimates, not YouTube figures.",
    },
    {
      file: "1-million-subscribers-income-scenarios.webp", type: "bars",
      title: "Same 1 million subscribers, five incomes",
      sub: "Hypothetical channels, 10 uploads a month. Bar length shows the top of each range.",
      bars: [
        { label: "1% views per subscriber", value: 400, display: "$50 to $400" },
        { label: "5%", value: 2000, display: "$250 to $2,000" },
        { label: "10%", value: 4000, display: "$500 to $4,000", hi: true },
        { label: "20%", value: 8000, display: "$1,000 to $8,000" },
        { label: "50%", value: 20000, display: "$2,500 to $20,000" },
      ],
      note: "Estimates: (monthly views / 1,000) x RPM, at our YouTube money calculator's default $0.50 to $4.00 RPM. Long-form ads only.",
    },
  ],
};
