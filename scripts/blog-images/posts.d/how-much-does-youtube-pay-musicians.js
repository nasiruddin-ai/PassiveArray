module.exports = {
  cover: {
    kicker: "Earnings",
    title: "How YouTube pays *musicians*",
    sub: "Channel ads, Content ID, Art Tracks, Shorts and fans: who gets paid, and how.",
    size: 66,
    visual: { type: "stats", items: [
      { big: "55%", label: "of net ad revenue on your long-form videos", note: "YouTube partner earnings overview" },
      { big: "50%", label: "of music industry revenue on YouTube is from fan uploads", note: "YouTube Help, Music rights management on YouTube" },
    ] },
  },
  figures: [
    {
      file: "who-gets-music-money-first.webp", type: "picks",
      title: "Who receives music money first",
      sub: "The four routes that usually matter most, and where each one lands.",
      picks: [
        { name: "Your channel's ads", tagline: "Partner Program", points: ["You via AdSense, or your content owner", "Creator share is 55% on long-form"] },
        { name: "Content ID", tagline: "fans using your recording", points: ["The rights owner: label, distributor or you", "Monetize keeps fan uploads up and earning"] },
        { name: "Art Tracks", tagline: "Topic channel and YouTube Music", points: ["Your label or distributor", "Only via partners delivering through DDEX"] },
        { name: "Shorts music share", tagline: "your track in other Shorts", points: ["Music rights holders", "YouTube does not publish what one use is worth"] },
      ],
      note: "Source: YouTube for Artists, How artists make money; YouTube Help, Content ID, Art Tracks, partner earnings.",
    },
    {
      file: "shorts-music-split.webp", type: "bars",
      title: "Shorts revenue left for the Creator Pool",
      sub: "Each Short's share of the pool, by how many music tracks it uses. The rest goes to music licensing.",
      bars: [
        { label: "No music", value: 100, display: "All of it" },
        { label: "One track", value: 50, display: "Half", hi: true },
        { label: "Two tracks", value: 33.3, display: "One third", hi: true },
      ],
      note: "Source: YouTube Help, \"YouTube Shorts monetization policies\".",
    },
  ],
};
