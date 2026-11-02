module.exports = {
  cover: {
    kicker: "Hashtags",
    title: "Do Instagram *hashtags* still work?",
    sub: "The 5-hashtag rule, what tags really do and how to choose your five.",
    size: 64,
    visual: { type: "stats", items: [
      { big: "5", label: "hashtags per post or Reel, since December 2025", note: "Instagram Help Center and @creators on Threads" },
      { big: "30", label: "the limit before that, for years", note: "Today a post with more than 5 tags won't post" },
    ] },
  },
  figures: [
    {
      file: "what-instagram-hashtags-do.webp", type: "picks",
      title: "What hashtags do, and do not do",
      sub: "A hashtag labels a post. It is not a reach multiplier.",
      picks: [
        { name: "They do", tagline: "labelling", points: ["Help Search match your post", "Put the post on the hashtag's page, if your account is public", "Help reach when relevant to the post"] },
        { name: "They do not", tagline: "reach", points: ["Make Instagram show your post to more followers", "Help when irrelevant: they can backfire", "Show a private account's posts on hashtag pages"] },
      ],
      note: "Sources: Instagram Search and ranking explainers (Adam Mosseri), Instagram for Creators FAQ, Instagram Help Center.",
    },
    { file: "instagram-hashtag-generator-five.webp", type: "shot", src: "do-instagram-hashtags-still-work--generator.png", maxHeight: 460 },
  ],
};
