// Long-form guide for /creator-tools/youtube-upload-schedule-checker/. Matches COMPUTE["youtube-upload-schedule-checker"]:
// publish times of the newest 100 uploads, grouped by weekday and hour in the browser's time zone.
module.exports = {
  seoTitle: "YouTube Upload Schedule Checker: When Does a Channel Post? | Passive Array",
  seoDescription: "Free tool to see when any YouTube channel uploads: its most common days and hours in your time zone, uploads per week and the share of Shorts.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "How to check a channel's upload schedule",
      ordered: true,
      list: [
        "Paste the channel's link or @handle.",
        "Read the most common upload day and hour, shown in your own time zone.",
        "Use the weekday bars and the hour table to see how regular the schedule is.",
      ],
    },
    {
      h: "What the result shows",
      table: {
        head: ["Figure", "How it is worked out"],
        rows: [
          ["Most common day and hour", "Counted from the publish times of the newest 100 uploads"],
          ["Uploads per week", "Uploads divided by the weeks between the oldest and newest of them"],
          ["Shorts-length uploads", "Videos of 3 minutes or less; a length test, since YouTube does not label Shorts in public data"],
        ],
      },
      p: ["A scheduled or premiered video shows the moment it went public, which is the time that matters for a schedule."],
    },
    {
      h: "What it does not show",
      p: [
        "It shows when a channel publishes, not when its viewers are watching. The two are related only if the channel chose its times well.",
        "Your own best time is in YouTube Studio's audience report, which shows when your viewers are on YouTube. Our guide to the <a href=\"../../blog/best-time-to-post-on-youtube/\">best time to post on YouTube</a> explains how to read it.",
      ],
    },
    {
      h: "Using a competitor's schedule",
      list: [
        "<b>Look for consistency.</b> A channel that posts on the same two days every week has trained its viewers to expect it.",
        "<b>Compare a few channels.</b> If several channels in your niche publish on the same day, that tells you when the audience is used to new videos.",
        "<b>Go further.</b> Export the same videos with the <a href=\"../youtube-channel-video-exporter/\">channel video exporter</a> to see which of them performed.",
      ],
      p: ["This is our advice, not a YouTube rule."],
    },
  ],
  faq: [
    ["How can I see when a YouTube channel uploads?", "Paste the channel into the checker. It reads the publish times of the newest 100 uploads and shows the days and hours they went public, in your time zone."],
    ["What time zone are the times in?", "Your browser's time zone. The same channel will show different hours to someone in another country."],
    ["Does this tell me the best time to post?", "No. It shows another channel's habit. Your best time depends on when your own viewers are online, which is in YouTube Studio."],
    ["How are Shorts counted?", "By length: videos of 3 minutes or less are counted as Shorts-length. YouTube's public data does not say whether a video is a Short."],
  ],
};
