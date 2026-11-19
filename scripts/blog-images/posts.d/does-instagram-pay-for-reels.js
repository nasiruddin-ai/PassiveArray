module.exports = {
  cover: {
    kicker: "Earnings",
    title: "Does Instagram *pay* for reels?",
    sub: "Not per view. Here is every way a reel can earn, and who pays.",
    size: 64,
    visual: { type: "vs", sides: [
      { name: "Instagram pays", tagline: "limited routes", points: ["Bonuses, by invitation only", "Gifts: $0.01 per Star", "No per-view rate"] },
      { name: "Others pay", tagline: "most reel income", points: ["Brands, for sponsored reels", "Brands, for partnership ads", "Facebook, if invited"] },
    ] },
  },
  figures: [
    {
      file: "instagram-reels-payout-timeline.webp", type: "timeline",
      title: "What Meta has said about paying for reels",
      sub: "Every views-based reel payout on Instagram has been a limited test.",
      events: [
        { dot: "1", when: "Feb 2022", what: "Instagram says it will test ads on reels that share revenue with creators" },
        { dot: "2", when: "9 Mar 2023", what: "No new or renewed Reels Play deals, globally" },
        { dot: "3", when: "Nov 2023", what: "Invite-only holiday bonus for reels plays and photo views" },
        { dot: "4", when: "Jan to Apr 2024", what: "Renewed as New Year's and spring bonuses: US, South Korea, Japan" },
        { dot: "5", when: "Nov 2026", what: "Bonuses still a test: limited time and invitation-only" },
      ],
      note: "Sources: Instagram for Creators, Meta for Creators, Meta Newsroom and Instagram Help Center.",
    },
    {
      file: "instagram-reel-earning-routes.webp", type: "picks",
      title: "How a reel can earn",
      sub: "Only gifts are open to every eligible creator. The rest need an invitation or a brand.",
      picks: [
        { name: "Bonuses", tagline: "paid by Instagram", points: ["Invitation only", "Professional account, eligible country"] },
        { name: "Gifts", tagline: "viewers send Stars", points: ["$0.01 per Star, paid monthly", "18+, 500 followers, 49 countries"] },
        { name: "Brand deals", tagline: "paid off the platform", points: ["Paid partnership label", "Partnership ads need your permission"] },
        { name: "Facebook", tagline: "if you cross-post", points: ["Content Monetization, by invitation", "Pays on qualified views"] },
      ],
      note: "Source: Instagram Help Center, Meta Business Help Center and Meta for Creators.",
    },
  ],
};
