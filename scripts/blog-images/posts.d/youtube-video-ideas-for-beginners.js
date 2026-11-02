module.exports = {
  cover: {
    kicker: "Growth",
    title: "Video ideas people *want* to watch",
    sub: "Six free ways to find ideas, how to judge them, and 60 beginner ideas.",
    size: 62,
    visual: { type: "shot", src: "youtube-video-ideas-for-beginners--ideas.png", label: "YouTube Video Ideas Generator", tag: "Free, no account", style: "height:400px;object-fit:cover;object-position:top" },
  },
  figures: [
    { file: "keyword-generator-sourdough.webp", type: "shot", src: "youtube-video-ideas-for-beginners--keywords.png", maxHeight: 760 },
    {
      file: "topic-to-video-idea.webp", type: "flow",
      title: "Turn a *topic* into a video idea",
      sub: "\"Coffee\" is a topic. Add these four things and it becomes a video someone would click.",
      steps: [
        { title: "Who it is for", text: "Name the viewer.", you: "...for students, for beginners, for small kitchens" },
        { title: "A result", text: "Say what they will get.", you: "...that tastes like a cafe latte" },
        { title: "A constraint", text: "Add a limit that makes it specific.", you: "...without a machine, under $20, in 5 minutes" },
        { title: "A format", text: "Pick how you will show it.", you: "Step by step, I tried, ranked, vs, mistakes" },
      ],
      note: "Examples from this guide's own table.",
    },
    {
      file: "score-video-ideas-example.webp", type: "picks",
      title: "Example: score ideas before you film",
      sub: "Rate demand, competition and your ability from 1 to 3. Film the highest total first.",
      picks: [
        { name: "Rice without a rice cooker", tagline: "total 8 of 9", points: ["Demand 3: it appears in search suggestions", "Competition 2: mixed results", "Ability 3: can film it this week"] },
        { name: "Ultimate guide to Japanese cuisine", tagline: "total 4 of 9", points: ["Demand 2", "Competition 1", "Ability 1"] },
      ],
      note: "Example scores from this guide. The scoring method is ours, not a YouTube rule.",
    },
  ],
};
