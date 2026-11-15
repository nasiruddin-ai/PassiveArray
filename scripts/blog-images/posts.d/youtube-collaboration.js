module.exports = {
  cover: {
    kicker: "Growth",
    title: "YouTube *collaboration*, explained",
    sub: "What Help confirms about the Collaborations feature, and what it leaves out.",
    size: 62,
    visual: { type: "vs", sides: [
      { name: "Confirmed", tagline: "stated in YouTube Help", points: ["Up to 10 collaborators", "Long-form videos and Shorts", "Revenue is not split"] },
      { name: "Not stated", tagline: "check your own Studio", points: ["Eligibility rules", "Analytics for collaborators", "Adding after publishing"] },
    ] },
  },
  figures: [
    {
      file: "add-a-collaborator-steps.webp", type: "flow",
      title: "How to add a collaborator",
      sub: "The upload steps on a computer. Names appear only after the collaborator accepts.",
      steps: [
        { title: "Create", text: "Sign in to YouTube Studio, start an upload from Create and select your file." },
        { title: "Show more", text: "In the Details section, under Audience, click Show more." },
        { title: "Invite", text: "Under Collaboration, click Invite a collaborator." },
        { title: "Accept", text: "Their name and a subscribe button show once they accept." },
      ],
      note: "Source: YouTube Help, \"Invite collaborators to your video\".",
    },
    {
      file: "three-ways-to-collab.webp", type: "picks",
      title: "Three ways to run a collab",
      sub: "The Collaborations feature is one option. The older methods still work.",
      picks: [
        { name: "Collaborators", tagline: "one shared video", points: ["Name and subscribe button per collaborator", "Revenue stays with the posting channel"] },
        { name: "Two videos", tagline: "one on each channel", points: ["Linked with cards, mentions and descriptions", "Each channel has its own video"] },
        { name: "Go Live Together", tagline: "live streams", points: ["One guest at a time", "Ads attributed to the host channel"] },
      ],
      note: "Source: YouTube Help, \"Invite collaborators to your video\", \"Collaboration tips\" and Go Live Together.",
    },
  ],
};
