// Long-form guide for /creator-tools/youtube-channel-video-exporter/. Matches COMPUTE["youtube-channel-video-exporter"]:
// action "channelvideos" (newest 50/100/200 public uploads) and a CSV with title, url, date, length, stats, tags, description.
module.exports = {
  seoTitle: "YouTube Channel Video Exporter: Export Videos to CSV | Passive Array",
  seoDescription: "Free tool to export a YouTube channel's videos to CSV: titles, links, publish dates, views, likes, comments, lengths, tags and descriptions for up to 200 videos.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "How to export a channel's videos",
      ordered: true,
      list: [
        "Paste the channel's link or @handle.",
        "Choose the newest 50, 100 or 200 videos and press List videos.",
        "Check the table, then download the CSV. The download needs a free account.",
      ],
    },
    {
      h: "What the CSV contains",
      table: {
        head: ["Column", "What it holds"],
        rows: [
          ["title", "The video title"],
          ["url", "The watch link"],
          ["published_at", "When it went public, in UTC"],
          ["length_seconds", "The video's length"],
          ["views, likes, comments", "Public counts at the moment you export; blank where the creator hid them"],
          ["tags", "The hidden tags, comma separated"],
          ["description", "The full description, up to 5,000 characters"],
        ],
      },
    },
    {
      h: "What people use it for",
      list: [
        "<b>A backup of your own metadata.</b> Titles, descriptions and tags in one file, before you change them in bulk or hand the channel to someone.",
        "<b>Competitor research.</b> Sort the sheet by views to see which topics and title shapes carry a channel. Our <a href=\"../../blog/youtube-competitor-analysis/\">competitor analysis guide</a> walks through it.",
        "<b>An audit.</b> Find videos with no tags, short descriptions or missing chapters in one pass.",
      ],
    },
    {
      h: "Limits",
      p: [
        "The exporter reads public data only, through the official YouTube Data API. Private and unlisted videos, analytics from YouTube Studio and the video files themselves are not part of it.",
        "It reads the newest 200 uploads at most. For when a channel publishes, use the <a href=\"../youtube-upload-schedule-checker/\">upload schedule checker</a>, which reads the same list.",
      ],
    },
  ],
  faq: [
    ["Can I export all videos from a YouTube channel?", "Up to the newest 200 public videos. Each row has the title, link, date, length, public counts, tags and description."],
    ["Does it download the video files?", "No. It exports text and numbers about the videos, not the videos. Downloading other people's videos is against YouTube's terms."],
    ["Can I export another channel's videos?", "Yes. Everything exported is public data that anyone can see on the channel, collected into one file."],
    ["Why do I need an account to download?", "The table on the page is free without one. The CSV download asks for a free account, which takes a few seconds, and you come straight back to your result."],
  ],
};
