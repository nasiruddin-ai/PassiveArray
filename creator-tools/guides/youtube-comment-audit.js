// Guide and FAQ for /creator-tools/youtube-comment-audit/. Merged into tools.js by build-tools.js.
// Matches getChannelComments in lib/youtube.js (latest 5 or 10 uploads from getChannel, newest 100/200/300
// comments each through getComments; made-for-kids and comment-less videos listed, not read) and
// COMPUTE["youtube-comment-audit"] in public/shared.js. Score = reply rate min(35, rr/30%*35) + questions
// answered 25*share + comments per 1,000 views min(20, per1k/5*20) + regulars min(10, share/10%*10) +
// scam spam max(0, 10 - share/5%*10). Bands: 80 Thriving, 60 Healthy, 40 Needs attention, else Neglected.
module.exports = {
  seoTitle: "YouTube Comment Audit: Free Channel Comment Health Check | Passive Array",
  seoDescription: "Free YouTube comment audit for any channel. Reply rate, unanswered questions, loyal commenters, spam and a comment health score across the latest videos. No sign-up.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "What the YouTube comment audit checks",
      p: ["One video's comments tell you about that video. A comment audit looks at the whole channel: the newest comments on its latest 5 or 10 uploads, read together. You get:"],
      list: [
        "<b>A comment health score out of 100</b>, with every point explained, so you can see exactly what to fix.",
        "<b>The channel's reply rate</b> and <b>every unanswered question</b> across the videos, in one list, most liked first.",
        "<b>Regulars</b>: the viewers who comment on two or more videos. These are the people most likely to subscribe, buy and defend you in the comments.",
        "<b>Buying and collab comments</b>, and <b>scam or link spam</b> that slipped past the channel's filters.",
        "<b>A video-by-video table</b> and a <b>heat map of when viewers comment</b> across all the videos.",
      ],
      after: ["It works on any public channel, yours or a competitor's, with no account and no access to anyone's channel."],
    },
    {
      h: "How the comment health score is worked out",
      p: ["The score is Passive Array's own rubric, not a number YouTube publishes. Every part is shown in the result with the figures behind it:"],
      table: {
        head: ["Part", "Points", "Full marks at"],
        rows: [
          ["Reply rate", "35", "The channel replies to 30% or more of viewer comments"],
          ["Questions answered", "25", "Every viewer question has a reply from the channel"],
          ["Conversation", "20", "5 or more comments per 1,000 views, using YouTube's own comment counts"],
          ["Regular commenters", "10", "10% or more of commenters commented on two or more of the videos"],
          ["Free of scam spam", "10", "No scam or link spam visible; zero points once it reaches 5% of comments"],
        ],
      },
      after: [
        "80 and above reads as <b>Thriving</b>, 60 to 79 <b>Healthy</b>, 40 to 59 <b>Needs attention</b>, and below 40 <b>Neglected</b>. The thresholds are editorial choices, picked so a small channel that answers its viewers can score well. A huge channel that never replies will score low on purpose, even with millions of views, because the score is about the conversation, not the size.",
      ],
    },
    {
      h: "How to raise your score",
      ordered: true,
      list: [
        "<b>Answer the unanswered questions first</b>, most liked at the top. They are the easiest points and the most useful replies.",
        "<b>Reply to your regulars by name.</b> They come back anyway; a reply makes it a habit.",
        "<b>Hide the scam comments</b> the audit found, then add a blocked words list so the next wave is held for review. The <a href=\"../youtube-blocked-words-list/\">blocked words list generator</a> builds one in seconds.",
        "<b>Ask a specific question</b> in the video or a pinned comment. \"Which of these would you try first?\" gets more comments than \"let me know what you think\".",
        "<b>Run the audit again in a month</b> and compare.",
      ],
      after: ["To dig into one video, use the <a href=\"../youtube-comment-analyzer/\">YouTube comment analyzer</a>. To keep every comment, use the <a href=\"../youtube-comment-exporter/\">comment exporter</a>."],
    },
    {
      h: "What the audit cannot see",
      list: [
        "<b>Older comments on busy videos.</b> It reads the newest 100, 200 or 300 comments on each video, so on a video with thousands of comments it is a recent sample.",
        "<b>Replies deep in long threads.</b> YouTube's API returns up to 5 replies per comment, so a channel reply further down can be missed.",
        "<b>Hidden comments.</b> Comments held for review, flagged as likely spam or deleted are never returned, so spam the channel already caught does not count against it.",
        "<b>Meaning.</b> Questions, buying comments and spam are found with simple word rules, not AI. Read the lists before acting on them.",
      ],
    },
  ],
  faq: [
    ["What is a YouTube comment audit?", "A check of a channel's comment section across several videos: how often the channel replies, which questions are waiting, who keeps coming back, and whether spam is getting through. This one also gives a 0 to 100 score with each point explained."],
    ["What is a good YouTube comment reply rate?", "YouTube does not publish one. Our score gives full marks at 30% of viewer comments replied to, which is realistic for small and mid-size channels. Very large channels rarely reach it and score lower on purpose."],
    ["Can I audit a competitor's comments?", "Yes. It works on any public channel. Nothing is posted and nobody is notified."],
    ["How many videos does it check?", "The latest 5 or 10 uploads, reading the newest 100, 200 or 300 comments on each. Videos made for kids or with comments turned off are listed but not read."],
    ["Is the comment health score a YouTube metric?", "No. It is Passive Array's rubric, shown part by part with its thresholds, so you can disagree with any of it and still use the numbers underneath."],
    ["Does it use AI?", "No. Everything is counted with simple visible rules in your browser."],
    ["Is it free?", "Yes. No account, no sign-up and no access to your YouTube channel."],
  ],
};
