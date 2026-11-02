module.exports = {
  cover: {
    kicker: "TikTok",
    title: "Track TikTok followers *free*",
    sub: "Where TikTok shows your history, and a weekly log for any account.",
    size: 64,
    visual: { type: "shot", src: "how-to-track-tiktok-followers--audit.png", label: "TikTok Account Audit", tag: "Example numbers", style: "height:400px;object-fit:cover;object-position:left top" },
  },
  figures: [
    {
      file: "weekly-tiktok-follower-log.webp", type: "flow",
      title: "A weekly follower log in four steps",
      sub: "Works for any public account. About five minutes a week per account.",
      steps: [
        { title: "Fixed day", text: "Same day each week, roughly the same hour, so gaps are equal." },
        { title: "Profile numbers", text: "Note followers and total likes from the top of the profile." },
        { title: "Last 12 videos", text: "Average views, likes, comments and shares. Skip pinned videos." },
        { title: "Growth %", text: "This week minus last week, divided by last week, times 100." },
      ],
      note: "Our method. Profiles round large counts, so track monthly past about 100,000 followers.",
    },
    {
      file: "tiktok-weekly-follower-gains-example.webp", type: "bars",
      title: "Example: weekly follower gains",
      sub: "A cooking account growing from 8,200 to 9,420 followers in four weeks (14.9%).",
      bars: [
        { label: "Week 1 (60,000 views)", value: 250, display: "+250 (3.0%)" },
        { label: "Week 2 (45,000 views)", value: 160, display: "+160 (1.9%)" },
        { label: "Week 3 (410,000 views)", value: 690, display: "+690 (8.0%)", hi: true },
        { label: "Week 4 (52,000 views)", value: 120, display: "+120 (1.3%)" },
      ],
      note: "Example numbers, not real data. Week 3 converted 1.7 followers per 1,000 views; week 1 about 4.2.",
    },
  ],
};
