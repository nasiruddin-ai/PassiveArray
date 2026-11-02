module.exports = {
  cover: {
    kicker: "Growth",
    title: "Write a YouTube *script* that holds",
    sub: "A five-part template with timings, a worked example and Shorts scripts.",
    size: 62,
    visual: { type: "shot", src: "how-to-write-a-youtube-script--outline.png", label: "YouTube Script Outline Generator", tag: "Free, no account", style: "height:400px;object-fit:cover;object-position:top" },
  },
  figures: [
    {
      file: "youtube-script-template-timings.webp", type: "bars",
      title: "Script template: a 10-minute video",
      sub: "Share of the video for each part. The hook stays short at any length.",
      bars: [
        { label: "1. Hook (5%)", value: 5, display: "0:00 to 0:30", hi: true },
        { label: "2. Setup (5%)", value: 5, display: "0:30 to 1:00" },
        { label: "3. Main points (75%)", value: 75, display: "1:00 to 8:30" },
        { label: "4. Payoff (10%)", value: 10, display: "8:30 to 9:30" },
        { label: "5. Close (5%)", value: 5, display: "9:30 to 10:00" },
      ],
      note: "Our suggested timings for a 10-minute explainer, not a YouTube rule.",
    },
    {
      file: "youtube-shorts-script.webp", type: "flow",
      title: "How to script a YouTube Short",
      sub: "Usually 3 to 8 lines. Viewers swipe, so the first second does the thumbnail's job.",
      steps: [
        { title: "Seconds 0 to 2", text: "The hook: the point or the result, said and shown at once." },
        { title: "The middle", text: "One idea: one tip, one step, one reveal. Cut every word not needed." },
        { title: "The end", text: "A loop that makes rewatching natural, or a pointer to the full video." },
      ],
      note: "Shorts can be up to three minutes long, per YouTube Help.",
    },
  ],
};
