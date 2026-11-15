module.exports = {
  cover: {
    kicker: "Earnings",
    title: "YouTube *affiliate* marketing",
    sub: "Where links work, when to disclose, and how the Shopping affiliate program fits in.",
    size: 64,
    visual: { type: "vs", sides: [
      { name: "Your own links", tagline: "any program", points: ["Long-form description", "Comments and profile links", "Paid by the merchant"] },
      { name: "Shopping affiliate", tagline: "YouTube's program", points: ["Product tags on videos", "Works on Shorts", "Paid through AdSense"] },
    ] },
  },
  figures: [
    {
      file: "youtube-clickable-link-placements.webp", type: "picks",
      title: "Where links are clickable",
      sub: "A typed URL works on long-form videos. It does not work on Shorts.",
      picks: [
        { name: "Clickable", tagline: "per YouTube Help", points: ["Long-form descriptions and comments", "Channel profile links, up to 14", "Shopping affiliate program links", "Related video link on a Short"] },
        { name: "Not clickable", tagline: "per YouTube Help", points: ["Shorts descriptions", "Shorts comments", "Posts", "Vertical live feed chat in the app"] },
      ],
      note: "Source: YouTube Help, \"Sharing links with your audiences\". Long-form links need advanced features access.",
    },
    {
      file: "youtube-affiliate-disclosure-steps.webp", type: "flow",
      title: "Disclosing an affiliate video",
      sub: "YouTube's label and your own words do different jobs. Use both.",
      steps: [
        { title: "Say it", text: "In the video, say you earn a commission on purchases through your links." },
        { title: "Write it", text: "Put the same plain words next to the links, not among hashtags." },
        { title: "Tick the box", text: "Use the paid promotion box when a brand paid, supplied or influenced." },
        { title: "Stay honest", text: "Only describe your experience with products you have tried." },
      ],
      note: "Source: YouTube Branded Content Policies; FTC, \"Disclosures 101 for Social Media Influencers\".",
    },
  ],
};
