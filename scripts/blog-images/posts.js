// Cover and figure content per post. Every number here must already be in the post, with its source.
// Cover visual types: shot (real tool screenshot from shots/), stats (up to 2 big figures), vs (two sides).
// Figure types: flow (steps), timeline (events), picks (cards), bars ({label, value, display, hi}), shot (a tool screenshot cropped to maxHeight).
module.exports = {
  "how-youtube-seo-works": {
    cover: {
      kicker: "YouTube SEO",
      title: "How YouTube *SEO* works in 2026",
      sub: "The 3 things YouTube search ranks on, and the 8 steps to rank a video.",
      size: 68,
      visual: { type: "shot", src: "keyword-generator.png", label: "YouTube Keyword Generator", tag: "Free, no account", style: "height:400px;object-fit:cover;object-position:top" },
    },
    figures: [
      {
        file: "youtube-search-ranking.webp", type: "flow",
        title: "How YouTube search ranks a video",
        sub: "YouTube names three elements. You write the first; viewers and your channel history decide the others.",
        steps: [
          { title: "Relevance", text: "How well the title, tags, description and video content match the search.", you: "You control it: title, description, chapters, what you say." },
          { title: "Engagement", text: "How people who searched that phrase respond, such as watch time for the query.", you: "You influence it: deliver what the title promised, fast." },
          { title: "Quality", text: "Which channels show expertise, authoritativeness and trustworthiness on the topic.", you: "You build it: cover one subject well, over many videos." },
        ],
        note: "Source: YouTube Help, \"How YouTube search works\".",
      },
      { file: "keyword-generator-results.webp", type: "shot", src: "keyword-generator.png", maxHeight: 760 },
    ],
  },
  "how-much-does-youtube-pay-after-monetization": {
    cover: {
      kicker: "Earnings",
      title: "What YouTube pays *after* monetization",
      sub: "Your revenue share, the payout calendar and what a new channel earns.",
      size: 62,
      visual: { type: "stats", items: [
        { big: "55%", label: "of ad revenue on long-form videos", note: "Your share, per YouTube's Partner earnings page" },
        { big: "45%", label: "of the Shorts revenue allocated to you", note: "Allocated from the Shorts pool by your share of views" },
      ] },
    },
    figures: [
      {
        file: "youtube-payout-timeline.webp", type: "timeline",
        title: "When YouTube pays you for a month's earnings",
        sub: "Earnings from one month are paid during the next one, if you have reached the threshold.",
        events: [
          { dot: "1", when: "Month ends", what: "Your estimated earnings stop growing for that month" },
          { dot: "2", when: "7th to 12th", what: "Last month's earnings are finalized and added to your balance" },
          { dot: "3", when: "20th", what: "Cut-off: your balance must reach the payment threshold ($100 for USD accounts)" },
          { dot: "$", when: "21st to 26th", what: "Payment issued; \"Payment pending\" shows in AdSense for YouTube" },
        ],
        note: "Source: YouTube Help, \"AdSense for YouTube payment process\" and payment thresholds. Weekends and holidays can move a date.",
      },
      { file: "money-calculator-estimate.webp", type: "shot", src: "money-calculator.png" },
    ],
  },
  "tubebuddy-vs-vidiq": {
    cover: {
      kicker: "Comparison",
      title: "TubeBuddy *vs* vidIQ: which one fits you?",
      sub: "What each one does best, who it suits and when a free tool is enough.",
      size: 54,
      visual: { type: "vs", sides: [
        { name: "TubeBuddy", tagline: "Manage your channel", points: ["A/B tests", "Bulk editing", "Scheduling"] },
        { name: "vidIQ", tagline: "Find what to make", points: ["Daily ideas", "Trends and outliers", "AI coach"] },
      ] },
    },
    figures: [
      {
        file: "which-to-choose.webp", type: "picks",
        title: "Which one should you choose?",
        sub: "Pick by the job you need done, not by the brand.",
        picks: [
          { name: "TubeBuddy Legend", tagline: "big back catalogue", points: ["Change links or end screens across many videos", "A/B tests beyond YouTube's free Test & compare"] },
          { name: "vidIQ Boost", tagline: "stuck on ideas", points: ["Daily ideas and coaching", "You create for YouTube and Instagram"] },
          { name: "TubeBuddy Pro", tagline: "basic paid plan", points: ["Only basic SEO and channel tools"] },
          { name: "A free tool", tagline: "no channel access", points: ["You only need keywords, titles, descriptions and tags", "You do not want to connect your channel to a third party"] },
        ],
        note: "Based on each tool's own pricing and feature pages, checked 1 November 2026.",
      },
    ],
  },
};
