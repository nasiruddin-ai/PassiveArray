module.exports = {
  cover: {
    kicker: "For brands",
    title: "YouTube for *small business*",
    sub: "From an empty account to your first ten videos, with the settings that matter.",
    size: 64,
    visual: { type: "vs", sides: [
      { name: "Personal channel", tagline: "only you manage", points: ["Profile picture, name and handle", "Invite staff with channel permissions", "No shared password"] },
      { name: "Brand Account", tagline: "business or other name", points: ["Multiple owners and managers", "One primary owner", "Help says switch to permissions"] },
    ] },
  },
  figures: [
    {
      file: "business-channel-account-choice.webp", type: "picks",
      title: "Who can do what on your channel",
      sub: "Invite people by email with a role. Invitations expire after 30 days.",
      picks: [
        { name: "Owner", tagline: "the business owner", points: ["Everything, including deleting the channel", "Manages permissions"] },
        { name: "Manager", tagline: "trusted partner", points: ["Edits details, publishes and deletes content", "Cannot delete the channel"] },
        { name: "Editor", tagline: "staff or freelancer", points: ["Uploads and publishes", "Limited version hides revenue data"] },
        { name: "Viewer", tagline: "read only", points: ["Views channel details", "No editing"] },
      ],
      note: "Source: YouTube Help, \"Add or remove access to your YouTube channel\".",
    },
    {
      file: "first-ten-business-videos.webp", type: "bars",
      title: "A first ten videos for a small business",
      sub: "Answer the questions customers already ask before they buy.",
      bars: [
        { label: "How-to videos", value: 3, display: "3 videos", hi: true },
        { label: "FAQ videos", value: 3, display: "3 videos", hi: true },
        { label: "Demonstrations", value: 2, display: "2 videos" },
        { label: "Introduction", value: 1, display: "1 video" },
        { label: "Customer story", value: 1, display: "1 video" },
      ],
      note: "A suggested plan from this guide, not a YouTube requirement.",
    },
  ],
};
