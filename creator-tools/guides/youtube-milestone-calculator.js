// Long-form guide for /creator-tools/youtube-milestone-calculator/. Matches COMPUTE["youtube-milestone-calculator"]:
// next subscriber milestones, days = needed / daily gain (recorded history from action "history", or a typed rate).
module.exports = {
  seoTitle: "YouTube Milestone Calculator: When Will a Channel Hit 1K, 100K, 1M? | Passive Array",
  seoDescription: "Free YouTube milestone calculator. See any channel's next subscriber milestones, how many subscribers away each is, and an estimated date at its measured pace.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "How to see a channel's next milestones",
      ordered: true,
      list: [
        "Paste the channel's link or @handle.",
        "Leave the daily figure empty to use the channel's recorded growth, or type your own from YouTube Studio.",
        "Read the next five milestones, the subscribers still needed and the estimated date for each.",
      ],
    },
    {
      h: "How the date is estimated",
      p: [
        "<b>Days to go = subscribers still needed / subscribers gained per day.</b> A channel with 8,200 subscribers gaining 30 a day needs 1,800 more for 10,000, which is 60 days.",
        "The daily figure comes from Passive Array's own daily record of the channel. The first lookup puts a channel on the tracking list, so a new channel needs a few days before there is a pace to measure. Nothing earlier is backfilled or guessed.",
      ],
    },
    {
      h: "Milestones that unlock something",
      table: {
        head: ["Subscribers", "What it is tied to"],
        rows: [
          ["500", "Subscriber threshold for the expanded Partner Program, with other conditions"],
          ["1,000", "Subscriber threshold for the full Partner Program, with watch hours or Shorts views"],
          ["100,000", "Silver Creator Award level"],
          ["1,000,000", "Gold Creator Award level"],
          ["10,000,000", "Diamond Creator Award level"],
        ],
      },
      p: ["Subscribers alone do not qualify a channel for the Partner Program. The <a href=\"../../blog/youtube-monetization-requirements/\">monetization requirements guide</a> has the watch hours and Shorts views that go with each threshold, and <a href=\"../../blog/youtube-play-button-levels/\">YouTube play button levels</a> covers the awards."],
    },
    {
      h: "Why the date will move",
      list: [
        "<b>Growth is not steady.</b> One video that takes off can bring a month of subscribers in a day.",
        "<b>YouTube rounds public counts.</b> The public number moves in steps, so a milestone can show a little late.",
        "<b>A short history is noisy.</b> A pace measured over three days says less than one measured over thirty. The <a href=\"../youtube-channel-growth-tracker/\">growth tracker</a> shows the full recorded history.",
      ],
    },
  ],
  faq: [
    ["How long does it take to get 1,000 subscribers on YouTube?", "It depends entirely on the channel's pace. Divide the subscribers still needed by the subscribers gained per day. The calculator does this with the channel's recorded growth or a figure you enter."],
    ["Where does the daily growth figure come from?", "From Passive Array's own daily record of the channel's public subscriber count, starting the day it was first looked up. You can also type the figure from your YouTube Studio."],
    ["Why does it say there is not enough history?", "The channel has been on our tracking list for under three days. It is tracked from now on, so the pace appears after a few days. Until then, enter a daily figure yourself."],
    ["Is the estimated date accurate?", "It is arithmetic, not a forecast. It assumes the current pace continues, which it rarely does for long, so treat it as a rough marker."],
  ],
};
