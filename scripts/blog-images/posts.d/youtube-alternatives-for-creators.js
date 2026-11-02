module.exports = {
  cover: {
    kicker: "Platforms",
    title: "YouTube *alternatives* for creators",
    sub: "12 platforms compared: what each is good for, how it pays and who can join.",
    size: 60,
    visual: { type: "stats", items: [
      { big: "95%", label: "of each Kick subscription goes to the streamer", note: "Kick's 95/5 split on its main revenue streams" },
      { big: "55%", label: "of ad revenue on YouTube long-form videos", note: "Your share, per YouTube's Partner Program" },
    ] },
  },
  figures: [
    {
      file: "creator-revenue-shares.webp", type: "bars",
      title: "What the *creator* keeps",
      sub: "Shares from each platform's own rules. They apply to different kinds of income, so compare with care.",
      bars: [
        { label: "Kick subscriptions and tips", value: 95, display: "95%", hi: true },
        { label: "Twitch subs, Plus Program", value: 70, display: "up to 70%" },
        { label: "YouTube long-form ads", value: 55, display: "55%" },
        { label: "Twitch subs, standard", value: 50, display: "50%" },
        { label: "YouTube Shorts pool", value: 45, display: "45%" },
      ],
      note: "Sources: Kick, Twitch Help, YouTube Partner Program overview, checked October 2026.",
    },
    {
      file: "how-platforms-pay-creators.webp", type: "picks",
      title: "Four ways platforms *pay*",
      sub: "Know the model before comparing numbers. Most creators end up with a mix.",
      picks: [
        { name: "Ad revenue share", tagline: "e.g. YouTube", points: ["Ads on your videos, you get a share", "Scales with views and audience value"] },
        { name: "Funds and reward pools", tagline: "e.g. TikTok, Rumble", points: ["A pot divided by views, watch time or engagement", "Your share is unpredictable"] },
        { name: "Fan payments", tagline: "Twitch, Kick, Patreon", points: ["Subscriptions, tips, gifts, memberships", "Depends on loyalty, not size"] },
        { name: "Selling directly", tagline: "e.g. Vimeo", points: ["You sell access to video", "The platform charges a fee"] },
      ],
    },
    { file: "twitch-follower-count-checker.webp", type: "shot", src: "youtube-alternatives-for-creators--twitch-checker.png", maxHeight: 560 },
  ],
};
