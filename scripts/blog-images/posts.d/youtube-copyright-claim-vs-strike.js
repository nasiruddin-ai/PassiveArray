module.exports = {
  cover: {
    kicker: "Copyright",
    title: "Copyright claim *vs* strike",
    sub: "What each does to your video and channel, and how to dispute or resolve both.",
    size: 66,
    visual: { type: "vs", sides: [
      { name: "Content ID claim", tagline: "Automatic match", points: ["Video usually stays up", "Owner can take the ad revenue", "Channel not affected"] },
      { name: "Copyright strike", tagline: "Legal takedown request", points: ["Video taken down", "Lasts 90 days", "Three in 90 days can end the channel"] },
    ] },
  },
  figures: [
    {
      file: "content-id-dispute-process.webp", type: "flow",
      title: "How a Content ID *dispute* runs",
      sub: "Dispute only when you are confident: a rejected appeal can turn into a takedown and a strike.",
      steps: [
        { title: "Dispute", text: "In YouTube Studio, under Content, then the Restrictions column.", you: "Within 5 days, revenue is held from the claim date." },
        { title: "30-day reply", text: "The claimant has 30 days to respond. If they do not, the claim expires." },
        { title: "Appeal", text: "If they reject your dispute, you may be able to appeal." },
        { title: "7-day reply", text: "They have 7 days to respond. Held revenue goes to whoever wins." },
      ],
      note: "Based on YouTube's Content ID dispute process, as described in this guide.",
    },
    {
      file: "ways-to-resolve-a-copyright-strike.webp", type: "picks",
      title: "How to *resolve* or avoid a strike",
      sub: "Three ways out of a strike, and one way to avoid it.",
      picks: [
        { name: "Wait 90 days", tagline: "the default", points: ["Complete Copyright School first", "The strike then expires after 90 days"] },
        { name: "Ask for a retraction", tagline: "often quickest", points: ["You know the owner, used it by mistake, or can agree a licence"] },
        { name: "Counter notification", tagline: "legal process", points: ["Only if removed by mistake or it is fair use", "Your details go to the claimant, who can sue"] },
        { name: "7-day warning", tagline: "scheduled removal", points: ["Remove or edit the video within 7 days", "That avoids the strike"] },
      ],
      note: "Based on YouTube's copyright strike rules, as described in this guide.",
    },
  ],
};
