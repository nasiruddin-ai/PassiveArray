module.exports = {
  cover: {
    kicker: "Engagement",
    title: "The best time to post on *TikTok*",
    sub: "No time works for every account. TikTok Studio shows when yours is active.",
    size: 62,
    visual: { type: "vs", sides: [
      { name: "Followers tab", tagline: "your followers", points: ["Activity by hours and days", "Top locations", "Age and gender"] },
      { name: "Viewers tab", tagline: "everyone who watched", points: ["Most active times", "Covers the last 7 days", "Unique and returning viewers"] },
    ] },
  },
  figures: [
    {
      file: "tiktok-for-you-signals.webp", type: "picks",
      title: "What the *For You* feed uses",
      sub: "Posting time is one signal. TikTok does not say how much it weighs.",
      picks: [
        { name: "Interactions", tagline: "strongest group", points: ["Finish, skip, like, share", "Accounts the viewer follows"] },
        { name: "Video info", tagline: "includes timing", points: ["The time it was posted", "Sound, length, hashtags"] },
        { name: "Settings", tagline: "lower weight", points: ["Language and country", "Device type"] },
      ],
      note: "Source: TikTok Newsroom, \"How TikTok recommends videos #ForYou\"; TikTok Transparency Center.",
    },
    {
      file: "find-tiktok-active-times.webp", type: "flow",
      title: "Find when your *audience* is active",
      sub: "In the TikTok app. On the web, open Analytics on the left.",
      steps: [
        { title: "Profile", text: "Go to your profile and tap the menu bars." },
        { title: "TikTok Studio", text: "Select TikTok Studio." },
        { title: "Analytics", text: "Find Analytics and tap View all." },
        { title: "Followers or Viewers", text: "Followers: hours and days. Viewers: Most active times, last 7 days." },
      ],
      note: "Source: TikTok Creator Academy, \"Introducing TikTok analytics\".",
    },
  ],
};
