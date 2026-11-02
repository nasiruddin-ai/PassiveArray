module.exports = {
  cover: {
    kicker: "Earnings",
    title: "How YouTube *splits* ad revenue",
    sub: "The long-form share, the Shorts pool, Premium, and how to turn it into an estimate.",
    size: 64,
    visual: { type: "stats", items: [
      { big: "55%", label: "of net ad revenue on your long-form videos", note: "YouTube Partner Program terms" },
      { big: "45%", label: "of the Shorts revenue allocated to you", note: "From the pooled Shorts feed ad revenue" },
    ] },
  },
  figures: [
    {
      file: "how-shorts-ad-revenue-is-shared.webp", type: "flow",
      title: "How Shorts ad revenue is shared",
      sub: "Ads run between Shorts in the feed, so the money is pooled first.",
      steps: [
        { title: "Pool", text: "All Shorts feed ad revenue for the month is pooled, country by country." },
        { title: "Music", text: "Part covers music licensing: none with no music, half with one track, two thirds with two." },
        { title: "Split", text: "The creator pool is split by each creator's share of engaged Shorts views." },
        { title: "Your 45%", text: "You keep 45% of what is allocated to you." },
      ],
      note: "Source: YouTube Help, \"YouTube Shorts monetization policies\".",
    },
    { file: "youtube-money-calculator-estimate.webp", type: "shot", src: "youtube-ad-revenue-explained--money-calculator.png" },
  ],
};
