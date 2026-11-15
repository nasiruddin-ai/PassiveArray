module.exports = {
  cover: {
    kicker: "Earnings",
    title: "YouTube *AI disclosure* rules",
    sub: "Realistic AI content needs a label. Minor edits and unrealistic content do not.",
    size: 66,
    visual: { type: "vs", sides: [
      { name: "Disclose", tagline: "seems realistic", points: ["Real person, fake words", "Altered real event or place", "AI generated music"] },
      { name: "No need", tagline: "minor or unreal", points: ["Scripts, titles, thumbnails", "Your own cloned voice", "Filters and upscaling"] },
    ] },
  },
  figures: [
    {
      file: "youtube-ai-disclosure-yes-no.webp", type: "picks",
      title: "What to disclose, and what not to",
      sub: "The test is realism plus meaningful change. Examples are YouTube's own.",
      picks: [
        { name: "Select Yes", tagline: "must disclose", points: ["A real person saying what they did not", "AI footage of a real place", "A realistic scene that did not occur", "AI generated music"] },
        { name: "Select No", tagline: "no disclosure", points: ["Script, title or thumbnail help", "Beauty, colour and lighting filters", "Your own cloned voice", "Clearly unrealistic or animated"] },
      ],
      note: "Source: YouTube Help, \"Disclosing use of GenAI content\". Neither list is exhaustive.",
    },
    {
      file: "youtube-ai-label-placement.webp", type: "picks",
      title: "Where the AI label appears",
      sub: "Placement depends on the content. YouTube can also apply the label itself.",
      picks: [
        { name: "On the player", tagline: "may appear", points: ["AI-generated music", "Photorealistic content"] },
        { name: "In the description", tagline: "expanded view", points: ["Non-music AI audio", "Non-photorealistic or animated", "\"How this content was made\""] },
        { name: "Applied by YouTube", tagline: "automatic", points: ["Made with YouTube's GenAI tools", "Contains C2PA metadata", "Detected by internal systems"] },
      ],
      note: "Source: YouTube Help, \"Disclosing use of GenAI content\" and \"How this content was made\" disclosures.",
    },
  ],
};
