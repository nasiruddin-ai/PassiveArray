module.exports = {
  cover: {
    kicker: "Earnings",
    title: "How *Twitch streamers* make money",
    sub: "Subs, Bits, ads and sponsorships, with Affiliate rules and revenue splits.",
    size: 64,
    visual: { type: "stats", items: [
      { big: "50-70%", label: "of net sub revenue, standard to Plus Level 2", note: "Twitch Partners page and Plus Program" },
      { big: "55%", label: "of net ad revenue at 3+ ad minutes per hour", note: "Twitch Blog, Ads Manager update, September 2024" },
    ] },
  },
  figures: [
    {
      file: "twitch-subscription-split.webp", type: "bars",
      title: "Your share of net subscription revenue",
      sub: "The Plus Program raises the standard 50/50 split. Affiliates can qualify too.",
      bars: [
        { label: "Standard", value: 50, display: "50%" },
        { label: "Plus Level 1 (100 points)", value: 60, display: "60%", hi: true },
        { label: "Plus Level 2 (300 points)", value: 70, display: "70%", hi: true },
      ],
      note: "Source: Twitch Partners page and Twitch Blog. Points must be held for 3 consecutive months.",
    },
    {
      file: "twitch-affiliate-income-example.webp", type: "flow",
      title: "Example: a month for a small Affiliate",
      sub: "40 Tier 1 subs, 10,000 Bits, ads at 3 minutes an hour. Gross US prices, not a real channel.",
      steps: [
        { title: "Subscriptions", text: "40 x $5.99 = $239.60 gross.", you: "Up to about $120 at 50/50" },
        { title: "Bits", text: "10,000 Bits x 1 cent per Bit.", you: "$100" },
        { title: "Ads", text: "55% of net ad revenue. Twitch publishes no rate.", you: "Use your own Ads Manager numbers" },
        { title: "Total", text: "Before tax and fees, so the real payout is lower.", you: "Roughly $220 a month plus ads" },
      ],
      note: "Example from the article. Prices and splits: Twitch Partners page and Twitch Blog.",
    },
    { file: "twitch-channel-comparison.webp", type: "shot", src: "how-do-twitch-streamers-make-money--comparison.png" },
  ],
};
