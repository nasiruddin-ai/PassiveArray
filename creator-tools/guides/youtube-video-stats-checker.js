// Long-form guide for /creator-tools/youtube-video-stats-checker/. Matches COMPUTE["youtube-video-stats-checker"]:
// snippet.publishedAt shown in the browser's time zone and UTC, plus statistics (action "videodetails").
module.exports = {
  seoTitle: "YouTube Video Upload Date & Stats Checker (Exact Time) | Passive Array",
  seoDescription: "Free tool to see the exact upload date and time of any YouTube video in your time zone, plus live views, likes, comments and views per day.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "How to see when a YouTube video was uploaded",
      ordered: true,
      list: [
        "Copy the video's link. Shorts and youtu.be links work too.",
        "Paste it and press Check video.",
        "The top line is the exact publish date and time in your own time zone; the UTC time is listed underneath.",
      ],
      p: ["YouTube's watch page only shows a date, or \"3 days ago\". The exact second comes from the video's public data in the YouTube Data API."],
    },
    {
      h: "Upload time versus publish time",
      p: [
        "The time shown is when the video became public. For most videos that is the upload time. For a <b>scheduled</b> video it is the scheduled moment, and for a <b>premiere</b> it is when the premiere went live, even if the file was uploaded days earlier.",
        "For a live stream, the result also shows when the stream actually started.",
      ],
    },
    {
      h: "The stats, and how they are worked out",
      table: {
        head: ["Stat", "How it is worked out"],
        rows: [
          ["Views per day", "Total views divided by the video's age in days"],
          ["Like rate", "Likes divided by views"],
          ["Comments", "Shown as turned off when the creator has disabled them"],
          ["Likes", "Shown as hidden when the creator has hidden the count"],
        ],
      },
      p: ["Views per day is an average over the whole life of the video. A new video's first days are always far above its long-run average, so compare videos of a similar age."],
    },
    {
      h: "Going further",
      p: ["To see the tags, use the <a href=\"../youtube-tag-extractor/\">tag extractor</a>. To score the title and description, use the <a href=\"../youtube-video-seo-checker/\">video SEO checker</a>. For the conversation under the video, the <a href=\"../youtube-comment-analyzer/\">comment analyzer</a> shows when people comment and which questions have no reply."],
    },
  ],
  faq: [
    ["Why is the date different from what YouTube shows?", "YouTube shows the date in its own display settings and rounds it, for example \"2 years ago\". This tool shows the exact timestamp converted to your device's time zone, so near midnight the day can differ."],
    ["Can I see when a private or unlisted video was uploaded?", "Unlisted videos work if you have the link. Private videos cannot be read by anyone but the owner."],
    ["Does it show the dislike count?", "No. YouTube stopped making dislike counts public, and any number from another site is an estimate."],
    ["Is the view count live?", "It is the count the YouTube Data API reports, which can trail the number on the watch page by a short time, especially in a video's first hours."],
  ],
};
