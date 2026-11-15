// Guide and FAQ for /creator-tools/youtube-emv-calculator/. Merged into tools.js by build-tools.js.
// Rates match COMPUTE["youtube-emv-calculator"] in public/shared.js: views $10 per 1,000 (range $5 to $20,
// or the user's own rate), likes $0.10, comments $0.50, shares $1.50. Editorial assumptions, labelled as such.
module.exports = {
  seoTitle: "YouTube EMV Calculator: Earned Media Value of a Video | Passive Array",
  seoDescription: "Calculate the earned media value of a YouTube video or campaign from views, likes, comments and shares. Every rate shown, use your own view rate. Free, no sign-up.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "What earned media value means on YouTube",
      p: [
        "Earned media value (EMV) puts a dollar figure on attention you did not pay for. For a YouTube video it asks: if you had bought the same views and reactions with ads, roughly what would that cost?",
        "EMV is a way to compare videos, creators and campaigns on one scale. It is not revenue, it is not AdSense money, and it is not what a creator should be paid. For that, use the <a href=\"../youtube-sponsorship-price-calculator/\">sponsorship price calculator</a>.",
      ],
    },
    {
      h: "How the calculator values each action",
      table: {
        head: ["Action", "Value used"],
        rows: [
          ["Views", "$10 per 1,000, or your own rate (range shown: $5 to $20)"],
          ["Likes", "$0.10 each"],
          ["Comments", "$0.50 each"],
          ["Shares (optional)", "$1.50 each"],
        ],
      },
      after: [
        "<b>EMV = views / 1,000 x view rate + likes x $0.10 + comments x $0.50 + shares x $1.50</b>",
        "These rates are Passive Array's editorial assumptions, chosen to sit alongside our <a href=\"../instagram-emv-calculator/\">Instagram</a> and <a href=\"../tiktok-emv-calculator/\">TikTok</a> EMV calculators. They are not prices YouTube publishes. If you know what your own YouTube ads cost per 1,000 views, enter it and the calculator uses that instead.",
      ],
    },
    {
      h: "Worked example",
      p: ["A sponsored video gets 120,000 views, 4,800 likes, 350 comments and 200 shares, valued with the default $10 per 1,000 views."],
      table: {
        head: ["Line", "Sum", "Value"],
        rows: [
          ["Views", "120,000 / 1,000 x $10", "$1,200"],
          ["Likes", "4,800 x $0.10", "$480"],
          ["Comments", "350 x $0.50", "$175"],
          ["Shares", "200 x $1.50", "$300"],
          ["<b>Earned media value</b>", "", "<b>$2,155</b>"],
        ],
      },
      after: ["Views drive most of the total, which is why the view rate matters so much. The result shows the range from $5 to $20 per 1,000 so you can see that sensitivity."],
    },
    {
      h: "Using EMV well",
      list: [
        "<b>Keep the rates fixed</b> across every campaign you compare. Changing them makes the comparison meaningless.",
        "<b>Use real totals</b> from YouTube Studio once the campaign has run for the same length of time, for example 30 days.",
        "<b>Report it next to real results</b> such as clicks, sign-ups or sales, never instead of them.",
      ],
    },
  ],
  faq: [
    ["What is EMV on YouTube?", "Earned media value: an estimate of what the views and reactions a video earned would have cost as paid advertising. It is used to compare campaigns, not to measure revenue."],
    ["How is YouTube EMV calculated?", "Views are valued per 1,000 (default $10, or your own rate), then likes, comments and shares are added at fixed rates of $0.10, $0.50 and $1.50. Every line is shown in the result."],
    ["Where do I find shares for a YouTube video?", "In YouTube Studio, open the video's analytics, go to Engagement or Advanced mode and look for Shares. It is optional here; leave it blank if you do not have it."],
    ["Is EMV the same as what a creator earns?", "No. A creator's ad earnings depend on RPM, and sponsorship fees are negotiated. Use the YouTube money calculator or sponsorship price calculator for those."],
    ["Is it free?", "Yes. It runs in your browser with no account."],
  ],
};
