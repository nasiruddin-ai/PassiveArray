// Long-form guide for /creator-tools/youtube-rpm-calculator/. Matches COMPUTE["youtube-rpm-calculator"]:
// RPM = revenue / views x 1000, earnings = RPM x views / 1000, views needed = target / RPM x 1000. YouTube Help 9314357.
module.exports = {
  seoTitle: "YouTube RPM Calculator: RPM, Earnings and Views Needed | Passive Array",
  seoDescription: "Free YouTube RPM calculator. Work out your RPM from revenue and views, your earnings from any RPM, or how many views you need to reach an income target.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "How to calculate your YouTube RPM",
      ordered: true,
      list: [
        "In YouTube Studio, open your revenue report and note the estimated revenue and the views for the same period.",
        "Choose RPM, enter both numbers and press Calculate.",
        "Switch to Earnings to project income at that RPM for any number of views, or to Views needed to see what a target income takes.",
      ],
      p: ["The formula: <b>RPM = revenue / views x 1,000</b>. $250 from 100,000 views is an RPM of $2.50, which is a quarter of a cent per view."],
    },
    {
      h: "What RPM includes",
      p: ["YouTube Help defines RPM as \"how much money you've earned per 1,000 video views\". It is the creator's number, after YouTube's share."],
      table: {
        head: ["RPM includes", "RPM does not include"],
        rows: [
          ["Ad revenue, after YouTube's share", "Merchandise and merch shelf sales"],
          ["YouTube Premium revenue", "Brand deals and sponsorships (except YouTube Creator Partnerships)"],
          ["Channel memberships", "Income earned off YouTube, like services or speaking fees"],
          ["Super Chat and Super Stickers", ""],
          ["All views, including those with no ad", ""],
        ],
      },
    },
    {
      h: "Why RPM is lower than CPM",
      p: [
        "YouTube Help gives two reasons: RPM is calculated after YouTube's revenue share, and it includes all views, including ones that were not monetized. CPM is what advertisers paid per 1,000 ad impressions, before the share.",
        "So an RPM can fall even when revenue stays the same, if more of your views had no ads. The <a href=\"../youtube-cpm-calculator/\">CPM calculator</a> covers the advertiser side, and <a href=\"../../blog/why-is-my-youtube-rpm-low/\">why your RPM is low</a> goes through the usual causes.",
      ],
    },
    {
      h: "How YouTube suggests raising RPM",
      list: [
        "Turn on monetization on all eligible videos.",
        "Turn on mid-roll ads on videos long enough to carry them.",
        "Turn on other revenue features, such as channel memberships and Super Chat, each with its own requirements.",
      ],
      p: ["These three steps are from YouTube Help. Beyond them, RPM depends on things you choose more slowly: your niche, your audience's countries and your video length. To estimate any channel's income from its public views, use the <a href=\"../youtube-money-calculator/\">YouTube money calculator</a>."],
    },
  ],
  faq: [
    ["How do I calculate RPM on YouTube?", "Divide your revenue by your views and multiply by 1,000. Use the revenue and the views from the same period in YouTube Studio, for example the last 28 days."],
    ["What is a good RPM on YouTube?", "There is no fixed figure. RPM varies a lot by niche, audience country, video length and time of year. The useful comparison is your own RPM over time, from YouTube Studio."],
    ["How many views do I need to make $1,000 a month?", "Divide $1,000 by your RPM and multiply by 1,000. At a $2 RPM that is 500,000 views a month; at $5 it is 200,000. Choose Views needed in the calculator to try your own RPM."],
    ["Does RPM include Shorts?", "Yes. YouTube Help says that for Shorts, RPM counts all engaged views. Shorts revenue is shared differently from long-form ads: YouTube Help says partners receive 45% of the revenue allocated to them from the Creator Pool, against 55% of net ad revenue on long-form videos."],
    ["Is RPM the same as how much YouTube pays per view?", "Nearly. RPM divided by 1,000 is your average revenue per view across all views. It includes memberships, Premium, Super Chat and Super Stickers as well as ads."],
  ],
};
