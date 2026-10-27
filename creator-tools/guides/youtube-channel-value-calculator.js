// Guide and FAQ for /creator-tools/youtube-channel-value-calculator/. Merged into tools.js by build-tools.js.
// Facts checked against COMPUTE["youtube-channel-value-calculator"] and ytMonthlyViews in public/shared.js.
module.exports = {
  seoTitle: "YouTube Channel Value Calculator: How Much Is a Channel Worth? | Passive Array",
  seoDescription: "Estimate what a YouTube channel is worth from its ad earnings. Set the RPM and the years of earnings, see every input. Free, no sign-up.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "How the channel value is worked out",
      p: ["Every step is on the page, so you can change any assumption you disagree with:"],
      ordered: true,
      list: [
        "<b>Monthly views</b> are the views on videos uploaded in the last 30 days. When fewer than two videos went up, average views on recent uploads times uploads a month is used instead.",
        "<b>Yearly ad earnings</b> = monthly views / 1,000 x RPM x 12, shown as a range from your low and high RPM.",
        "<b>Value</b> = yearly ad earnings x the number of years of earnings you set, low and high.",
      ],
      after: ["RPM is what a creator keeps per 1,000 views after YouTube's share. Our guide to <a href=\"../../blog/how-much-does-youtube-pay-for-1000-views/\">how much YouTube pays per 1,000 views</a> explains why it varies so much by niche and audience country."],
    },
    {
      h: "Why the years of earnings are up to you",
      p: [
        "There is no public price list for YouTube channels and no official valuation method. A channel is a small media business, and people who value small online businesses usually think in terms of how many years of earnings a buyer is paying for.",
        "The calculator starts at 2 to 3 years. That is a starting assumption to adjust, not a market rate. A channel with steady views spread across many videos, several income sources and an owner who is not the face of every video can justify more. A channel that depends on one presenter, one viral video or a niche at risk of policy changes deserves less.",
      ],
    },
    {
      h: "What the estimate leaves out",
      list: [
        "<b>Sponsorships, memberships, Super Thanks and products.</b> These can be worth more than ads. Add them to yearly earnings yourself if you know the figures.",
        "<b>Shorts revenue.</b> Shorts pay far less per view than long videos; the calculator warns you when most recent uploads are Shorts.",
        "<b>Costs.</b> Editing, staff and equipment come out of earnings. A careful valuation uses profit, not revenue.",
        "<b>Whether the channel is monetized at all.</b> Check that first with the <a href=\"../youtube-monetization-checker/\">YouTube monetization checker</a>.",
      ],
    },
  ],
  faq: [
    ["How much is a YouTube channel worth?", "It depends on what it earns and how reliable those earnings are. This calculator estimates yearly ad earnings from recent views and multiplies them by a number of years you choose. Treat the result as a planning range, not an appraisal."],
    ["Is subscriber count used in the value?", "No. Subscribers do not earn money on their own; views do. Subscribers are shown for context only."],
    ["Why is the range so wide?", "RPM varies several times over between niches and audience countries, and the number of years of earnings is a judgement call. Narrow the range by entering the RPM the channel's own YouTube Studio shows."],
    ["Does this include sponsorship income?", "No. Only ad earnings are estimated from public data. Add sponsorship and other income yourself if you have the figures."],
  ],
};
