module.exports = {
  cover: {
    kicker: "Sponsorships",
    title: "What to charge for a *sponsored* TikTok",
    sub: "Price on average views and engagement, then add Spark Ads and usage fees.",
    size: 58,
    visual: { type: "shot", src: "how-much-to-charge-for-a-sponsored-tiktok--pricing.png", label: "TikTok Pricing Calculator", tag: "Free, no account", style: "height:400px;object-fit:cover;object-position:left top" },
  },
  figures: [
    {
      file: "tiktok-sponsorship-price-formula.webp", type: "flow",
      title: "How the TikTok price is built",
      sub: "The calculator's method, step by step. These are its rules, not a TikTok standard.",
      steps: [
        { title: "Average views", text: "Your last 12 videos, leaving out a single viral hit." },
        { title: "x $10 to $20", text: "Per 1,000 average views: the starting range." },
        { title: "x adjustment", text: "Engagement by views / 7%, kept between 0.7x and 1.4x." },
        { title: "+ extras", text: "Spark Ads rights +40%; usage, exclusivity and rush quoted separately." },
      ],
    },
    {
      file: "tiktok-sponsorship-price-by-engagement.webp", type: "bars",
      title: "Example: *40,000 views*, three engagement levels",
      sub: "Price for one sponsored video. Same reach, double the price from bottom to top.",
      bars: [
        { label: "3.5% engagement (0.7x)", value: 420, display: "$280 to $560" },
        { label: "7% engagement (1.0x)", value: 600, display: "$400 to $800" },
        { label: "12% engagement (1.4x)", value: 840, display: "$560 to $1,120", hi: true },
      ],
      note: "Example, not a real account. Bars show the midpoint of each range, from the calculator's rules.",
    },
  ],
};
