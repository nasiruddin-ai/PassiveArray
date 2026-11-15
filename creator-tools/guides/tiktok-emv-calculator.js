// Guide and FAQ for /creator-tools/tiktok-emv-calculator/. Merged into tools.js by build-tools.js.
// Rates match COMPUTE["tiktok-emv-calculator"] in public/shared.js: views $6 per 1,000 (range $3 to $12,
// or the user's own rate), likes $0.05, comments $0.50, shares $1.50, saves $0.40. Editorial assumptions.
module.exports = {
  seoTitle: "TikTok EMV Calculator: Earned Media Value of a TikTok | Passive Array",
  seoDescription: "Calculate the earned media value of a TikTok video or campaign from views, likes, comments, shares and saves. Every rate shown, use your own view rate. Free.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "What earned media value means on TikTok",
      p: [
        "Earned media value (EMV) puts a dollar figure on attention you did not pay for. For a TikTok it asks: if the same views and reactions had been bought as ads, roughly what would that cost?",
        "EMV is for comparing videos, creators and campaigns on one scale. It is not revenue and not a creator's fee. To price a sponsored TikTok, use the <a href=\"../tiktok-pricing-calculator/\">TikTok pricing calculator</a>.",
      ],
    },
    {
      h: "How the calculator values each action",
      table: {
        head: ["Action", "Value used"],
        rows: [
          ["Views", "$6 per 1,000, or your own rate (range shown: $3 to $12)"],
          ["Likes", "$0.05 each"],
          ["Comments", "$0.50 each"],
          ["Shares", "$1.50 each"],
          ["Saves (optional)", "$0.40 each"],
        ],
      },
      after: [
        "<b>EMV = views / 1,000 x view rate + likes x $0.05 + comments x $0.50 + shares x $1.50 + saves x $0.40</b>",
        "Likes are cheap on TikTok because a double tap takes no effort, so they carry a lower rate than on Instagram. Shares send a video to new people, so they carry the most. These rates are Passive Array's editorial assumptions, not TikTok prices. If you know your own TikTok ad cost per 1,000 views, enter it.",
      ],
    },
    {
      h: "Worked example",
      p: ["A creator campaign earns 300,000 views, 21,000 likes, 640 comments, 900 shares and 1,500 saves, valued with the default $6 per 1,000 views."],
      table: {
        head: ["Line", "Sum", "Value"],
        rows: [
          ["Views", "300,000 / 1,000 x $6", "$1,800"],
          ["Likes", "21,000 x $0.05", "$1,050"],
          ["Comments", "640 x $0.50", "$320"],
          ["Shares", "900 x $1.50", "$1,350"],
          ["Saves", "1,500 x $0.40", "$600"],
          ["<b>Earned media value</b>", "", "<b>$5,120</b>"],
        ],
      },
    },
    {
      h: "Using EMV well",
      list: [
        "<b>Keep the rates fixed</b> across every campaign you compare.",
        "<b>Compare like with like</b>: the same number of videos, measured after the same number of days.",
        "<b>Report EMV next to real results</b> such as clicks, codes used or sales.",
      ],
      after: ["Comparing platforms? The <a href=\"../youtube-emv-calculator/\">YouTube</a> and <a href=\"../instagram-emv-calculator/\">Instagram</a> EMV calculators use the same approach."],
    },
  ],
  faq: [
    ["What is EMV on TikTok?", "Earned media value: an estimate of what a TikTok's views and engagement would have cost as paid ads. It compares campaigns; it is not revenue."],
    ["How is TikTok EMV calculated?", "Views are valued per 1,000 (default $6, or your own rate), then likes, comments, shares and saves are added at fixed rates. Every line is shown in the result."],
    ["Where do I find saves and shares?", "Shares and saves show on every TikTok under the like and comment icons, and in the video's analytics if it is your own."],
    ["Is EMV what I should charge a brand?", "No. EMV values attention after the fact. Use the TikTok pricing calculator to price a sponsored post before it runs."],
    ["Is it free?", "Yes. It runs in your browser with no account."],
  ],
};
