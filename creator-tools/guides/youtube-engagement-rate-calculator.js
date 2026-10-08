// Long-form guide for /creator-tools/youtube-engagement-rate-calculator/. Merged into tools.js by build-tools.js.
// Formulas and grade thresholds match ytER() and ytGradeView() in public/shared.js.
module.exports = {
  seoTitle: "YouTube Engagement Rate Calculator: What's Good? | Passive Array",
  seoDescription: "Calculate any YouTube channel's engagement rate, free with no sign-up. Paste a link or @handle for engagement by views and by subscribers, with a grade.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this YouTube engagement rate calculator shows",
      p: ["Paste any channel and you get its engagement rate measured two ways, plus the numbers behind it:"],
      list: [
        "<b>Engagement rate by views</b>, the main result, with a grade from Low to Excellent.",
        "<b>Engagement rate by subscribers</b>, which shows how much of the subscribed audience reacts.",
        "<b>Like rate</b> and <b>comment rate</b> per view, shown separately so you can see which one drives the result.",
        "<b>Average views, likes and comments</b> on the last 10 uploads, and the subscriber count.",
      ],
      after: ["Everything is read from public data through the official YouTube API. No login and no channel access are needed."],
    },
    {
      h: "How is YouTube engagement rate calculated?",
      p: [
        "The calculator averages views, likes and comments across the channel's last 10 uploads, then applies two formulas:",
        "<b>Engagement by views = (likes + comments) / views x 100</b>",
        "<b>Engagement by subscribers = (likes + comments) / subscribers x 100</b>",
        "Example: a channel averages 20,000 views, 800 likes and 60 comments per video, and has 50,000 subscribers. Engagement by views is 860 / 20,000 = 4.3 percent, which grades as Good. Engagement by subscribers is 860 / 50,000 = 1.72 percent.",
        "Comments count the same as likes, which is the usual convention. Shares and dislikes are left out because YouTube does not make them public.",
      ],
    },
    {
      h: "What is a good engagement rate on YouTube?",
      p: ["The calculator grades engagement by views on this scale:"],
      table: {
        head: ["Engagement rate by views", "Grade"],
        rows: [
          ["Under 1%", "Low"],
          ["1% to 2%", "Below average"],
          ["2% to 4%", "Average"],
          ["4% to 6%", "Good"],
          ["Above 6%", "Excellent"],
        ],
      },
      after: [
        "These numbers look small next to Instagram or TikTok. That is normal. On YouTube most viewers watch and leave without tapping like, and far fewer comment.",
        "The same scale is used across every YouTube tool on this site and in the <a href=\"../../youtube-extension/\">Passive Array extension</a>, so a grade means the same thing everywhere. The reasoning behind it is in our article on <a href=\"../../blog/youtube-engagement-rate-benchmarks/\">YouTube engagement rate benchmarks</a>.",
      ],
    },
    {
      h: "Engagement rate by views vs by subscribers",
      p: [
        "Use <b>engagement by views</b> to judge how well videos land with the people who actually watch them. It is fair to channels that get most of their views from search and recommendations, which is most channels today.",
        "Use <b>engagement by subscribers</b> to see whether the subscribed audience still shows up. Around 1 to 3 percent is typical. A very low figure on a large channel often means many subscribers have stopped watching. The <a href=\"../../blog/views-per-subscriber/\">views per subscriber</a> guide covers that pattern in more depth.",
        "Brands usually care most about the by-views figure, because it describes the audience that will see a sponsor message. It also feeds the engagement adjustment in the <a href=\"../youtube-sponsorship-price-calculator/\">sponsorship price calculator</a>.",
      ],
    },
    {
      h: "Why a channel's engagement rate is low, and how to raise it",
      p: ["A low rate is not always a problem. These things pull it down:"],
      list: [
        "<b>A video that reaches far beyond the usual audience.</b> New viewers from browse feeds watch and move on, so a breakout video often has a lower rate than normal ones.",
        "<b>Search traffic.</b> Tutorials collect views for years from people who want an answer, not a channel to follow.",
        "<b>Comments turned off.</b> Half the formula disappears.",
        "<b>Mixing Shorts and long videos.</b> Shorts usually get a higher rate because the like button is always on screen, so a change in the mix moves the average.",
      ],
      after: [
        "To raise it, ask one specific question in the video and pin it as a comment. Reply to early comments. Make the first minute deliver what the title promised. Then compare the channel with itself over time, and with channels of a similar size and format.",
        "To see engagement next to growth and upload frequency, try the <a href=\"../youtube-channel-quality-checker/\">channel quality checker</a>, or put two channels side by side with <a href=\"../youtube-channel-comparison/\">compare YouTube channels</a>.",
      ],
    },
  ],
  faq: [
    ["What is a good engagement rate on YouTube?", "Measured by views, 2 to 4 percent is average, 4 to 6 percent is good and above 6 percent is excellent. Under 1 percent is low. Smaller channels and Shorts tend to score higher than large channels and long videos."],
    ["How do I calculate my YouTube engagement rate?", "Add likes and comments, divide by views, and multiply by 100. This calculator does it for you across your last 10 uploads, so one viral video or one flop does not skew the result."],
    ["Does YouTube show engagement rate in YouTube Studio?", "Not as a single likes-plus-comments figure. As of October 2026, YouTube Studio reports likes, comments, watch time and average view duration separately. Check Studio for the current layout, and use this calculator for one comparable number."],
    ["Why are YouTube engagement rates lower than Instagram's?", "Most YouTube viewers watch without tapping like, and Instagram rates are usually measured against followers rather than views. The two numbers are not directly comparable."],
    ["Is a low engagement rate bad?", "Not always. Search traffic and videos that reach new audiences both lower the rate while growing the channel. It is a warning sign when a small channel with a loyal audience scores low, or when the rate keeps falling over time."],
    ["Should I measure engagement by views or by subscribers?", "Views, for most decisions. It reflects the people who actually watched. Engagement by subscribers is useful as a second check on whether your subscribed audience is still active."],
    ["Can I check the engagement rate of a single video?", "Yes. The free <a href=\"../../youtube-extension/\">Passive Array extension</a> shows the engagement rate and grade on every YouTube watch page."],
    ["Is this YouTube engagement rate calculator free?", "Yes. There is no sign-up and no limit beyond a fair daily quota shared by all visitors."],
  ],
};
