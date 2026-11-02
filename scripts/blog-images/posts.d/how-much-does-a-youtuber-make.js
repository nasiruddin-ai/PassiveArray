module.exports = {
  cover: {
    kicker: "Earnings",
    title: "How much a *YouTuber* makes",
    sub: "Ad income ranges by monthly views, and the income lines beyond ads.",
    size: 64,
    visual: { type: "stats", items: [
      { big: "$4,000", label: "a month from ads at 1M monthly views, high estimate", note: "Low estimate $500, at our money calculator's $0.50 to $4.00 RPM" },
      { big: "$0", label: "from ads for channels outside the Partner Program", note: "Most channels are not in it" },
    ] },
  },
  figures: [
    {
      file: "youtuber-ad-income-by-views.webp", type: "bars",
      title: "Estimated monthly ad income by views",
      sub: "Bar length shows the top of each range. Long-form ads only, monetized channel.",
      bars: [
        { label: "10,000 views", value: 40, display: "$5 to $40" },
        { label: "100,000 views", value: 400, display: "$50 to $400" },
        { label: "500,000 views", value: 2000, display: "$250 to $2,000" },
        { label: "1,000,000 views", value: 4000, display: "$500 to $4,000", hi: true },
      ],
      note: "Estimates: (monthly views / 1,000) x RPM, at our YouTube money calculator's default $0.50 to $4.00 RPM.",
    },
    {
      file: "youtuber-income-beyond-ads.webp", type: "picks",
      title: "Income beyond ads",
      sub: "For many full-time YouTubers, ads are not the main income.",
      picks: [
        { name: "Sponsorships", tagline: "priced on average views", points: ["Above roughly 50,000 views per video, often more than a month of ads"] },
        { name: "Fan funding", tagline: "paid through YouTube", points: ["Channel memberships, Super Chat and Super Thanks"] },
        { name: "Affiliate links", tagline: "commission per sale", points: ["Viewers buy a product through the creator's link"] },
        { name: "Products and courses", tagline: "sold to the audience", points: ["Merchandise, digital products and courses"] },
      ],
      note: "Summarised from this article.",
    },
    { file: "money-calculator-estimate.webp", type: "shot", src: "how-much-does-a-youtuber-make--money-calculator.png" },
  ],
};
