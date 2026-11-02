module.exports = {
  cover: {
    kicker: "Shorts",
    title: "Can *Shorts* be monetized?",
    sub: "Yes. The thresholds, the creator pool, the 45% share and what changes in 2027.",
    size: 66,
    visual: { type: "stats", items: [
      { big: "10M", label: "public Shorts views in 90 days, plus 1,000 subscribers", note: "The Shorts route into the Partner Program, per YouTube" },
      { big: "45%", label: "of the pool revenue allocated to your Shorts", note: "YouTube keeps 55%" },
    ] },
  },
  figures: [
    {
      file: "shorts-creator-pool.webp", type: "flow",
      title: "How Shorts ad revenue is shared",
      sub: "Ads run between Shorts, so revenue is pooled and divided each month.",
      steps: [
        { title: "Pool", text: "Ad revenue from the Shorts feed is pooled into the Creator Pool.", you: "YouTube's example: $100,000 of feed ad revenue" },
        { title: "Music first", text: "One licensed track sends half a Short's revenue to rights holders; two tracks, two thirds.", you: "Example: 20% of Shorts use one track" },
        { title: "Your share", text: "Each country's pool is divided by share of engaged views.", you: "Example: 1% of engaged views = $900 allocated" },
        { title: "45% to you", text: "You keep 45% of your allocation; YouTube keeps 55%.", you: "Example: $405 paid to the creator" },
      ],
      note: "Source: YouTube's published Shorts revenue sharing rules, including its own worked example.",
    },
    {
      file: "shorts-monetization-2027-changes.webp", type: "picks",
      title: "What changes for Shorts in 2027",
      sub: "YouTube's announced update, effective 1 February 2027.",
      picks: [
        { name: "Shorts route", tagline: "new applicants", points: ["10M Shorts views in 90 days rises to 20M"] },
        { name: "Earning from the pool", tagline: "each month", points: ["Needs 10M qualified Shorts views in the previous 90 days"] },
        { name: "Targeted Shorts ads", tagline: "5 or fewer channels", points: ["Pay a direct 45% share, on top of the pool"] },
        { name: "Current members", tagline: "keep their status", points: ["Missing the Shorts threshold does not affect long-form earnings"] },
      ],
      note: "Source: YouTube's announced Partner Program update. Members must accept updated terms in Studio by 31 January 2027.",
    },
  ],
};
