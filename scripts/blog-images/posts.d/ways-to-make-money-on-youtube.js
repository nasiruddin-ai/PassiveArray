module.exports = {
  cover: {
    kicker: "Earnings",
    title: "*Ways* to make money on YouTube",
    sub: "Every official feature, who qualifies, your share, and the routes outside YouTube.",
    size: 62,
    visual: { type: "stats", items: [
      { big: "55%", label: "of net ad revenue on long-form videos", note: "Watch Page Monetization Module" },
      { big: "70%", label: "of net fan funding revenue", note: "Memberships, Super Chat, Super Stickers, Super Thanks" },
    ] },
  },
  figures: [
    {
      file: "youtube-revenue-share-by-feature.webp", type: "bars",
      title: "The creator's share, by *feature*",
      sub: "The three revenue shares YouTube publishes for Partner Program features.",
      bars: [
        { label: "Fan funding (memberships, Supers)", value: 70, display: "70%", hi: true },
        { label: "Ads on long-form videos", value: 55, display: "55%" },
        { label: "Shorts revenue allocated to you", value: 45, display: "45%" },
      ],
      note: "Source: YouTube Help, \"YouTube partner earnings overview\". Shares of net revenue; Shorts is 45% of your Creator Pool allocation.",
    },
    {
      file: "youtube-earning-routes-map.webp", type: "picks",
      title: "Where the money comes from",
      sub: "Three groups run through the Partner Program. The fourth does not.",
      picks: [
        { name: "Viewing", tagline: "1,000 subscribers", points: ["Ads on long-form videos", "Ads in the Shorts feed", "YouTube Premium revenue"] },
        { name: "Fans", tagline: "paid by viewers", points: ["Channel memberships", "Super Chat, Stickers, Thanks", "Gifts on live streams"] },
        { name: "Products", tagline: "Shopping", points: ["Your own connected store", "Shopping affiliate program", "Paid by retailer or AdSense"] },
        { name: "Outside YouTube", tagline: "no threshold", points: ["Sponsorships", "Affiliate links", "Own products, licensing"] },
      ],
      note: "Source: YouTube Help pages on earning, the expanded Partner Program and Shopping. Grouping is ours.",
    },
  ],
};
