module.exports = {
  cover: {
    kicker: "Earnings",
    title: "Is this channel *monetized*?",
    sub: "The public signs, what each one proves, and where every checker hits its limit.",
    size: 66,
    visual: { type: "shot", src: "how-to-tell-if-a-youtube-channel-is-monetized--checker.png", label: "YouTube Monetization Checker", tag: "Free, no account", style: "height:400px;object-fit:cover;object-position:top" },
  },
  figures: [
    {
      file: "monetization-signals-what-they-prove.webp", type: "picks",
      title: "What each public signal really proves",
      sub: "No single sign is proof. Read them together.",
      picks: [
        { name: "Subscribers", tagline: "the threshold check", points: ["Under 1,000: no ad revenue share yet", "Under 500: no fan funding either"] },
        { name: "Ads on recent videos", tagline: "check 4 or 5 long-form", points: ["YouTube can run its own ads on non-partner channels", "One ad on one video proves nothing"] },
        { name: "Join or Thanks button", tagline: "fan funding features", points: ["Accepted into the Partner Program at some level", "Available from 500 subscribers, without ad revenue"] },
        { name: "Shorts", tagline: "hardest to read", points: ["Feed ads run between Shorts, revenue is pooled", "Compare 90-day Shorts views with 10 million"] },
      ],
      note: "Source: YouTube Help, Partner Program overview, Changes to the YouTube Partner Program, Terms of Service.",
    },
    { file: "monetization-checker-verdict.webp", type: "shot", src: "how-to-tell-if-a-youtube-channel-is-monetized--checker.png", maxHeight: 980 },
  ],
};
