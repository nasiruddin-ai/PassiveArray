module.exports = {
  cover: {
    kicker: "Music",
    title: "Grow a *music* YouTube channel",
    sub: "Official Artist Channel, Content ID, Shorts and type beat titles that get found.",
    size: 64,
    visual: { type: "vs", sides: [
      { name: "Artist", tagline: "Your own songs", points: ["Official Artist Channel", "Shorts and YouTube Music", "Analytics for Artists"] },
      { name: "Producer", tagline: "Beats for sale", points: ["Type beat search titles", "Licence links up top", "BPM and key"] },
    ] },
  },
  figures: [
    {
      file: "shorts-creator-pool-share-with-music.webp", type: "bars",
      title: "Shorts revenue that goes to the Creator Pool",
      sub: "Music in a Short sends part of its revenue to music licensing.",
      bars: [
        { label: "No music", value: 100, display: "All of it", hi: true },
        { label: "One track", value: 50, display: "Half" },
        { label: "Two tracks", value: 33.3, display: "A third" },
      ],
      note: "Source: YouTube Shorts monetization terms. Creators keep 45% of their allocated share either way.",
    },
    {
      file: "type-beat-artists-to-target.webp", type: "picks",
      title: "Which artists to target with type beats",
      sub: "The same trade-off every search niche has: demand against competition.",
      picks: [
        { name: "Biggest names", tagline: "a smaller share", points: ["Most searches and most competition", "A new channel's upload sits far down the results"] },
        { name: "Rising artists", tagline: "most uploads", points: ["Fewer searches, but few good type beats yet", "Early producers can own the results"] },
        { name: "Pairings and sub-genres", tagline: "most uploads", points: ["Two artists together, or an artist plus a mood", "More specific and often easier to rank for"] },
        { name: "Check first", tagline: "before you upload", points: ["Search the phrase and look at the top results", "Small channels ranking means there is room"] },
      ],
      note: "Our suggested approach, not a YouTube rule.",
    },
  ],
};
