// Guide text for the three research pages, rendered under each tool by pages/research-pages.js.
// Every weight, threshold and rule here matches lib/research.js (scoreKeyword, analyzeKeyword)
// and lib/outliers.js (scanChannel, getFeed). Each page has its own text on purpose.
module.exports = {
  keywords: {
    sections: [
      {
        h: "How to do YouTube keyword research without search volume",
        p: [
          "No tool outside Google knows how many people search a phrase on YouTube. The volume figures you see elsewhere are models. This page skips them and shows what can be measured, which answers the two questions that matter: do people look for this, and can a new video win it?",
        ],
        list: [
          "<b>Autocomplete suggestions</b> come straight from YouTube's search box: the phrase itself, then the phrase followed by each letter of the alphabet and modifiers such as how to, best, for beginners, vs, tutorial and review. A phrase that turns up from many starting points is one people type a lot.",
          "<b>Competing videos</b> is YouTube's own rounded count of results for the phrase.",
          "<b>The top 10</b> are the videos YouTube ranks first right now, with live views, ages and channel sizes.",
        ],
      },
      {
        h: "How the opportunity score works",
        p: ["The score out of 100 adds four parts, each measured from the top 10 results:"],
        list: [
          "<b>Competition, up to 35 points.</b> Full marks at 10,000 competing videos or fewer, falling on a log scale to zero at 5 million.",
          "<b>Weak incumbents, up to 30 points.</b> The share of top-10 channels with fewer than 100,000 subscribers. If small channels rank, so can you.",
          "<b>Demand, up to 20 points.</b> Average views of the top 10, on a log scale from 1,000 views (zero) to 1 million (full marks).",
          "<b>Freshness, up to 15 points.</b> The share of the top 10 published in the last year. Recent winners mean YouTube still rewards new videos for the phrase.",
          "<b>Labels:</b> 70 and up is a strong opportunity, 50 to 69 good, 30 to 49 competitive, below 30 saturated.",
        ],
      },
      {
        h: "How to pick a video topic with it",
        list: [
          "Start broad, then click the longer suggestions. Phrases of four or more words usually score higher because fewer videos target them exactly.",
          "Open the top 10 before you trust a score. If the results do not really answer the phrase, the gap is your video.",
          "Save promising phrases. They stay in this browser so you can compare them later.",
          "Check the <a href=\"/research/outliers/\">outlier feed</a> for the same topic to see which angles have recently beaten their channel's normal views.",
        ],
      },
    ],
    faq: [
      ["Why doesn't this tool show search volume?", "Because nobody outside Google has YouTube search volume. We would rather show measured signals, autocomplete, competing videos and the live top 10, than a modelled number dressed up as fact. Our guide to <a href=\"/blog/free-youtube-keyword-research/\">free YouTube keyword research</a> explains the method by hand."],
      ["How fresh are the results?", "A keyword is analysed live the first time it is checked, then cached for 7 days. The date it was checked is shown with your saved keywords."],
      ["What is a good opportunity score?", "50 or more is worth a closer look, and 70 or more is strong. A low score does not mean never; it means you need a clearly better video or a narrower phrase."],
      ["Is it free?", "Yes, with no account. Each connection can run 40 keyword checks an hour, and the site shares a daily YouTube API allowance. The same score appears inside YouTube search with the <a href=\"/youtube-extension/\">Passive Array extension</a>."],
    ],
  },

  outliers: {
    sections: [
      {
        h: "What is an outlier video?",
        p: [
          "An outlier is a video that did far better than its own channel usually does. It is not the same as a big video. A million views is normal for a channel with ten million subscribers. Fifty thousand views is a breakout for a channel whose videos usually get five thousand.",
          "That is why outliers are useful for ideas. Channel size, schedule and audience stay roughly constant from one upload to the next, so when one upload jumps, the topic, title or thumbnail is the likely reason.",
        ],
      },
      {
        h: "How the outlier multiplier is calculated",
        list: [
          "A daily job reads each channel's last 10 uploads from the YouTube Data API. Live streams are left out, and channels with fewer than 4 uploads are skipped.",
          "<b>Multiplier = a video's views / the median views of the channel's other recent uploads.</b> The median is used instead of the average so one earlier hit does not hide the next.",
          "A video makes the feed when it was published in the last 90 days, has at least 1,000 views and a multiplier of 3 or more. Anything at 100x or above is shown as over 100x.",
          "To keep the feed varied, no channel appears more than twice. Shorts of 60 seconds or less have <a href=\"/research/shorts/\">their own page</a>.",
        ],
      },
      {
        h: "How to use outlier videos for video ideas",
        list: [
          "Filter by topic and raise the minimum to 10x or 25x to see only the clearest breakouts in your area.",
          "Look for patterns, not single videos. Three channels breaking out on the same subject is a signal; one is a story.",
          "Switch to the <a href=\"/research/outliers/?view=thumbs\">thumbnail grid</a> to study how breakout videos are packaged.",
          "Run the subject through <a href=\"/research/\">keyword research</a> to see whether the search results are still beatable.",
          "Find more channels like the one that broke out with the <a href=\"/creator-tools/youtube-lookalike-finder/\">lookalike finder</a>.",
        ],
      },
      {
        h: "What the multiplier cannot tell you",
        list: [
          "<b>Why it worked.</b> A video can spike because of an outside link or a news story, not its topic.",
          "<b>Age differences.</b> Views are lifetime totals, so a video a few days old is compared with uploads that had weeks to grow. A young video at 3x is more impressive than an old one.",
          "<b>Today's views.</b> Channels are scanned in rotation, so a figure can be a few days old.",
          "<b>Every niche.</b> Channels enter the index when someone researches a keyword they rank for, so well-researched topics are covered best.",
        ],
      },
    ],
    faq: [
      ["What is a good outlier multiplier?", "3x is where the feed starts and already means a clear break from normal. 10x and above is rare and is highlighted on the card."],
      ["Why the median and not the average?", "One past hit can drag a channel's average far above what a typical upload gets. The median shows the normal video, so the multiplier measures surprise, not size."],
      ["How often is the feed updated?", "A scheduled job runs once a day and scans a batch of channels, continuing from where the last run stopped. Videos older than 90 days drop out."],
      ["Can I export the list?", "Pro members can export the current view as a CSV file. Browsing and filtering are free with no account."],
    ],
  },

  shorts: {
    sections: [
      {
        h: "Why some Shorts break out",
        p: [
          "Most Shorts are watched in a swipe feed by people who did not choose the channel. That makes a single Short far less tied to its channel's size than a long video is. A small account can post one Short that reaches many times its usual audience, and a large account can post one that barely moves.",
          "So a Short that breaks out tells you something specific: the first moments held strangers who had never heard of the creator. That is the lesson worth copying, more than the topic alone.",
        ],
      },
      {
        h: "How Shorts outliers are measured, and how they differ",
        p: ["The rule is the same as the main feed: views divided by the median of the channel's other recent uploads, kept at 3x or more, 1,000 views or more and 90 days old or less. Three details change how you should read it:"],
        list: [
          "<b>Only uploads of 60 seconds or less are counted as Shorts here.</b> Longer Shorts appear in the main <a href=\"/research/outliers/\">outlier feed</a> instead.",
          "<b>The channel median includes all recent uploads.</b> On a channel that posts both formats, a Short is compared with its long videos too, so a high multiplier can partly reflect the format, not the idea. The cleanest signals come from channels that post mostly Shorts.",
          "<b>Shorts views and long-form views are not worth the same,</b> in watch time or in money. A Short with a huge multiplier is not proof of a big payday; see <a href=\"/blog/how-much-does-youtube-pay-for-shorts/\">how much YouTube pays for Shorts</a>.",
        ],
      },
      {
        h: "How to use Shorts outliers",
        list: [
          "Watch the first two seconds of each breakout. Note the opening line, the first image and whether there is text on screen.",
          "Look for formats you can repeat weekly, not one-off moments you cannot recreate.",
          "Use a Short that broke out as a cheap test for a longer video. If the idea holds strangers for 40 seconds, check the long-form version in <a href=\"/research/\">keyword research</a>.",
          "Sort by Newest with the 7-day filter to catch ideas while they are still fresh.",
        ],
      },
    ],
    faq: [
      ["What counts as a Short on this page?", "Any upload of 60 seconds or less. YouTube now allows longer Shorts, and those are listed in the main outlier feed with long-form videos."],
      ["Why does a Short show a huge multiplier on a big channel?", "If that channel mostly posts long videos, its median comes from those. A Short that suits the swipe feed can then look like an extreme outlier. Open the channel to see which format it usually posts."],
      ["Do Shorts outliers earn a lot?", "Not necessarily. Shorts pay far less per view than long videos. Use the <a href=\"/creator-tools/youtube-money-calculator/\">YouTube money calculator</a> for a channel's long-form earnings."],
    ],
  },
};
