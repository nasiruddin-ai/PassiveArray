module.exports = {
  cover: {
    kicker: "Earnings",
    title: "Do you need a YouTube *MCN*?",
    sub: "What networks do, what they cost, what to check, and how to leave one.",
    size: 64,
    visual: { type: "vs", sides: [
      { name: "May help", tagline: "when you need", points: ["Rights help for reuploads", "A sales team for brand deals", "Financing"] },
      { name: "Not needed", tagline: "probably, when", points: ["Already in the Partner Program", "You sell your own sponsorships", "Content not reuploaded"] },
    ] },
  },
  figures: [
    {
      file: "how-mcn-revenue-share-works.webp", type: "flow",
      title: "Where an MCN's cut comes from",
      sub: "Joining a network does not change YouTube's revenue share.",
      steps: [
        { title: "YouTube pays", text: "Your usual creator share, the same as without a network." },
        { title: "MCN takes a cut", text: "A percentage of the creator's portion, set by the contract.", you: "Varies by network and channel size" },
        { title: "You receive", text: "What is left after the network's percentage.", you: "Are the services worth the cut?" },
      ],
      note: "Source: YouTube Help on multi-channel networks.",
    },
    {
      file: "how-to-leave-an-mcn.webp", type: "flow",
      title: "How to leave an MCN in YouTube Studio",
      sub: "This removes the network's access. It does not cancel your contract.",
      steps: [
        { title: "Find the card", text: "Open YouTube Studio and go to the Network relationship card." },
        { title: "Leave", text: "Choose Remove access, then Leave network." },
        { title: "30 days", text: "The MCN has 30 days to respond. If it does not, access is removed automatically." },
      ],
      note: "Source: YouTube Help. Read your contract's termination section before you leave.",
    },
  ],
};
