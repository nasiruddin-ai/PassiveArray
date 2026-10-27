// Guide and FAQ for /creator-tools/twitch-follower-tracker/. Merged into tools.js by build-tools.js.
// Facts checked against lib/growth.js (helix channels/followers total, daily cron) and lib/history.js.
module.exports = {
  seoTitle: "Twitch Follower Tracker: Free Daily Follower History | Passive Array",
  seoDescription: "Track any Twitch streamer's followers day by day. Free follower chart, gains per day, 7, 30 and 90-day change and a CSV download. No sign-up.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this Twitch follower tracker shows",
      list: [
        "<b>The current follower total</b>, read live from the official Twitch Helix API.",
        "<b>A follower chart</b> with one point per day, and <b>followers gained per day</b> as bars.",
        "<b>7, 30 and 90-day change</b>, each labelled with the date it is measured from.",
        "<b>A daily table</b> and a <b>CSV download</b> of every stored point.",
      ],
    },
    {
      h: "How the follower history is built",
      p: [
        "Twitch shows a follower total but no public history. The first time a streamer is looked up here, they join a daily tracking list, and each day their follower total is read from the Helix API and stored for 400 days.",
        "History starts on that first day. Nothing earlier is backfilled or estimated. Unlike YouTube, Twitch publishes exact follower totals, so every change on the chart is real, down to a single follower.",
      ],
    },
    {
      h: "Reading the chart",
      p: [
        "Follower growth on Twitch tends to come in bursts: a raid, a big collaboration, a clip that spreads or a first stream in a new category. Daily bars make those days easy to spot, and the 30 and 90-day figures show whether a channel is growing between bursts.",
        "A drop is possible too. Followers can unfollow at any time, and Twitch removes closed or banned accounts from totals. For a one-off snapshot without history, use the <a href=\"../twitch-follower-count-checker/\">Twitch follower count checker</a>; to put two streamers side by side, use the <a href=\"../twitch-channel-comparison/\">Twitch channel comparison</a>.",
      ],
    },
  ],
  faq: [
    ["Can I see follower history from before I tracked a streamer?", "Only from the day Passive Array first recorded the channel. No public source publishes earlier daily follower totals, so we do not invent them."],
    ["How often is it updated?", "Once a day. Looking a channel up also records that day's point if it is not stored yet."],
    ["Are the follower counts exact?", "Yes. The Twitch API returns the exact follower total, so daily changes are exact as well."],
    ["Does it show viewer or subscriber history?", "No. Twitch keeps paid subscriber counts private and viewer counts only exist while a stream is live, so the tracker records followers only."],
  ],
};
