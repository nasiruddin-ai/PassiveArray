module.exports = {
  cover: {
    kicker: "Growth",
    title: "YouTube *Content ID*: how it works",
    sub: "How matching works, who qualifies, and what a claim does to revenue.",
    size: 64,
    visual: { type: "stats", items: [
      { big: "3", label: "actions an owner can choose for a match", note: "Block, monetize or track" },
      { big: "5 days", label: "to dispute with revenue held from the claim date", note: "Per YouTube Help, monetization during disputes" },
    ] },
  },
  figures: [
    {
      file: "how-content-id-works.webp", type: "flow",
      title: "How *Content ID* works",
      sub: "The four steps YouTube describes. It does not publish the technical detail.",
      steps: [
        { title: "Reference files", text: "Owners submit audio and visual files to a database." },
        { title: "Scan", text: "Every upload is automatically scanned by Content ID." },
        { title: "Match", text: "A matching video, or a segment of it, gets a Content ID claim." },
        { title: "Policy", text: "The owner's setting applies: block, monetize or track." },
      ],
      note: "Source: YouTube Help, \"How Content ID works\".",
    },
    {
      file: "youtube-copyright-tools.webp", type: "picks",
      title: "YouTube's four *copyright tools*",
      sub: "From occasional uploaders to established media companies.",
      picks: [
        { name: "Removal request form", tagline: "any copyright owner", points: ["Requests removal of a video", "A legal process"] },
        { name: "Copyright Match Tool", tagline: "after a valid removal request", points: ["Finds full reuploads of your videos", "You review each match"] },
        { name: "Enterprise Match Tool", tagline: "many valid requests", points: ["Adds search", "Removal for many videos at once"] },
        { name: "Content ID", tagline: "specific criteria", points: ["Automatic claims", "Block, monetize or track"] },
      ],
      note: "Source: YouTube Help, \"About YouTube's copyright management tools\".",
    },
  ],
};
