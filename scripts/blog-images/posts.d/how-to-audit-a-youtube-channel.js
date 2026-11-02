module.exports = {
  cover: {
    kicker: "Audit",
    title: "Audit any *YouTube* channel",
    sub: "Studio checks for yours, public checks for anyone's, and a 20-point score.",
    size: 64,
    visual: { type: "shot", src: "how-to-audit-a-youtube-channel--quality-checker.png", label: "YouTube Channel Quality Checker", tag: "Free, no account" },
  },
  figures: [
    { file: "youtube-channel-quality-checker-youtube-creators.webp", type: "shot", src: "how-to-audit-a-youtube-channel--quality-checker.png" },
    {
      file: "youtube-channel-audit-score-bands.webp", type: "picks",
      title: "What your audit score means",
      sub: "Add up the 10 lines, each scored 0, 1 or 2, for a score out of 20.",
      picks: [
        { name: "16 to 20", tagline: "healthy", points: ["A healthy channel with small fixes"] },
        { name: "10 to 15", tagline: "one or two problems", points: ["One or two clear problems to work on"] },
        { name: "Under 10", tagline: "rethink first", points: ["Rethink format or focus before anything else"] },
        { name: "In 90 days", tagline: "repeat", points: ["Audit again and compare line by line"] },
      ],
      note: "Our suggested rough guide, not YouTube's.",
    },
  ],
};
