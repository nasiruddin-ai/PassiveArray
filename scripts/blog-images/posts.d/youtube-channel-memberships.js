module.exports = {
  cover: {
    kicker: "Earnings",
    title: "YouTube channel *memberships*",
    sub: "How they work, the rules for levels and perks, and what they pay.",
    size: 64,
    visual: { type: "stats", items: [
      { big: "70%", label: "of membership revenue goes to the creator", note: "After applicable taxes and fees, per YouTube Help" },
      { big: "6", label: "membership levels at most", note: "Each level must have between 1 and 5 perks" },
    ] },
  },
  figures: [
    {
      file: "youtube-membership-perk-types.webp", type: "picks",
      title: "Membership perks and their limits",
      sub: "Each level needs 1 to 5 perks. Higher levels include the perks of lower ones.",
      picks: [
        { name: "Recognition", tagline: "badges and emoji", points: ["Channel badges", "Custom emoji", "Member recognition shelf"] },
        { name: "Members-only content", tagline: "videos must be original", points: ["Videos, Shorts and posts", "Members-first videos"] },
        { name: "Live features", tagline: "streams and Premieres", points: ["Members-only live chat and streams", "Milestone chats"] },
        { name: "Not allowed", tagline: "membership policies", points: ["Downloads of YouTube content", "Random prizes, perks aimed at children"] },
      ],
      note: "Source: YouTube Help, levels and perks page and channel membership policies.",
    },
    {
      file: "turn-on-youtube-channel-memberships.webp", type: "flow",
      title: "How to turn on channel memberships",
      sub: "The channel must be in the Partner Program and the owner at least 18.",
      steps: [
        { title: "Check eligibility", text: "Requirements, available locations and the membership policies." },
        { title: "Turn on", text: "In YouTube Studio: Earn, then Memberships. Accept the terms." },
        { title: "Levels and perks", text: "Up to 6 levels, 1 to 5 perks each." },
        { title: "Review", text: "YouTube checks levels and perks. It takes about a day." },
      ],
      note: "Source: YouTube Help, \"Get started with channel memberships on YouTube\" and the levels and perks page.",
    },
  ],
};
