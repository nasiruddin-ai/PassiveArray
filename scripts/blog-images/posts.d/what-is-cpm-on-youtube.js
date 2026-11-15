module.exports = {
  cover: {
    kicker: "Earnings",
    title: "What is *CPM* on YouTube?",
    sub: "What advertisers pay per 1,000 ad impressions, and how it differs from RPM.",
    size: 66,
    visual: { type: "stats", items: [
      { big: "$3.50", label: "CPM in YouTube's own worked example", note: "$7 of advertiser spend over 2,000 ad impressions" },
      { big: "$4.67", label: "playback-based CPM, same example", note: "The same $7 over 1,500 monetized playbacks" },
    ] },
  },
  figures: [
    {
      file: "cpm-playback-cpm-rpm-compared.webp", type: "picks",
      title: "CPM, playback-based CPM and RPM",
      sub: "Three rates that divide different money by different counts.",
      picks: [
        { name: "CPM", tagline: "advertiser's number", points: ["Cost per 1,000 ad impressions", "Before YouTube's revenue share"] },
        { name: "Playback-based CPM", tagline: "advertiser's number", points: ["Cost per 1,000 playbacks with an ad", "Often higher than CPM"] },
        { name: "RPM", tagline: "creator's number", points: ["Your revenue per 1,000 views", "After the share, counts all views"] },
      ],
      note: "Source: YouTube Help, \"Understand ad revenue analytics\".",
    },
    {
      file: "youtube-cpm-example-counts.webp", type: "bars",
      title: "YouTube's example: one video, three counts",
      sub: "The advertiser paid $7. CPM is $3.50, playback-based CPM is $4.67.",
      bars: [
        { label: "Views", value: 5000, display: "5,000" },
        { label: "Ad impressions", value: 2000, display: "2,000", hi: true },
        { label: "Monetized playbacks", value: 1500, display: "1,500" },
      ],
      note: "Source: the worked example in YouTube Help, \"Understand ad revenue analytics\". Illustrative numbers, not typical rates.",
    },
  ],
};
