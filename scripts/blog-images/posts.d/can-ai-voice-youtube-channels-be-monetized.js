module.exports = {
  cover: {
    kicker: "Earnings",
    title: "Can *AI voice* channels earn?",
    sub: "YouTube does not ban AI voices. It bans mass-produced and reused content.",
    size: 66,
    visual: { type: "vs", sides: [
      { name: "Can earn", tagline: "lower risk", points: ["Your own researched script", "Original fiction with AI visuals", "Your own cloned voice"] },
      { name: "Will not", tagline: "high risk", points: ["Reading others' text", "Mass-produced templates", "AI doctor or lawyer host"] },
    ] },
  },
  figures: [
    {
      file: "youtube-ai-monetization-policies.webp", type: "picks",
      title: "The four policy parts that matter for AI",
      sub: "AI content is judged by the same channel monetization policies as everything else.",
      picks: [
        { name: "Inauthentic content", tagline: "renamed 15 July 2025", points: ["Mass-produced or repetitive videos", "Generic AI templates with no original insight"] },
        { name: "Reused content", tagline: "unchanged in 2025", points: ["Readings of material you did not create", "Synthetic or human voice, same rule"] },
        { name: "AI YouTube allows", tagline: "named examples", points: ["AI visuals for a character you invented", "AI to edit your scripts or make backgrounds"] },
        { name: "AI personas", tagline: "sensitive topics", points: ["AI doctor, financial adviser or legal host", "Not monetizable"] },
      ],
      note: "Source: YouTube Help, \"YouTube channel monetization policies\".",
    },
    {
      file: "ai-channel-rule-breach-consequences.webp", type: "flow",
      title: "If an AI channel breaks the rules",
      sub: "The consequences YouTube's monetization policies list, from mild to severe.",
      steps: [
        { title: "Ads off", text: "Monetization turned off on videos, or on the whole channel for reused content." },
        { title: "Removed", text: "Removal from the Partner Program and all monetization features." },
        { title: "Earnings held", text: "Earnings withheld or adjusted; payments delayed up to 90 days in an investigation." },
        { title: "Termination", text: "New or related channels used as a workaround can all be terminated." },
      ],
      note: "Source: YouTube Help, \"YouTube channel monetization policies\".",
    },
  ],
};
