// Guide and FAQ for /creator-tools/youtube-comment-analyzer/. Merged into tools.js by build-tools.js.
// Matches COMPUTE["youtube-comment-analyzer"] in public/shared.js: getComments (official commentThreads.list,
// up to 2,000 top-level, up to 5 replies each, newest first or top), then in the browser: day-of-week x hour
// heat map and comments per day in the visitor's time zone; questions = "?" or a leading question word;
// answered = a loaded reply whose authorChannelId is the video's channelId; buying/collab = keyword regex;
// reply rate = viewer comments with a channel reply / viewer comments; top commenters (>1 comment);
// top words (stop words removed, counted once per comment). Publish-time fact: YouTube Help answer 16533387.
module.exports = {
  seoTitle: "YouTube Comment Analyzer: Free Comment Analytics and Heat Map | Passive Array",
  seoDescription: "Free YouTube comment analyzer. See when viewers comment on a heat map, unanswered questions, reply rate, buying and collab comments, top commenters and top words.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "Comment analytics YouTube Studio does not give you",
      p: ["YouTube Studio counts your comments, but it does not tell you when people comment, which questions are still waiting for an answer, or what your audience keeps talking about. Paste any public video and the analyzer shows:"],
      list: [
        "<b>A heat map of when viewers comment</b>, by day of the week and hour, in your own time zone. Click any square to read the comments posted then.",
        "<b>Comments per day</b> since the first comment we read, so you can see the launch spike and how long a video keeps a conversation going.",
        "<b>Questions without a reply from the channel</b>, most liked first, each linked straight to the comment so you can answer it.",
        "<b>Buying and collab comments</b>: people asking about prices, links, discounts, sponsors or working together.",
        "<b>The channel's reply rate</b>, the most active commenters and the words viewers use most.",
      ],
      after: ["It works on any public video or Short, yours or a competitor's, with no account and no access to your channel. A CSV of the analyzed comments, with each one marked as a question or a buying comment, is one click away."],
    },
    {
      h: "When viewers comment is not the best time to post",
      p: ["The heat map is easy to misread. It shows when your audience is around and talking, not the hour that makes a video perform. YouTube's own Help page on recommendations says publish time is not known to impact a video's long-term performance, because the system keeps recommending a video to the people likely to enjoy it, whenever it went up."],
      after: [
        "Where the timing does help: <b>replying</b> while the conversation is live, picking a slot for a <b>live stream or Premiere</b>, and posting a <b>community update</b> when people are there to see it. More on the myth in <a href=\"../../blog/best-time-to-post-on-youtube/\">best time to post on YouTube</a>.",
      ],
    },
    {
      h: "How to use the analysis",
      ordered: true,
      list: [
        "Run your latest video with <b>Newest first</b> to see timing, then with <b>Top comments</b> to find the questions most people care about.",
        "Answer the unanswered questions with the most likes first. Each one is a viewer who wants a reason to come back.",
        "Read the buying and collab comments. A run of \"where can I get this?\" is a product or affiliate idea; a collab request may be a sponsor.",
        "Look at the top words for your next video ideas. The same unanswered question across several videos is a video of its own; the <a href=\"../youtube-video-ideas-generator/\">video ideas generator</a> can take it from there.",
        "Run a competitor's video to see what their audience asks that nobody is answering.",
      ],
    },
    {
      h: "What the numbers can and cannot tell you",
      table: {
        head: ["Measure", "How it is worked out", "Limits"],
        rows: [
          ["Heat map and per-day chart", "Each comment's posting time, in your time zone", "On busy videos, only the newest or top 2,000 comments"],
          ["Questions", "A question mark, or a comment that starts with a question word", "Misses questions written as statements"],
          ["Answered by the channel", "A reply from the video's own channel among the replies we can read", "Only 5 replies per comment come back, so an answer deep in a long thread can be missed"],
          ["Buying and collab comments", "Words like price, link, discount, sponsor, collab", "Simple word rules, not AI: read them before acting"],
          ["Reply rate", "Viewer comments with a channel reply ÷ viewer comments", "Based on the sample read"],
        ],
      },
      after: [
        "Comments that are held for review, flagged as likely spam or deleted are never returned by YouTube's API, so they are not counted anywhere. To find one specific comment, use the <a href=\"../youtube-comment-search/\">YouTube comment search</a>; to keep every comment, use the <a href=\"../youtube-comment-exporter/\">comment exporter</a>; and to keep spam out of future comments, build a list with the <a href=\"../youtube-blocked-words-list/\">blocked words generator</a>.",
      ],
    },
  ],
  faq: [
    ["Does YouTube have comment analytics?", "YouTube Studio shows how many comments a video got and lets you read and reply to them, but it has no chart of when people comment or which questions are unanswered. This analyzer fills that gap for any public video."],
    ["How do I see when people comment on my YouTube videos?", "Paste the video link, choose Newest first, and read the heat map. Each square is an hour of a weekday, in your own time zone, and clicking it shows the comments posted then."],
    ["Is the busiest comment hour the best time to post?", "No. YouTube says publish time is not known to affect a video's long-term performance. Use the busiest hours for replying, going live or posting a community update."],
    ["Can I analyze a competitor's comments?", "Yes. It works on any public video or Short. Nothing is posted and nobody is notified."],
    ["How does it find unanswered questions?", "It treats a comment as a question if it has a question mark or starts with a word like how, what or why, and counts it as answered if the channel itself replied. Only 5 replies per comment come back from YouTube, so check long threads yourself."],
    ["Does it use AI or sentiment analysis?", "No. Everything is counted with simple, visible rules in your browser, so you can see exactly why a comment was flagged."],
    ["Is it free?", "Yes. No account, no sign-up and no access to your YouTube channel."],
  ],
};
