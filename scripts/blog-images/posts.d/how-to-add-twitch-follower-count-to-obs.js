module.exports = {
  cover: {
    kicker: "Twitch + OBS",
    title: "Add a *Twitch* follower count to OBS",
    sub: "Streamlabs and StreamElements, step by step, plus fixes for wrong counts.",
    size: 58,
    visual: { type: "shot", src: "how-to-add-twitch-follower-count-to-obs--follower-count.png", label: "Twitch Follower Count Checker", tag: "Free, no sign-in", style: "height:290px;object-fit:cover;object-position:top" },
  },
  figures: [
    {
      file: "twitch-follower-count-obs-browser-source.webp", type: "flow",
      title: "How a follower count gets into OBS",
      sub: "OBS has no built-in Twitch counter. Every method ends in a Browser Source.",
      steps: [
        { title: "Create a widget", text: "A follower goal in Streamlabs, or a widget in a StreamElements overlay.", you: "Sign in with Twitch so it reads your followers." },
        { title: "Copy the URL", text: "The widget URL, or the overlay URL from the address bar.", you: "Keep it private: never show it on stream." },
        { title: "Add a Browser Source", text: "Sources > + > Browser, paste the URL, set width and height.", you: "1920 by 1080 for a full StreamElements overlay." },
      ],
      note: "Sources: Streamlabs and StreamElements follower goal guides, OBS knowledge base.",
    },
    { file: "twitch-follower-tracker-daily-history.webp", type: "shot", src: "how-to-add-twitch-follower-count-to-obs--follower-tracker.png", maxHeight: 990 },
  ],
};
