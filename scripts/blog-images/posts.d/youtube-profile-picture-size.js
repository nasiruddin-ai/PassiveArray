module.exports = {
  cover: {
    kicker: "YouTube SEO",
    title: "YouTube *profile picture* size",
    sub: "Square, simple and readable at the size YouTube shows it.",
    size: 60,
    visual: { type: "stats", items: [
      { big: "98 x 98", label: "pixels, the size it renders at", note: "Square image; JPG, GIF, BMP or PNG, per YouTube Help" },
      { big: "15 MB", label: "maximum file size", note: "No animated GIFs, per YouTube Help" },
    ] },
  },
  figures: [
    {
      file: "profile-picture-where-it-appears.webp", type: "picks",
      title: "Where your *profile picture* appears",
      sub: "It follows you around YouTube, often at a very small size.",
      picks: [
        { name: "Channel page", tagline: "your channel", points: ["Shown on your channel page", "Match it to your banner"] },
        { name: "Videos", tagline: "your uploads", points: ["Shown next to your videos", "Bottom right in most playback modes"] },
        { name: "Comments", tagline: "very small", points: ["Next to every comment you post", "Shown very small"] },
      ],
      note: "Source: YouTube Help, \"Manage your channel branding\" and \"Channel banner & profile picture tips\".",
    },
    {
      file: "profile-picture-change-steps.webp", type: "flow",
      title: "Change your picture in YouTube Studio",
      sub: "On a computer. It may take a few minutes to update across YouTube.",
      steps: [
        { title: "Sign in", text: "Open YouTube Studio on a computer." },
        { title: "Profile", text: "From the left menu, select Customization, then Profile." },
        { title: "Crop", text: "Click CHANGE, pick an image or illustration, crop it, click DONE.", you: "Keep the subject clear of the edges." },
        { title: "Publish", text: "Click PUBLISH." },
      ],
      note: "Source: YouTube Help, \"Manage your channel branding\" (computer).",
    },
  ],
};
