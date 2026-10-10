// Guide and FAQ for /creator-tools/instagram-growth-advisor/. Merged into tools.js by build-tools.js.
// Matches action "advisor" in api/creator-ai.js (3 to 5 actions, reasons reference the account's numbers)
// and advisorLocal() in public/shared.js (rule triggers, priorities, top 5, IG_TIERS averages, 0.85 and 1.25 multipliers).
module.exports = {
  seoTitle: "Instagram Growth Advisor: Free Action Plan | Passive Array",
  seoDescription: "Enter your Instagram numbers and goal to get the three to five changes most likely to help, in priority order, with the metric to watch. Free, no sign-up.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "How the Instagram growth advisor works",
      p: [
        "You enter where the account is now: followers, engagement rate, posts per week, the share of posts that are reels, and stories per week. Then you pick a goal: more followers, more engagement, more leads and sales, or brand deals. Instagram has no free public API for these numbers, so copy them from your Insights. If you do not know your engagement rate, work it out first with the <a href=\"../instagram-engagement-rate-calculator/\">engagement rate calculator</a>.",
        "When the site's AI writer is switched on, it returns 3 to 5 actions in priority order, each with a reason that refers to your numbers and the metric to watch. It is told to use only what you typed and never to invent facts or numbers. When the AI is not available, a set of fixed rules builds the plan instead. The note under the results tells you which one you got.",
      ],
    },
    {
      h: "What the rules check",
      p: ["Without the AI, each rule below fires only when its condition is true. The plan shows the five with the highest priority."],
      table: {
        head: ["Condition", "Suggested action"],
        rows: [
          ["Under 40% reels, goal is followers or brand deals", "Move to at least 50% reels"],
          ["Goal is leads and sales", "One lead post a week with a clear next step"],
          ["Under 3 posts a week", "Post 3 to 5 times a week"],
          ["Goal is engagement", "Reply to every comment and comment on niche accounts daily"],
          ["Engagement under 85% of the typical rate for your size", "Fix engagement before chasing reach"],
          ["Goal is brand deals, under 10,000 followers", "Build a one-page media kit"],
          ["Under 5 stories a week", "Post stories daily"],
          ["Engagement at 125% of typical or more, under 10,000 followers", "Collaborate with accounts your size"],
          ["Goal is leads or brand deals", "Turn results and kind words into a proof highlight"],
          ["Goal is followers", "Pin your three best posts"],
          ["Always", "Review insights every Sunday"],
        ],
      },
      after: [
        "The typical rate comes from the same size tiers used across the site: 4.0% under 10K followers, 2.0% from 10K to 100K, 1.4% to 500K, 1.1% to 1M and 0.8% above. See <a href=\"../../blog/instagram-engagement-rate-by-follower-count/\">Instagram engagement rate by follower count</a> for the reasoning.",
      ],
    },
    {
      h: "How to use the plan",
      list: [
        "<b>Work on the top action first.</b> Give it four weeks before you judge it, and track the metric named next to it.",
        "<b>Run it again when your numbers change.</b> Once a gap is fixed, the rule stops firing and the next action moves up.",
        "<b>Treat it as advice, not a promise.</b> No tool can guarantee growth. The plan points at the gaps in your numbers; what you post still decides the result.",
      ],
      after: ["For ideas to fill the extra posts, use the <a href=\"../instagram-content-ideas-generator/\">content ideas generator</a>. For a score of where the account stands today, try the <a href=\"../instagram-audit/\">Instagram audit</a>."],
    },
  ],
  faq: [
    ["How often should I post on Instagram to grow?", "The advisor flags anything under 3 posts a week and suggests 3 to 5. Pick a pace you can keep for months; a steady schedule beats a burst followed by silence."],
    ["Do reels really help you get more followers?", "The advisor treats reels as the main way to reach people who do not follow you yet, so it pushes accounts under 40% reels toward at least half when the goal is followers or brand deals. Check the share of non-followers reached in your own Insights to see if that holds for you."],
    ["What engagement rate should I aim for?", "It depends on your size. The advisor compares you with the typical rate for your follower tier and flags you when you fall below 85% of it. The <a href=\"../instagram-engagement-rate-benchmark/\">engagement rate benchmark</a> shows every tier."],
    ["Does the growth advisor connect to my Instagram account?", "No. It never logs in or reads your account. It only uses the numbers you type."],
    ["Is the Instagram growth advisor free?", "Yes. There is no sign-up."],
  ],
};
