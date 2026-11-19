// Long-form guide for /creator-tools/youtube-cpm-calculator/. Matches COMPUTE["youtube-cpm-calculator"]:
// CPM = cost / impressions x 1000 (and inverses), playback-based CPM, 55% long-form share (YouTube Help 72902, 9314357).
module.exports = {
  seoTitle: "YouTube CPM Calculator: CPM, Ad Cost and Impressions | Passive Array",
  seoDescription: "Free YouTube CPM calculator. Work out CPM from ad cost and impressions, or cost and impressions from a CPM, plus playback-based CPM and the creator's 55% share.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "How to calculate CPM",
      ordered: true,
      list: [
        "Choose what you want to find: the CPM, the ad cost, or the number of impressions.",
        "Fill in the other two numbers. For CPM, that is what the ads cost and how many ad impressions they got.",
        "Add monetized playbacks if you have them, to see the playback-based CPM YouTube Analytics also reports.",
      ],
      p: ["The formula is simple: <b>CPM = ad cost / ad impressions x 1,000</b>. $7 spent on 2,000 impressions is a CPM of $3.50. The starting numbers in the calculator are YouTube Help's own worked example, so you can check the result against it."],
    },
    {
      h: "CPM and playback-based CPM",
      p: [
        "YouTube Analytics shows two CPM figures. YouTube Help defines <b>CPM</b> as \"The cost an advertiser pays for 1,000 ad impressions\", and <b>playback-based CPM</b> as \"The cost an advertiser pays for 1,000 video playbacks where an ad is displayed.\"",
        "A view can show more than one ad, so playback-based CPM is usually the higher of the two. In Help's example, 1,000 views had one ad and 500 had two: 2,000 ad impressions but 1,500 monetized playbacks. At $7 in total, CPM is $3.50 and playback-based CPM is $4.67.",
      ],
    },
    {
      h: "CPM is not what the creator earns",
      table: {
        head: ["Metric", "Who it is for", "What it measures"],
        rows: [
          ["CPM", "Advertisers", "Ad cost per 1,000 ad impressions, before YouTube's revenue share"],
          ["Playback-based CPM", "Advertisers", "Ad cost per 1,000 playbacks that showed at least one ad"],
          ["RPM", "Creators", "Total revenue per 1,000 views, after YouTube's share, across all views"],
        ],
      },
      p: [
        "YouTube Help says that for ads on a partner's long-form videos, YouTube pays them 55% of net revenue. For Shorts, partners receive 45% of the revenue allocated to them from the Creator Pool. The calculator applies 55% to the ad cost as an upper estimate of the creator's part.",
        "What a channel actually earns per 1,000 views is RPM, which is lower than CPM because it is after the revenue share and counts views with no ad. Use the <a href=\"../youtube-rpm-calculator/\">RPM calculator</a> for that, and read <a href=\"../../blog/what-is-cpm-on-youtube/\">what CPM on YouTube means</a> for the full picture.",
      ],
    },
    {
      h: "For advertisers and brand deals",
      p: [
        "The same formula works for any ad campaign: enter a budget and a CPM to see how many impressions it buys, or a CPM and an impression target to see the cost.",
        "Brands sometimes price creator sponsorships per 1,000 views too. That is a different market from ad CPM; the <a href=\"../youtube-sponsorship-price-calculator/\">sponsorship price calculator</a> works from a channel's real average views.",
      ],
    },
  ],
  faq: [
    ["How is CPM calculated?", "Divide the ad cost by the number of ad impressions and multiply by 1,000. For example, $7 for 2,000 impressions is $7 / 2,000 x 1,000 = $3.50 CPM."],
    ["What is the difference between CPM and RPM on YouTube?", "YouTube Help: CPM is the cost per 1,000 ad impressions before YouTube's revenue share. RPM is your total revenue, after the revenue share, per 1,000 views, including views that showed no ad. RPM is the number that tells a creator what they earn."],
    ["How much of the CPM does a YouTuber get?", "For ads on long-form videos, YouTube Help says partners receive 55% of net ad revenue. Because RPM spreads that over every view, including views with no ad, what you earn per 1,000 views is lower than 55% of the CPM."],
    ["Why is my playback-based CPM higher than my CPM?", "Because some playbacks show more than one ad. The same ad spend divided by fewer playbacks than impressions gives a higher figure."],
    ["What is a good CPM on YouTube?", "There is no single figure. CPM depends on the niche, the audience's country, the season and the ad formats running. Compare your own CPM month to month in YouTube Analytics rather than against a published average."],
  ],
};
