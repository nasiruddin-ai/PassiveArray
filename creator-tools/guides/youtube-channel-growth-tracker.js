// Guide and FAQ for /creator-tools/youtube-channel-growth-tracker/. Merged into tools.js by build-tools.js.
// Facts checked against lib/history.js (daily points, 400-day retention, tracking cap),
// lib/watch.js snapshotIds (channels.list statistics, 05:45 UTC cron) and COMPUTE in public/shared.js.
module.exports = {
  seoTitle: "YouTube Channel Growth Tracker: Free Subscriber & View History | Passive Array",
  seoDescription: "Track any YouTube channel's subscribers and views day by day. Free growth charts, 7 and 30-day change and a CSV of the history. No sign-up.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this YouTube growth tracker shows",
      p: ["Enter any public channel and you get its live numbers plus every daily point Passive Array has stored for it:"],
      list: [
        "<b>A subscriber chart</b> and <b>a total views chart</b>, one point per day.",
        "<b>Views gained per day</b>, the difference between recorded days, as bars.",
        "<b>7 and 30-day change</b> in subscribers, views and uploads, each labelled with the date it is measured from.",
        "<b>A daily table</b> of the last 30 points and a <b>CSV download</b> of the full history for your own spreadsheet.",
      ],
    },
    {
      h: "How the history is built",
      p: [
        "YouTube does not publish a public history of any channel's numbers. The only way to see growth over time is to record the numbers every day, and that is what this tracker does.",
        "The first time anyone looks up a channel here, it joins a daily tracking list. Every day around 05:45 UTC the public subscriber count, total views and video count are read from the official YouTube Data API and saved. Points are kept for 400 days.",
        "So the chart starts on the day the channel was first tracked. Nothing before that is backfilled, estimated or modelled. If a channel was already in our <a href=\"../../research/\">research index</a> or someone's watchlist, you may see a few weeks of history on your very first lookup.",
      ],
    },
    {
      h: "Why views are the better growth signal",
      p: [
        "YouTube rounds public subscriber counts to three significant figures for channels with 1,000 or more subscribers. A channel with 1,234,567 subscribers is shown as 1,230,000 everywhere, including the API every outside tool uses. On a big channel the subscriber line therefore moves in steps of thousands, and a flat day does not mean no one subscribed.",
        "Total views are not rounded. That makes <b>views gained per day</b> the most precise growth figure any outside tool can give you. A steady or rising bar means older videos keep getting found; a sudden spike usually means one upload took off. Our <a href=\"../../blog/how-to-check-any-youtube-channel-stats/\">guide to checking any channel's stats</a> explains the other public numbers.",
      ],
    },
    {
      h: "Ways to use it",
      list: [
        "<b>Track your own channel</b> and see whether a change in upload schedule or format shows up in daily views.",
        "<b>Follow competitors</b> in your niche and spot when one of them starts growing faster.",
        "<b>Check a creator before a sponsorship</b>: a smooth line is a good sign, a single overnight jump in subscribers deserves a closer look.",
        "<b>Save the CSV</b> each month to build a longer record of your own.",
      ],
      after: ["Signed-in members can also keep a <a href=\"../../account/\">watchlist</a> with 7 and 30-day change for several channels on one page."],
    },
  ],
  faq: [
    ["Is this tracker free?", "Yes. Looking up a channel, the charts and the CSV download are free and need no account."],
    ["Can I see a channel's subscriber history from before I tracked it?", "Only if Passive Array already recorded it, for example because someone else looked it up or it is in our research index. We do not backfill or estimate past numbers, because no public source publishes them."],
    ["How often is the data updated?", "Once a day, around 05:45 UTC. Looking a channel up also records that day's point if it is not stored yet."],
    ["Why does the subscriber count not change every day?", "YouTube rounds public subscriber counts to three significant figures, so the number only moves when a channel crosses the next rounding step. Total views are exact, so use views gained per day for day-to-day growth."],
    ["Does it work for channels with hidden subscribers?", "Yes for views and uploads. The subscriber chart stays empty because the channel hides that number from everyone."],
    ["Is there a limit to how many channels are tracked?", "The daily list has a cap to stay within YouTube's free API quota. If it is full, a channel still gets a point each time someone looks it up, and the page tells you so."],
  ],
};
