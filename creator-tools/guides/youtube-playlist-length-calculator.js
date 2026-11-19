// Long-form guide for /creator-tools/youtube-playlist-length-calculator/. Matches
// COMPUTE["youtube-playlist-length-calculator"]: playlists + playlistItems + videos.list, first 500 videos (action "playlist").
module.exports = {
  seoTitle: "YouTube Playlist Length Calculator: Total Run Time | Passive Array",
  seoDescription: "Free YouTube playlist length calculator. Get the total run time of any public playlist, plus how long it takes at 1.25x, 1.5x and 2x speed.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "How to find a playlist's total length",
      ordered: true,
      list: [
        "Open the playlist on YouTube and copy the link from the address bar. A link to any video inside the playlist works too, as long as it contains list=.",
        "Paste it and press Calculate length.",
        "Read the total, the times at faster speeds, and the running total beside each video.",
      ],
    },
    {
      h: "What the numbers mean",
      table: {
        head: ["Result", "How it is worked out"],
        rows: [
          ["Total length", "The lengths of every available video, added up"],
          ["At 1.25x to 2x", "The total divided by the speed"],
          ["Average video", "Total length divided by the number of videos counted"],
          ["Running total", "Where you will be in the playlist after each video, handy for planning a course or a binge"],
        ],
      },
    },
    {
      h: "Why some videos are not counted",
      list: [
        "<b>Private or deleted videos</b> stay in a playlist as placeholders but have no length to read.",
        "<b>Region-blocked videos</b> may not be readable either.",
        "<b>Live streams in progress</b> have no fixed length yet and count as zero.",
        "<b>Very long playlists</b>: only the first 500 videos are measured, and the result says so.",
      ],
      p: ["The number YouTube shows for the playlist can include those placeholders, which is why it may be higher than the number of videos counted here."],
    },
    {
      h: "Planning with it",
      p: ["Courses and lecture playlists are the common use: at 1.5x, a 12-hour course is 8 hours. To jump back in at an exact point later, make a link with the <a href=\"../youtube-timestamp-link-generator/\">timestamp link generator</a>. For the details of a single video, use the <a href=\"../youtube-video-stats-checker/\">video stats checker</a>."],
    },
  ],
  faq: [
    ["Does it work with private playlists?", "No. Private playlists are not visible to anyone but the owner, including the YouTube Data API. Unlisted playlists work if you have the link."],
    ["Can I measure a Mix or the Watch Later list?", "No. Mixes change for every viewer and Watch Later is private to your account, so neither can be read from a link. Save the videos to a normal playlist first."],
    ["Why is the total different from adding up the times on YouTube?", "The usual reasons are unavailable videos, which are left out here, and rounding: YouTube shows minutes and seconds per video, while this adds the exact second counts."],
    ["Is there a limit on playlist size?", "This tool measures the first 500 videos. That covers nearly every course and series; for longer playlists the result notes that it stopped at 500."],
  ],
};
