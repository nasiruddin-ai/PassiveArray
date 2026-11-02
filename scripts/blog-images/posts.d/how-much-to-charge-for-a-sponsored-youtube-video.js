module.exports = {
  cover: {
    kicker: "Sponsorships",
    title: "Price a YouTube sponsorship by *CPM*",
    sub: "Average views x the CPM brands pay, with multipliers for dedicated videos and Shorts.",
    size: 58,
    visual: { type: "shot", src: "how-much-to-charge-for-a-sponsored-youtube-video--sponsor.png", label: "YouTube Sponsorship Price Calculator", tag: "Free, no account", style: "height:400px;object-fit:cover;object-position:left top" },
  },
  figures: [
    {
      file: "youtube-sponsorship-price-by-format.webp", type: "bars",
      title: "Example: a *120,000-view* channel",
      sub: "Mid-range price at $35 per 1,000 views, by format.",
      bars: [
        { label: "Dedicated video (1.75x)", value: 7350, display: "about $7,350", hi: true },
        { label: "60-second integration (1x)", value: 4200, display: "$4,200" },
        { label: "Shorts mention (0.25x)", value: 1050, display: "about $1,050" },
      ],
      note: "Example. Formula: average views x CPM / 1,000, with the multipliers the Passive Array sponsorship calculator uses.",
    },
    { file: "youtube-sponsorship-calculator-result.webp", type: "shot", src: "how-much-to-charge-for-a-sponsored-youtube-video--sponsor.png" },
  ],
};
