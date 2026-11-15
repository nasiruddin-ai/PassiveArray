module.exports = {
  cover: {
    kicker: "Growth",
    title: "How long can a *Short* be?",
    sub: "Up to three minutes, square or vertical. The catches start at one minute.",
    size: 66,
    visual: { type: "stats", items: [
      { big: "3 min", label: "maximum length of a YouTube Short", note: "Uploads on or after 15 October 2024, per YouTube Help" },
      { big: "1 min", label: "the mark where copyright claim rules change", note: "YouTube Help, three-minute Shorts" },
    ] },
  },
  figures: [
    {
      file: "three-minute-shorts-dates.webp", type: "timeline",
      title: "The dates that decide what is a *Short*",
      sub: "Square or vertical videos up to three minutes, by upload date.",
      events: [
        { dot: "1", when: "Before 15 Oct 2024", what: "Uploads stay long-form videos, monetized on the Watch Page" },
        { dot: "2", when: "15 Oct 2024", what: "Standard channels: uploads up to three minutes are Shorts" },
        { dot: "3", when: "8 Dec 2025", what: "Official Artist Channels: the same rule applies" },
      ],
      note: "Source: YouTube Help, \"Understand three-minute YouTube Shorts\".",
    },
    {
      file: "shorts-over-one-minute-catches.webp", type: "picks",
      title: "The catches on longer Shorts",
      sub: "What YouTube Help documents for Shorts that run past one minute.",
      picks: [
        { name: "Claims", tagline: "over one minute", points: ["A claimed Short can be blocked", "No penalties to your channel"] },
        { name: "Music", tagline: "library limits", points: ["Most songs: up to 90 seconds", "Some tracks: 60 or 30 seconds"] },
        { name: "Pay", tagline: "Shorts feed", points: ["Paid from the Shorts feed", "Creators keep 45% of their allocation"] },
        { name: "Testing", tagline: "not available", points: ["No A/B testing for Shorts", "Titles and thumbnails cannot be tested"] },
      ],
      note: "Source: YouTube Help, \"Understand three-minute YouTube Shorts\", Shorts monetization policies and A/B testing help.",
    },
  ],
};
