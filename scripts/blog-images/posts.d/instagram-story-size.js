module.exports = {
  cover: {
    kicker: "Engagement",
    title: "Instagram *story size* and Reel length",
    sub: "A 9:16 frame, 60-second Story clips, and Reels up to 20 minutes.",
    size: 60,
    visual: { type: "stats", items: [
      { big: "9:16", label: "the full-screen frame for Stories and Reels", note: "Meta ads guide; Reels accept 1.91:1 to 9:16" },
      { big: "3 min", label: "the longest Reel recommended to new audiences", note: "Instagram Help: record up to 20 minutes" },
    ] },
  },
  figures: [
    {
      file: "instagram-story-reel-specs.webp", type: "picks",
      title: "Instagram Story and Reel *specs*",
      sub: "Read on Instagram and Meta pages on 19 November 2026.",
      picks: [
        { name: "Stories", tagline: "9:16 frame", points: ["Up to 60 seconds per clip", "Gone after 24 hours"] },
        { name: "Story ads", tagline: "Meta ads guide", points: ["1440 x 2560 pixels", "Clear 14% top, 35% bottom"] },
        { name: "Reels", tagline: "1.91:1 to 9:16", points: ["At least 720 pixels", "At least 30 FPS"] },
        { name: "Reel cover", tagline: "set before posting", points: ["420 x 654 pixels", "Cannot be edited later"] },
      ],
      note: "Source: Instagram Help Center, Instagram Stories page, Meta Ads Guide.",
    },
    {
      file: "instagram-reel-length-timeline.webp", type: "timeline",
      title: "How Instagram *Reel length* changed",
      sub: "What Reels could be recommended to people who do not follow you.",
      events: [
        { dot: "1", when: "Before Jan 2025", what: "Only Reels up to 90 seconds eligible for recommendation" },
        { dot: "2", when: "21 Jan 2025", what: "Reels up to 3 minutes eligible; editor starts in the US" },
        { dot: "3", when: "Nov 2026", what: "Record up to 20 minutes; over 3 minutes not recommended" },
      ],
      note: "Source: Instagram for Creators blog, 21 January 2025; Instagram Help Center, read 19 November 2026.",
    },
  ],
};
