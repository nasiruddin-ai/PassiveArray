// Long-form guide for /creator-tools/youtube-money-calculator/. Merged into tools.js by build-tools.js.
// Every number here matches COMPUTE["youtube-money-calculator"] and ytMonthlyViews() in public/shared.js.
module.exports = {
  seoTitle: "YouTube Money Calculator: How Much YouTubers Make | Passive Array",
  seoDescription: "Estimate how much a YouTube channel earns from ads. Free, no sign-up: paste a link or @handle for monthly and yearly earnings as a range, with an editable RPM.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this YouTube money calculator shows",
      p: ["Paste any channel and you get an estimate of its ad earnings, always as a range from a low to a high figure:"],
      list: [
        "<b>Estimated monthly earnings</b>, with the monthly view count it is based on and where that count came from.",
        "<b>Estimated yearly earnings</b>, which is the monthly range times 12.",
        "<b>Estimated earnings per video</b>, based on average views on the channel's last 10 uploads.",
        "<b>The RPM range used</b>, so you can see exactly which assumption produced the result.",
        "<b>Uploads per month</b>, worked out from the dates of recent uploads.",
      ],
      after: ["The defaults are a low RPM of $0.50 and a high RPM of $4 per 1,000 views. Change either box and the estimate updates. If half or more of the recent uploads are Shorts, the result carries a warning, because Shorts pay far less per view."],
    },
    {
      h: "How much does YouTube pay per 1,000 views?",
      p: [
        "There is no single rate. There is a formula and a range. The calculator uses the same formula for every channel:",
        "<b>Earnings = views / 1,000 x RPM</b>",
        "RPM, revenue per mille, is what a creator keeps for every 1,000 views after YouTube takes its share. At the calculator's default range, that works out like this:",
      ],
      table: {
        head: ["Views", "At $0.50 RPM", "At $4 RPM"],
        rows: [
          ["1,000", "$0.50", "$4"],
          ["10,000", "$5", "$40"],
          ["100,000", "$50", "$400"],
          ["1,000,000", "$500", "$4,000"],
        ],
      },
      after: ["So for most long-form channels, 1,000 views earn somewhere between fifty cents and four dollars. A few niches earn more. Our article on <a href=\"../../blog/how-much-does-youtube-pay-for-1000-views/\">how much YouTube pays for 1,000 views</a> walks through why the range is this wide."],
    },
    {
      h: "RPM vs CPM: which number should you use?",
      p: [
        "<b>CPM</b> is what advertisers pay for 1,000 ad impressions. <b>RPM</b> is what the creator earns for 1,000 video views. RPM is always lower, for two reasons.",
        "First, YouTube keeps a share. On long-form videos the creator gets 55 percent of ad revenue and YouTube keeps 45 percent. Second, not every view shows an ad. Some viewers use ad blockers, some videos get no ad in a given auction, and some ads are skipped before they pay.",
        "That is why this calculator asks for RPM, not CPM. A channel can report a high CPM and a much lower RPM in the same month, and only the RPM is money in the bank. More detail is in <a href=\"../../blog/how-much-does-youtube-pay-per-view/\">how much YouTube pays per view</a>.",
      ],
    },
    {
      h: "Why YouTube RPM varies by niche and country",
      p: ["Advertisers pay more to reach some viewers than others. Use this as a rough guide when you set the RPM boxes:"],
      table: {
        head: ["Channel type", "Where RPM tends to sit"],
        rows: [
          ["Music, kids and entertainment", "Near the low end of the default range"],
          ["Education, how-to and lifestyle with a mostly English-speaking audience", "Toward the high end of the default range"],
          ["Finance, business and tech", "Can go above $10 per 1,000 views"],
          ["Mostly Shorts", "Far below the long-form range; the tool assumes around $0.05 to $0.10"],
        ],
      },
      after: [
        "Other things move RPM too. Viewers in countries with large ad markets earn more per view. Videos of eight minutes or longer can carry mid-roll ads, which adds impressions. Videos set as made for kids cannot show personalised ads, which lowers what they earn.",
        "If it is your own channel, ignore the defaults after a month or two. YouTube Studio shows your real RPM in the revenue section of Analytics. Put that number in both boxes for a much tighter forecast.",
      ],
    },
    {
      h: "How the calculator estimates monthly views, and its limits",
      ordered: true,
      list: [
        "It reads the channel's last 10 uploads through the official YouTube API.",
        "If 2 or more of them were published in the last 30 days, it adds up the views on those videos. That is the monthly view count.",
        "If fewer than 2 were, it multiplies average views on the last 10 uploads by uploads per month, counting at least one upload a month.",
        "It multiplies that view count by your low and high RPM.",
      ],
      after: [
        "This is an estimate from public data, so it has blind spots. Views on older videos are not counted, which makes the figure low for channels with a strong back catalogue. A channel that posts more than 10 videos a month is undercounted too, because only 10 uploads are read. And the tool cannot see whether a channel is in the Partner Program at all. Check that first with the <a href=\"../youtube-monetization-checker/\">YouTube monetization checker</a>.",
        "Ads are also only one income line. Sponsorships, channel memberships, Super Thanks and merchandise are not included. For many mid-sized channels a single sponsorship pays more than a month of ads. Run the same channel through the <a href=\"../youtube-sponsorship-price-calculator/\">sponsorship price calculator</a> to compare.",
      ],
    },
  ],
  faq: [
    ["Is this YouTube money calculator accurate?", "It gives a realistic range, not an exact figure. The view count comes from YouTube's public data, but RPM is private to each creator. Only YouTube Studio knows a channel's real earnings. If you use your own RPM from Studio, the estimate gets much closer."],
    ["How much does a YouTuber with 100,000 views a month make?", "At the default RPM range of $0.50 to $4, 100,000 monthly views earn roughly $50 to $400 a month from ads. Finance, business and tech channels can earn more; music and kids channels usually earn less."],
    ["How much does YouTube pay for 1 million views?", "At $0.50 to $4 RPM, 1 million long-form views earn about $500 to $4,000. In high-paying niches the figure can be higher. The same number of Shorts views earns far less."],
    ["How much does YouTube pay after 1,000 subscribers?", "Subscribers do not earn money on their own. A channel earns from ads only after it joins the YouTube Partner Program, and then it earns per view, not per subscriber. Check the current requirements in YouTube Studio under Earn, or see our <a href=\"../youtube-monetization-checker/\">monetization checker</a> for the thresholds."],
    ["Does the calculator include Shorts earnings?", "No. It applies a long-form RPM to the views it counts. If half or more of a channel's recent uploads are Shorts, it shows a warning, because Shorts pay a small fraction per view. See <a href=\"../../blog/how-much-does-youtube-pay-for-shorts/\">how much YouTube pays for Shorts</a>."],
    ["Can I see how much any YouTuber makes?", "You can estimate it. The calculator works on any public channel, but no outside tool can see real earnings, and it cannot confirm the channel is monetized. Treat the result as a bracket, not a payslip."],
    ["What RPM should I use for my niche?", "Start with the defaults of $0.50 to $4. Lower the high figure for music, kids or entertainment content. Raise it for finance, business or tech, where RPM can pass $10. Once you are monetized, use the RPM YouTube Studio shows you."],
    ["Is this YouTube money calculator free?", "Yes. There is no sign-up and no limit beyond a fair daily quota shared by all visitors."],
  ],
};
