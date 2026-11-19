module.exports = {
  cover: {
    kicker: "Growth",
    title: "YouTube *end screens*, explained",
    sub: "The rules, the elements and how to add one in YouTube Studio.",
    size: 64,
    visual: { type: "stats", items: [
      { big: "5–20 s", label: "at the end of the video", note: "Videos must be at least 25 seconds long" },
      { big: "4", label: "elements at most", note: "On a standard 16:9 video, per YouTube Help" },
    ] },
  },
  figures: [
    {
      file: "youtube-end-screen-elements.webp", type: "picks",
      title: "What an end screen can show",
      sub: "Up to four elements on a 16:9 video, in the last 5 to 20 seconds.",
      picks: [
        { name: "Video or playlist", tagline: "three video modes", points: ["Most recent upload or best for viewer", "Or a specific video or playlist"] },
        { name: "Subscribe", tagline: "your channel", points: ["Encourages subscriptions", "To your own channel only"] },
        { name: "Channel", tagline: "another channel", points: ["Promote another channel", "With a custom message"] },
        { name: "Link", tagline: "Partner Program only", points: ["An external website", "Must follow YouTube's policies"] },
      ],
      note: "Source: YouTube Help, \"Add end screens to videos\".",
    },
    {
      file: "add-youtube-end-screen-steps.webp", type: "flow",
      title: "How to add an end screen",
      sub: "YouTube Help's steps, in YouTube Studio on a computer.",
      steps: [
        { title: "Content", text: "Sign in to YouTube Studio and open Content from the left menu." },
        { title: "Editor", text: "Click the video, then select Editor from the left menu." },
        { title: "End screen", text: "Apply a template or add elements, then place and time each one." },
        { title: "Save", text: "Press play on the preview, then click Save." },
      ],
      note: "Source: YouTube Help, \"Add end screens to videos\".",
    },
  ],
};
