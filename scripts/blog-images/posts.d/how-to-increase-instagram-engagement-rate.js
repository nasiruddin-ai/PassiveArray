module.exports = {
  cover: {
    kicker: "Engagement",
    title: "How to *increase* Instagram engagement",
    sub: "Find why your rate is low, then fix it with what Instagram's ranking predicts.",
    size: 60,
    visual: { type: "shot", src: "how-to-increase-instagram-engagement-rate--er-calc.png", label: "Instagram Engagement Rate Calculator", tag: "Free, no account", style: "height:400px;object-fit:cover;object-position:left top" },
  },
  figures: [
    {
      file: "instagram-ranking-predicted-actions.webp", type: "picks",
      title: "What Instagram's ranking predicts",
      sub: "The most important predicted actions on each surface.",
      picks: [
        { name: "Feed", tagline: "accounts you follow", points: ["Spending a few seconds, commenting, liking", "Sharing, tapping the profile photo"] },
        { name: "Stories", tagline: "accounts you follow", points: ["Tapping in, replying", "Moving to the next story"] },
        { name: "Explore", tagline: "accounts you don't follow", points: ["Likes, saves, shares"] },
        { name: "Reels", tagline: "mostly non-followers", points: ["Resharing, watching to the end", "Liking, visiting the audio page"] },
      ],
      note: "Source: Instagram, \"Instagram ranking explained\", Adam Mosseri, 31 May 2023.",
    },
    {
      file: "instagram-engagement-30-day-plan.webp", type: "timeline",
      title: "A 30-day plan",
      sub: "Measure, find the pattern, post to it, then measure again.",
      events: [
        { dot: "1", when: "Day 1", what: "Rate and tier grade, fake follower estimate, Account Status" },
        { dot: "2", when: "Day 2", what: "List your 3 best and 3 worst posts of the last 60 days" },
        { dot: "3", when: "Days 3 to 28", what: "Post the best format and topic, stronger openings, reply to comments" },
        { dot: "4", when: "Day 29", what: "Recalculate using only this month's posts" },
        { dot: "5", when: "Day 30", what: "Keep what worked, drop the rest, set next month's focus" },
      ],
    },
    { file: "instagram-engagement-rate-example.webp", type: "shot", src: "how-to-increase-instagram-engagement-rate--er-calc.png" },
  ],
};
