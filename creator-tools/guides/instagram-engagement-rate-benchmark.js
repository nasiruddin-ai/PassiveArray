// Guide and FAQ for /creator-tools/instagram-engagement-rate-benchmark/. Merged into tools.js by build-tools.js.
// Numbers match COMPUTE["instagram-engagement-rate-benchmark"], IG_TIERS, tier() and grade() in public/shared.js:
// tier averages 4.0 / 2.0 / 1.4 / 1.1 / 0.8; table columns Low < 0.5x, Average 1x, Good 1.25x+, Excellent 1.6x+.
// Tier boundaries use followers < max, so exactly 10,000 is micro, 100,000 mid, 500,000 macro, 1,000,000 mega.
module.exports = {
  seoTitle: "Instagram Engagement Rate Benchmark by Followers | Passive Array",
  seoDescription: "Is your Instagram engagement rate good for your size? Enter followers and a rate to see it on the nano to mega benchmark table, graded Low to Excellent. Free.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this engagement rate benchmark tool does",
      p: [
        "You already have an engagement rate and want to know whether it is good. Enter the follower count and the rate. The tool finds the account's tier, grades the rate against that tier's typical figure, and shows the full benchmark table with your tier in bold.",
        "If you do not have a rate yet, work it out first with the <a href=\"../instagram-engagement-rate-calculator/\">Instagram engagement rate calculator</a> from followers, likes and comments.",
        "Instagram has no free public API for these numbers, so nothing is fetched. The tool only compares the two numbers you type.",
      ],
    },
    {
      h: "Average Instagram engagement rate by follower count",
      p: ["These are the exact cut-offs the tool uses. Each column is a multiple of the tier's typical rate: Low is under half of it, Good is 1.25 times or more, Excellent is 1.6 times or more."],
      table: {
        head: ["Tier", "Followers", "Low", "Typical", "Good", "Excellent"],
        rows: [
          ["Nano", "Under 10K", "Under 2.0%", "4.0%", "5.0%+", "6.4%+"],
          ["Micro", "10K to 100K", "Under 1.0%", "2.0%", "2.5%+", "3.2%+"],
          ["Mid", "100K to 500K", "Under 0.7%", "1.4%", "1.75%+", "2.24%+"],
          ["Macro", "500K to 1M", "Under 0.55%", "1.1%", "1.375%+", "1.76%+"],
          ["Mega", "Over 1M", "Under 0.4%", "0.8%", "1.0%+", "1.28%+"],
        ],
      },
      after: [
        "On the page the table is rounded to one decimal, so the mid-tier Good line shows as 1.8%. The grade itself uses the exact figure.",
        "Between Low and Typical there is one more band. A rate from half to 85% of the typical rate is graded Below average. From 85% to 125% it is Average.",
        "Accounts on a boundary go into the larger tier. An account with exactly 10,000 followers is graded as micro, and one with exactly 1,000,000 as mega.",
      ],
    },
    {
      h: "Why engagement rates fall as Instagram accounts grow",
      p: [
        "A small account is followed mostly by people who chose it recently and still see its posts. A very large account is followed by many people who tapped follow years ago and now rarely see it in their feed. The share of followers who see a given post shrinks with size, and the share who like or comment shrinks with it.",
        "That is why a flat rule such as \"3% is good\" misleads. 3% is Average for a nano account, Excellent for a micro account and far above typical for a mega account. A brand comparing creators of different sizes should compare grades, not raw rates. Our article on <a href=\"../../blog/instagram-engagement-rate-by-follower-count/\">engagement rate by follower count</a> goes into the curve in more detail.",
      ],
    },
    {
      h: "How to use the benchmark: three examples",
      table: {
        head: ["Account", "Rate", "Tier typical", "Ratio", "Grade"],
        rows: [
          ["6,000 followers", "3.5%", "4.0%", "0.88x", "Average"],
          ["40,000 followers", "3.5%", "2.0%", "1.75x", "Excellent"],
          ["80,000 followers", "1.5%", "2.0%", "0.75x", "Below average"],
        ],
      },
      after: [
        "The same 3.5% means two different things. For the small account it is ordinary. For the 40,000-follower account it is a strong selling point worth quoting to brands, with the benchmark next to it. Our <a href=\"../../blog/how-to-make-a-creator-media-kit/\">media kit guide</a> shows how to put that on one page.",
        "The 80,000-follower account at 1.5% is not in trouble, but it is below its peers. Run its full numbers through the <a href=\"../instagram-audit/\">Instagram account audit</a> to see whether the gap comes from engagement alone or from authenticity, growth or posting pace too.",
      ],
    },
    {
      h: "What the benchmark cannot tell you",
      list: [
        "<b>Niche.</b> The tiers are the same for every niche. Some topics, such as pets and comedy, tend to run high, and some, such as business, tend to run lower. Treat a grade one step either side of Average as normal variation.",
        "<b>How the rate was measured.</b> The benchmarks assume engagement by followers on recent posts. A rate calculated by reach, or from one viral post, will look better than it is. Ask how a quoted rate was worked out.",
        "<b>Where the engagement came from.</b> A high rate can come from bought likes. If the rate is far above typical but comments are almost absent, check it with the <a href=\"../instagram-fake-follower-checker/\">fake follower estimator</a>.",
      ],
    },
  ],
  faq: [
    ["What is the average engagement rate on Instagram?", "The tool uses typical rates by size: 4.0% under 10K followers, 2.0% from 10K to 100K, 1.4% from 100K to 500K, 1.1% from 500K to 1M, and 0.8% above 1M. There is no single average that fits every account."],
    ["Is a 1% engagement rate good on Instagram?", "It depends on size. For an account over 1M followers, 1% is 1.25 times the 0.8% typical, which grades as Good. For a micro account it is exactly half the 2.0% typical, which grades as Below average, one step above Low."],
    ["Is a 5% engagement rate good?", "Yes for almost any size. Under 10K followers it is 1.25 times the 4.0% typical, which grades Good. Above 10K it is Excellent."],
    ["What engagement rate do brands look for?", "Most brands compare a creator with others of the same size rather than with one fixed number. A rate at or above the tier's typical figure, with comments that look real, is what this tool grades as Average or better."],
    ["Where do I find my engagement rate in the Instagram app?", "Insights count interactions, but they do not give you this followers-based rate. Take the likes and comments on your recent posts, which you can see under each post or in its insights, and use the <a href=\"../instagram-engagement-rate-calculator/\">engagement rate calculator</a>. Menus change, so as of October 2026 check the Professional dashboard if you have a creator or business account."],
    ["Do these benchmarks apply to TikTok?", "No. TikTok rates are calculated differently and run much higher. Use the <a href=\"../tiktok-engagement-rate-calculator/\">TikTok engagement rate calculator</a>, which has its own tiers."],
    ["How often are the benchmarks updated?", "They are typical ranges for 2025 to 2026 and are set in the tool's code. If they change, this page and the result will change together."],
    ["Is the Instagram engagement benchmark tool free?", "Yes. No sign-up and no limit. Nothing you enter is stored."],
  ],
};
