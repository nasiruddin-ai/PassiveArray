// Guide and FAQ for /creator-tools/youtube-channel-quality-checker/. Merged into tools.js by build-tools.js.
// Weights and caps match COMPUTE["youtube-channel-quality-checker"] and letter() in public/shared.js:
// engagement 35 (full at 4% by views), reach 25 (full at 30%), consistency 20 (full at 4/month),
// audience 12 (log10(subs)/6, full at 1M) + age 8 (full at 4 years). Grades A 85, B 70, C 55, D 40.
module.exports = {
  seoTitle: "YouTube Channel Quality Checker: Free 0-100 Score | Passive Array",
  seoDescription: "Score any YouTube channel from 0 to 100 on engagement, reach, upload consistency and audience. Free, no sign-up, with every point of the score explained.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What the YouTube channel quality score measures",
      p: ["The score adds up four parts. Each part grows in a straight line until it hits its cap, and nothing earns extra credit beyond the cap."],
      table: {
        head: ["Part", "Points", "What is measured", "Full marks at"],
        rows: [
          ["Engagement", "35", "(likes + comments) / views on the last 10 uploads", "4% or more"],
          ["Reach", "25", "Average views on the last 10 uploads / subscribers", "30% or more"],
          ["Consistency", "20", "Uploads per month, from the dates of the last 10 uploads", "4 or more a month"],
          ["Audience size", "12", "Subscribers, on a log scale: 2 points for every tenfold step", "1 million subscribers"],
          ["Channel age", "8", "Years since the channel was created: 2 points a year", "4 years"],
        ],
      },
      after: [
        "Engagement and reach together are worth 60 of the 100 points. That is deliberate: they show whether real people watch and react, which is what a brand pays for and what YouTube's recommendations respond to. Size and age are worth 20 points between them.",
      ],
    },
    {
      h: "How to check a YouTube channel's quality",
      ordered: true,
      list: [
        "Copy the channel link or @handle. A plain name works too, but it uses the top search match.",
        "Paste it into the box above and press <b>Check</b>. No login is needed.",
        "Read the overall score and grade, then the four bars. Each bar shows the raw figure behind it, so you can see exactly where points were lost.",
      ],
      table: {
        head: ["Score", "Grade"],
        rows: [["85 to 100", "A"], ["70 to 84", "B"], ["55 to 69", "C"], ["40 to 54", "D"], ["Under 40", "F"]],
      },
    },
    {
      h: "What a good YouTube channel looks like: a worked example",
      p: [
        "Take a channel with 50,000 subscribers that is 3 years old. Its last 10 uploads average 10,000 views, with a 3% engagement rate, and it posts twice a month.",
      ],
      list: [
        "<b>Engagement:</b> 3% of the 4% target, so 26 of 35 points.",
        "<b>Reach:</b> 10,000 / 50,000 is 20% of subscribers watching, two thirds of the 30% target, so 17 of 25.",
        "<b>Consistency:</b> 2 uploads a month is half of the 4 needed, so 10 of 20.",
        "<b>Audience:</b> 50,000 subscribers earns about 9 of 12, and 3 years earns 6 of 8, so 15 of 20.",
      ],
      after: [
        "Total: 68, a C. The fastest gain here is consistency, not more subscribers. Posting weekly at the same reach and engagement would add 10 points and move the channel to a B.",
        "This is also why a channel with millions of subscribers can score lower than a small one. If only 2% of its subscribers watch each upload, it gets under 2 of the 25 reach points, however big it is.",
      ],
    },
    {
      h: "What the quality score cannot see",
      p: ["The score uses only public numbers, so it has blind spots. Read it with these in mind:"],
      list: [
        "<b>Watch time and retention</b> are private to the channel owner. A channel can score well on likes and still lose viewers in the first minute.",
        "<b>One viral video</b> among the last 10 can inflate reach and engagement. Check the recent video table on the <a href=\"../youtube-subscriber-count-checker/\">subscriber count checker</a> for an outlier.",
        "<b>Consistency looks at the last 10 uploads only.</b> A channel that posted weekly and then stopped months ago can still show a good pace. Check the date of the latest upload.",
        "<b>Hidden subscriber counts</b> leave nothing to divide by, so reach and audience size score zero and the total reads low.",
        "<b>Fake subscribers</b> are not detected directly. A big subscriber count with very low reach and engagement is the usual warning sign. Our guide on <a href=\"../../blog/how-to-spot-fake-followers/\">spotting fake followers</a> covers the other checks.",
      ],
    },
    {
      h: "How to improve your channel quality score",
      ordered: true,
      list: [
        "<b>Lift engagement.</b> Ask one specific question in the video and pin a comment that answers it. Our <a href=\"../../blog/youtube-engagement-rate-benchmarks/\">engagement rate benchmarks</a> show where you sit, and the <a href=\"../youtube-engagement-rate-calculator/\">engagement rate calculator</a> splits likes from comments.",
        "<b>Win back your own subscribers.</b> Reach drops when titles and thumbnails stop earning the click. Score your next title with the <a href=\"../youtube-title-analyzer/\">title analyzer</a> before you publish.",
        "<b>Post on a schedule you can keep.</b> Four uploads a month earns full consistency marks, but a steady two beats a burst of eight followed by silence.",
        "<b>Compare with peers, not giants.</b> Put your channel next to two of similar size with <a href=\"../youtube-channel-comparison/\">compare YouTube channels</a> to see which part of the score you are losing.",
      ],
      after: ["Audience size and age take care of themselves over time. To watch the score's inputs move week to week, add your channel to the free <a href=\"../../app/\">dashboard</a>, which records it daily and shows the 7 and 30 day change."],
    },
  ],
  faq: [
    ["What is a good YouTube channel quality score?", "70 or more (grade B) means the channel is doing well on most parts. 85 or more is an A. Below 40 means at least two of engagement, reach and consistency are weak. Use the four bars to see which."],
    ["Is this the score YouTube uses to rank channels?", "No. YouTube does not publish a quality score. This is Passive Array's own formula, built only from public numbers, and every part of it is shown so you can check the arithmetic."],
    ["Why does a smaller channel score higher than a bigger one?", "Size is worth only 12 points. Engagement and reach are worth 60. A small channel whose subscribers all watch beats a large one whose subscribers have drifted away."],
    ["How is engagement calculated?", "Likes plus comments, divided by views, on the channel's 10 most recent public uploads. Full marks need 4% or more. It is the same figure the <a href=\"../youtube-engagement-rate-calculator/\">engagement rate calculator</a> shows."],
    ["Can this checker tell if a channel has fake subscribers?", "Not directly. It shows the pattern that usually gives fake subscribers away: a large subscriber count with low reach and low engagement. Treat that as a reason to look closer, not as proof."],
    ["Does the score include Shorts?", "Yes. It uses the last 10 public uploads of any kind. A channel that mixes Shorts and long videos can move a lot depending on which happen to be in that window."],
    ["How often does the score change?", "It is worked out fresh from the latest uploads each time, but channel data is cached for up to 6 hours. A new upload can shift engagement, reach and consistency the same day it goes into the window."],
    ["Is the YouTube channel quality checker free?", "Yes. No sign-up and no limit beyond a fair daily quota shared by all visitors."],
  ],
};
