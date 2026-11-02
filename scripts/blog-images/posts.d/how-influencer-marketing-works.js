module.exports = {
  cover: {
    kicker: "For brands",
    title: "How influencer marketing *works*",
    sub: "The deal types, nine steps from goal to report, and a $3,000 worked example.",
    size: 62,
    visual: { type: "shot", src: "how-influencer-marketing-works--niche-finder.png", label: "Find YouTube Influencers in Your Niche", tag: "Free, no account", style: "height:400px;object-fit:cover;object-position:top" },
  },
  figures: [
    {
      file: "small-influencer-campaign-timeline.webp", type: "timeline",
      title: "How long a small campaign takes",
      sub: "Plan on several weeks from first search to a result you can judge.",
      events: [
        { dot: "1", when: "Weeks 1 to 2", what: "Find and vet creators" },
        { dot: "2", when: "Week 3", what: "Agree terms, brief and contract" },
        { dot: "3", when: "Weeks 4 to 5", what: "Creator makes the content; you approve it and the disclosure" },
        { dot: "30", when: "30 days after posting", what: "Collect insights and measure against the goal" },
      ],
      note: "Typical timing for a small campaign, from this guide. Creators with full calendars may book further ahead.",
    },
    {
      file: "example-3000-campaign-budget.webp", type: "bars",
      title: "Example: splitting a $3,000 first campaign",
      sub: "One YouTube integration, two Instagram creators, and money kept back to boost a winner.",
      bars: [
        { label: "YouTube integration", value: 1000, display: "about $1,000", hi: true },
        { label: "Instagram A, reel", value: 600, display: "about $600" },
        { label: "Instagram B, feed post", value: 480, display: "about $480" },
        { label: "Product, shipping, 15% code", value: 500, display: "about $500" },
        { label: "Kept back to boost a winner", value: 420, display: "a few hundred" },
      ],
      note: "Example numbers from this guide, not a quote. Prices estimated from average views and engagement.",
    },
    { file: "instagram-pricing-calculator-example.webp", type: "shot", src: "how-influencer-marketing-works--instagram-pricing.png" },
  ],
};
