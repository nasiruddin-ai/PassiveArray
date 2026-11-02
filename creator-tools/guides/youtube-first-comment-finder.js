// Guide and FAQ for /creator-tools/youtube-first-comment-finder/. Merged into tools.js by build-tools.js.
// Matches COMPUTE["youtube-first-comment-finder"] in public/shared.js: getComments with fixed params
// order=time, max=2000 (official commentThreads.list, newest first), top-level comments sorted by
// publishedAt ascending; d.truncated decides "first still visible" vs "oldest we could reach".
// Timing = comment publishedAt minus video publishedAt. Edited comments keep their original publishedAt.
module.exports = {
  seoTitle: "YouTube First Comment Finder: See a Video's Oldest Comment | Passive Array",
  seoDescription: "Find the first comment on any YouTube video or Short, how many minutes after upload it came, and the earliest ten. Free, no sign-up, honest about its limits.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "What the first comment finder shows",
      p: ["Paste a video or Shorts link and you get:"],
      list: [
        "<b>The oldest comment still visible</b>, with its author, its text and a link to it on YouTube.",
        "<b>How soon after upload it was posted</b>: within a minute, after 4 minutes, after 3 days.",
        "<b>The earliest ten comments</b>, in order, so you can see who showed up first.",
        "<b>Whether the answer is complete</b>: on a video with more comments than we can read, it says so instead of guessing.",
      ],
    },
    {
      h: "How to find the first comment on a YouTube video",
      ordered: true,
      list: [
        "Copy the video's link. Shorts, live replays and unlisted videos all work; private videos do not.",
        "Paste it above and press <b>Find first comment</b>.",
        "Read the label on the result. <b>First comment still visible</b> means we read every public comment. <b>Oldest comment we could reach</b> means the video is too busy to read in full.",
      ],
      after: ["YouTube itself has no \"oldest first\" sort. On the watch page you can only choose Top comments or Newest first, which is why finding the first comment by scrolling is impractical on anything but a small video."],
    },
    {
      h: "Why the true first comment is sometimes impossible to find",
      p: ["Be wary of any tool that promises the first comment on every video. Two things get in the way, and they apply to everyone:"],
      list: [
        "<b>Reading depth.</b> YouTube's API returns comments newest first, 100 at a time. We read back through up to 2,000. On a video with 200,000 comments, the first one is far beyond that, so the result is the oldest of the newest 2,000, and the page says so.",
        "<b>Missing comments.</b> Deleted comments, comments held for review and comments flagged as likely spam are never returned. If the real first comment was removed, nobody outside YouTube can see it any more.",
      ],
      after: ["For most videos under about 2,000 comments, the answer is complete: it is the earliest public comment that still exists. Posting times are when the comment was first written, even if it was edited later."],
    },
    {
      h: "What creators use it for",
      list: [
        "<b>Thank your earliest viewers.</b> The first people to comment are often your most loyal ones. Pinning or replying to them costs nothing.",
        "<b>See how fast your audience arrives.</b> A first comment within a minute of upload means subscribers are watching for you; hours later means most views come from elsewhere.",
        "<b>Settle a \"first!\" argument</b> or a first-commenter giveaway fairly, with timestamps.",
      ],
      after: [
        "To search the rest of the comments by keyword or username, use the <a href=\"../youtube-comment-search/\">YouTube comment search</a>. To keep a copy of the whole comment section, use the <a href=\"../youtube-comment-exporter/\">comment exporter</a>.",
      ],
    },
  ],
  faq: [
    ["How do I find the first comment on a YouTube video?", "Paste the video link above. We read the comments newest first, up to 2,000, and show the oldest one still visible along with the earliest ten."],
    ["Is this the very first comment ever posted?", "If the result says \"First comment still visible\", it is the earliest public comment that still exists. If it says \"Oldest comment we could reach\", the video has more comments than can be read, so an earlier one exists."],
    ["Why does YouTube not let me sort comments oldest first?", "The watch page only offers Top comments and Newest first. The finder reads newest first and sorts them for you."],
    ["Does it work on Shorts?", "Yes. Paste the Shorts link like any other video."],
    ["Can it find deleted first comments?", "No. Deleted comments, comments held for review and likely spam are never returned by YouTube's API, so nobody outside YouTube can see them."],
    ["What does \"minutes after upload\" mean?", "The time between when the video was published and when the comment was posted. Premieres and scheduled videos count from their publish time."],
    ["Is it free?", "Yes. No account and no sign-up. It reads public comments only."],
  ],
};
