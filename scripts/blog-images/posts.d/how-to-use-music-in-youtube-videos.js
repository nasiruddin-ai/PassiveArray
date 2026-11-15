module.exports = {
  cover: {
    kicker: "Growth",
    title: "Can you use *music* in YouTube videos?",
    sub: "Audio Library, Creator Music, Shorts audio, covers and live streams.",
    size: 60,
    visual: { type: "vs", sides: [
      { name: "Safe sources", tagline: "you have the right", points: ["YouTube Audio Library", "Creator Music", "Music you made"] },
      { name: "Risky", tagline: "expect a claim", points: ["A song you bought", "\"Free\" music found online", "A few seconds of a hit"] },
    ] },
  },
  figures: [
    {
      file: "music-options-for-youtube-videos.webp", type: "picks",
      title: "Where to get *music* for a video",
      sub: "The main sources, who can use each and the limit on each.",
      picks: [
        { name: "Audio Library", tagline: "anyone", points: ["Won't be claimed through Content ID", "Credit Creative Commons tracks"] },
        { name: "Creator Music", tagline: "US Partner Program", points: ["No-cost licences or revenue sharing", "Long-form videos only"] },
        { name: "Shorts Audio Library", tagline: "Shorts", points: ["Most songs up to 90 seconds", "May not be safe in a longer video"] },
        { name: "Your own licence", tagline: "any track", points: ["Must cover YouTube", "Keep it for a dispute"] },
      ],
      note: "Source: YouTube Help pages on the Audio Library, Creator Music and three-minute Shorts.",
    },
    {
      file: "creator-music-revenue-share.webp", type: "bars",
      title: "One revenue-sharing track: YouTube's example",
      sub: "The standard 55% share is adjusted to cover the costs of clearing music rights.",
      bars: [
        { label: "Standard long-form share", value: 55, display: "55%" },
        { label: "One revenue-sharing track", value: 27.5, display: "27.5%" },
        { label: "After an example 2.5% deduction", value: 25, display: "25%", hi: true },
      ],
      note: "Source: YouTube Help, \"Share revenue using Creator Music\". The deduction can be up to 5%.",
    },
  ],
};
