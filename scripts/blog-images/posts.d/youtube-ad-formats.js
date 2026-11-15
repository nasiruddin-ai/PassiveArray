module.exports = {
  cover: {
    kicker: "For brands",
    title: "YouTube *ad formats* and specs",
    sub: "Six formats in Google Ads Help: length, placement, billing and what to upload.",
    size: 64,
    visual: { type: "stats", items: [
      { big: "5 sec", label: "before viewers can skip a skippable in-stream ad", note: "Google Ads Help, skippable in-stream ads" },
      { big: "6 sec", label: "the length of a non-skippable bumper ad", note: "Google Ads Help, About video ad formats" },
    ] },
  },
  figures: [
    {
      file: "youtube-ad-length-limits.webp", type: "bars",
      title: "How long each YouTube ad can be",
      sub: "Skippable in-stream and in-feed ads have no maximum length.",
      bars: [
        { label: "Bumper", value: 6, display: "6 seconds" },
        { label: "Non-skippable, standard", value: 15, display: "15 seconds" },
        { label: "Non-skippable, connected TV", value: 30, display: "30 seconds" },
        { label: "Shorts feed plays the first", value: 60, display: "60 seconds", hi: true },
      ],
      note: "Source: Google Ads Help, \"About video ad formats\", non-skippable in-stream ads and YouTube Shorts ads pages.",
    },
    {
      file: "ways-to-buy-youtube-ads.webp", type: "picks",
      title: "Three ways to buy YouTube ads",
      sub: "The campaign type you choose sets the formats and bidding you get.",
      picks: [
        { name: "Promote", tagline: "in YouTube Studio", points: ["One of your own videos", "Goal, audience, budget and end date"] },
        { name: "Google Ads", tagline: "campaign types", points: ["Video reach and Video view campaigns", "Demand Gen for sales and leads"] },
        { name: "Reservation", tagline: "fixed rate", points: ["Masthead and other reserved formats", "Access through a Google representative"] },
      ],
      note: "Source: YouTube Help, \"Create and manage promotions on YouTube\"; Google Ads Help, Video reach, Demand Gen and reservation pages.",
    },
  ],
};
