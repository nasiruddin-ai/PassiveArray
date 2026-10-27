// Guide and FAQ for /creator-tools/youtube-comment-exporter/. Merged into tools.js by build-tools.js.
// Facts checked against creator-tools/lib/youtube.js getComments (commentThreads.list, 100 per page,
// up to 2,000 top-level, up to 5 inline replies, textFormat plainText) and COMPUTE in public/shared.js.
module.exports = {
  seoTitle: "YouTube Comment Exporter: Download Comments to CSV Free | Passive Array",
  seoDescription: "Export YouTube comments to a CSV file for Excel or Google Sheets. Author, comment text, likes, replies, date and a link to each comment. Free, no sign-up.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What you get in the export",
      p: ["Paste a video or Shorts link and the tool reads its public comments from the official YouTube Data API. The CSV has one row per comment with these columns:"],
      table: {
        head: ["Column", "What it holds"],
        rows: [
          ["comment_id, parent_id", "YouTube's ID for the comment, and for a reply the ID of the comment it answers"],
          ["type", "comment or reply"],
          ["author, author_channel_url", "The commenter's display name and a link to their channel"],
          ["text", "The full comment as plain text, line breaks kept"],
          ["likes, reply_count", "Likes on the comment and how many replies it has in total"],
          ["published_at, updated_at", "When it was posted and last edited, in UTC"],
          ["comment_url", "A link that opens the video with that comment highlighted"],
        ],
      },
      after: ["The file starts with a byte-order mark, so Excel shows emoji and accented letters correctly when you double-click it. Cells that begin with = + - or @ get a leading apostrophe so a spreadsheet never runs them as formulas."],
    },
    {
      h: "How to export YouTube comments",
      ordered: true,
      list: [
        "Copy the video link from the address bar or the Share button. Shorts links and youtu.be links work too.",
        "Choose the order: <b>Top comments</b> as YouTube ranks them, or <b>Newest first</b>.",
        "Choose how many to read, up to 2,000, and press <b>Export comments</b>.",
        "Skim the first 50 in the table, then press <b>Download</b> for the full CSV.",
      ],
    },
    {
      h: "Why the export can be smaller than the comment count",
      p: [
        "The number under a video counts every comment and reply. The export can come out smaller for reasons that apply to every tool built on the API:",
      ],
      list: [
        "Comments <b>held for review</b> or <b>flagged as likely spam</b> are never returned by the API, and deleted comments are gone.",
        "The API returns up to <b>5 replies</b> with each comment. Threads with longer conversations are cut at five; reply_count still shows the true total.",
        "The tool stops at the limit you choose, and says so when there were more.",
      ],
    },
    {
      h: "What people use comment exports for",
      list: [
        "Reading <b>questions and requests</b> in one sheet to plan the next video.",
        "Counting how often a product, topic or competitor is mentioned.",
        "Keeping a record of the comments on a giveaway, alongside the <a href=\"../youtube-comment-picker/\">YouTube comment picker</a>.",
        "Checking whether comments look real before paying for a sponsorship, together with the <a href=\"../youtube-engagement-rate-calculator/\">engagement rate calculator</a>.",
      ],
      after: ["Comments are personal data written by other people. Use exports for your own analysis and avoid republishing names and comments without a good reason."],
    },
  ],
  faq: [
    ["Can I export comments from any YouTube video?", "Any public video or Short with comments turned on. If the creator has turned comments off, there is nothing to export and the tool says so."],
    ["How many comments can I export?", "Up to 2,000 top-level comments per export, plus up to 5 replies under each one."],
    ["Do I need to sign in or connect my YouTube account?", "No. Only public comments are read, through Passive Array's own API key, so you never grant access to anything."],
    ["Why are some replies missing?", "The YouTube API includes up to 5 replies with each comment. The reply_count column still shows how many replies a comment really has."],
    ["Can I export comments to Excel?", "Yes. The CSV opens directly in Excel, Google Sheets and Numbers, with emoji and accents intact."],
  ],
};
