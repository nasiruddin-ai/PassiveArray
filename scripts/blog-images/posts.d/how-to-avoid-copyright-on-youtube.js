module.exports = {
  cover: {
    kicker: "Growth",
    title: "How to *avoid copyright* on YouTube",
    sub: "What you can safely use, the Checks step, and the myths that do not protect a video.",
    size: 60,
    visual: { type: "vs", sides: [
      { name: "Safe sources", tagline: "listed by YouTube Help", points: ["Your own original work", "Audio Library music", "CC BY with credit"] },
      { name: "Myths", tagline: "no protection", points: ["I gave credit", "It is under 10 seconds", "I bought it"] },
    ] },
  },
  figures: [
    {
      file: "what-you-can-use-on-youtube.webp", type: "picks",
      title: "What you can *safely* use",
      sub: "None of these options guarantee avoiding a claim. Each has a condition.",
      picks: [
        { name: "Your own work", tagline: "safest", points: ["Every element must be yours", "Check the background audio"] },
        { name: "Permission", tagline: "a licence", points: ["Buying is not licensing", "Keep the licence and receipt"] },
        { name: "Creative Commons", tagline: "CC BY", points: ["Give credit (attribution)", "Title, author, source, licence"] },
        { name: "Public domain", tagline: "verify it", points: ["Your responsibility to verify", "No official list of works"] },
      ],
      note: "Source: YouTube Help, \"Copyright on YouTube\", \"License types on YouTube\" and \"Common copyright myths\".",
    },
    {
      file: "fix-a-copyright-claim.webp", type: "flow",
      title: "Four ways to clear a *claim* in Studio",
      sub: "The three edits remove the claim automatically if they succeed. Edits cannot be reverted.",
      steps: [
        { title: "Trim out segment", text: "Cuts the claimed part from the video.", you: "The whole claimed part has to go." },
        { title: "Erase song", text: "Mutes the claimed song, or all audio in that segment." },
        { title: "Replace song", text: "Swaps the audio for an Audio Library track." },
        { title: "Dispute", text: "Asks the claimant to release the claim.", you: "Only with a valid reason." },
      ],
      note: "Source: YouTube Help, \"Remove copyright-claimed content from videos\" and \"Dispute a copyright claim\".",
    },
  ],
};
