module.exports = {
  cover: {
    kicker: "Instagram",
    title: "Instagram bios that get *follows*",
    sub: "A four-line formula for 150 characters, with examples for every account type.",
    size: 62,
    visual: { type: "shot", src: "instagram-bio-ideas--bios.png", label: "Instagram Bio Generator", tag: "Free, no account", style: "height:400px;object-fit:cover;object-position:top" },
  },
  figures: [
    {
      file: "instagram-bio-rules.webp", type: "picks",
      title: "What Instagram allows in a bio",
      sub: "Instagram's own rules, before you write a word.",
      picks: [
        { name: "150 characters", tagline: "bio text", points: ["Spaces, emoji and line breaks all count"] },
        { name: "5 links", tagline: "own field", points: ["Added under Edit profile > Links; the first is most visible"] },
        { name: "@ and #", tagline: "tappable", points: ["Become links to that profile or hashtag page"] },
        { name: "Searchable", tagline: "name, username, bio", points: ["Matched against what people type in Search"] },
      ],
      note: "Sources: Instagram Help Center; Instagram announcement, 2018; Instagram search explainer, 2021.",
    },
    {
      file: "four-line-bio-formula.webp", type: "flow",
      title: "The four-line bio formula",
      sub: "You need all four jobs done. Example: a quick vegetarian dinners account.",
      steps: [
        { title: "What you post", text: "The topic, in words people search for.", you: "Vegetarian dinners in 20 minutes" },
        { title: "Who it is for", text: "Turns a description into a reason to follow.", you: "for people who hate washing up" },
        { title: "Proof", text: "One fact that earns trust, or one line that sounds like you.", you: "Ex-restaurant cook" },
        { title: "Next step", text: "What to do now. Point it at your first link.", you: "Free 7-day meal plan below" },
      ],
      note: "Example from this guide, about 110 characters in total.",
    },
  ],
};
