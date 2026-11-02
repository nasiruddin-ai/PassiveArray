module.exports = {
  cover: {
    kicker: "Earnings",
    title: "YouTube *monetization* requirements",
    sub: "The thresholds for both Partner Program tiers, and the higher bar in 2027.",
    size: 60,
    visual: { type: "stats", items: [
      { big: "1,000", label: "subscribers for ads and revenue sharing", note: "Per YouTube's own Help pages" },
      { big: "4,000", label: "public watch hours in 12 months, or 10M Shorts views in 90 days", note: "You need one route, not both" },
    ] },
  },
  figures: [
    {
      file: "youtube-partner-program-tiers.webp", type: "picks",
      title: "The two Partner Program tiers",
      sub: "You need the subscriber count and one of the two routes, never both routes.",
      picks: [
        { name: "Fan funding and Shopping", tagline: "lower tier", points: ["500 subscribers", "3,000 public watch hours in 12 months, or 3M Shorts views in 90 days", "Memberships, Super Chat, Super Thanks, Shopping"] },
        { name: "Ads and revenue sharing", tagline: "higher tier", points: ["1,000 subscribers", "4,000 public watch hours in 12 months, or 10M Shorts views in 90 days", "Adds ad revenue and Premium revenue"] },
      ],
      note: "Source: YouTube's Help pages on the YouTube Partner Program.",
    },
    {
      file: "youtube-monetization-2027-changes.webp", type: "picks",
      title: "What changes on 1 February 2027",
      sub: "A higher bar for new applicants. Current members keep their status.",
      picks: [
        { name: "Until 31 January 2027", tagline: "today's bar", points: ["1,000 subscribers", "4,000 watch hours in 12 months", "or 10M Shorts views in 90 days"] },
        { name: "From 1 February 2027", tagline: "new applicants", points: ["1,000 subscribers", "8,000 watch hours in 365 days", "or 20M Shorts views in 90 days"] },
      ],
      note: "Source: YouTube's announced Partner Program update effective 1 February 2027. Fan funding tier unchanged.",
    },
    { file: "monetization-checker-result.webp", type: "shot", src: "youtube-monetization-requirements--monetization-checker.png", maxHeight: 595 },
  ],
};
