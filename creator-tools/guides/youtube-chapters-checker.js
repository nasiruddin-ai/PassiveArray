// Long-form guide for /creator-tools/youtube-chapters-checker/. Matches COMPUTE["youtube-chapters-checker"]:
// rules from YouTube Help 9884579 (first 00:00, at least three ascending timestamps, chapters at least 10 seconds).
module.exports = {
  seoTitle: "YouTube Chapters Checker: Why Chapters Are Not Showing | Passive Array",
  seoDescription: "Free YouTube chapters checker. Paste your description to see whether your timestamps become chapters, which rule they break, and get a clean list to copy back.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "How to check your YouTube chapters",
      ordered: true,
      list: [
        "Copy the video description from YouTube Studio, or just your list of timestamps and titles.",
        "Paste it in, add the video length if you know it, and press Check chapters.",
        "Fix anything flagged, or copy the cleaned list, then paste it back into the description and save.",
      ],
    },
    {
      h: "YouTube's chapter rules",
      p: ["YouTube Help lists these steps for adding your own chapters. The checker tests each one."],
      table: {
        head: ["Rule", "From YouTube Help"],
        rows: [
          ["Start at zero", "\"Make sure that the first timestamp you list starts with 00:00.\""],
          ["Three or more", "\"Your video should have at least three timestamps listed in ascending order.\""],
          ["In order", "Each timestamp must be later than the one before it"],
          ["10 seconds minimum", "\"The minimum length for video chapters is 10 seconds.\""],
        ],
      },
      p: ["Add the timestamps in the description in YouTube Studio: Content, select the video, then the Description. Your own chapters override automatic chapters."],
    },
    {
      h: "Why chapters are not showing",
      list: [
        "<b>The list does not start at 00:00.</b> The most common cause. Add a first line like 00:00 Intro.",
        "<b>Fewer than three timestamps</b>, or two that are out of order.",
        "<b>A chapter under 10 seconds</b>, often a last chapter too close to the end of the video. Add the video length to check it.",
        "<b>Chapters are not available on the channel yet.</b> YouTube Help says to apply for access to Advanced features if you do not have chapters.",
        "<b>Active strikes or content that may be inappropriate for some viewers.</b> YouTube Help says the video chapters feature is not available in those cases.",
      ],
    },
    {
      h: "Writing chapters that help viewers",
      p: [
        "Chapter titles show on the progress bar and let viewers jump to what they came for. Short, specific titles work best: \"Flights\" or \"Where to sleep\" rather than \"Part 2\". This is our advice, not a YouTube rule.",
        "For a link that starts at one moment instead of a full chapter list, use the <a href=\"../youtube-timestamp-link-generator/\">timestamp link generator</a>. To check the rest of the description, title and tags, run the <a href=\"../youtube-video-seo-checker/\">video SEO checker</a>.",
      ],
    },
  ],
  faq: [
    ["Why are my YouTube chapters not showing?", "Usually because the first timestamp is not 00:00, there are fewer than three timestamps, they are out of order, or one chapter is shorter than 10 seconds. Paste the description into the checker to see which. If the list passes, check that chapters are available on your channel."],
    ["Do YouTube chapters have to start at 0:00?", "Yes. YouTube Help says the first timestamp you list must start with 00:00."],
    ["How many chapters do I need?", "At least three, in ascending order, according to YouTube Help. Each chapter must be at least 10 seconds long."],
    ["Can I have chapters and automatic chapters at the same time?", "No. YouTube Help says adding your own timestamps overrides automatic video chapters. You can also turn automatic chapters off for a video or in Upload defaults."],
    ["Does the format matter, 0:00 or 00:00?", "YouTube Help's wording is 00:00. The checker reads both and its cleaned list uses the 00:00 form, so it matches Help exactly."],
  ],
};
