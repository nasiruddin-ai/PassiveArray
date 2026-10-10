// Guide and FAQ for /creator-tools/instagram-engagement-rate-calculator/. Merged into tools.js by build-tools.js.
// Numbers match COMPUTE["instagram-engagement-rate-calculator"], IG_TIERS, igER() and grade() in public/shared.js:
// ER = (likes + comments) / followers x 100; tiers nano 4.0, micro 2.0, mid 1.4, macro 1.1, mega 0.8;
// grade by ratio to tier average: Low < 0.5, Below average < 0.85, Average < 1.25, Good < 1.6, Excellent 1.6+.
module.exports = {
  seoTitle: "Instagram Engagement Rate Calculator: Free | Passive Array",
  seoDescription: "Work out any Instagram account's engagement rate from followers, likes and comments, then see how it compares with accounts of the same size. Free, no sign-up.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this Instagram engagement rate calculator shows",
      p: ["Type three numbers: followers, average likes per post and average comments per post. You get:"],
      list: [
        "<b>The engagement rate</b>, with the sum behind it written out so you can check it.",
        "<b>A grade</b> from Low to Excellent, measured against the typical rate for the account's size, not one fixed number.",
        "<b>The tier</b> the account falls in, and the typical rate for that tier.",
        "<b>Like rate and comment rate</b> as separate shares of followers.",
        "<b>Comments per 100 likes</b>, a quick check on whether the likes come with real conversation.",
      ],
      after: ["Instagram has no free public API that lets a website read any account's numbers. So this tool does not fetch anything. It works from the numbers you type, and nothing you enter is stored."],
    },
    {
      h: "How to calculate Instagram engagement rate",
      p: [
        "The calculator uses the most common formula, the one brands use when they compare creators:",
        "<b>Engagement rate = (average likes + average comments) / followers x 100</b>",
        "Take an account with 25,000 followers whose recent posts average 900 likes and 40 comments. That is 940 / 25,000 x 100 = <b>3.76%</b>. The account is in the micro tier, where the typical rate is 2.0%, so it sits at 1.88 times the typical rate and is graded Excellent. Its like rate is 3.6%, and it gets 4.4 comments per 100 likes.",
        "Saves, shares and views are not in this formula. They matter for reach, but only the account owner can see them, so a formula built on public numbers leaves them out.",
      ],
    },
    {
      h: "Where to find the numbers in the Instagram app",
      ordered: true,
      list: [
        "<b>Followers.</b> Shown at the top of any profile. Instagram rounds large counts, so tap through or use your best exact figure.",
        "<b>Likes and comments.</b> Open each of the last 12 posts and note the like count and the comment count. Add them up and divide by the number of posts. Skip a post if it was a paid ad or a giveaway, because those distort the average.",
        "<b>Your own account.</b> If you have a professional (creator or business) account, open the Professional dashboard or tap <b>View insights</b> under a post. Insights show likes, comments, saves and shares per post, and you can see like counts even if you have hidden them from others.",
      ],
      after: [
        "Menu names in the app change from time to time. As of October 2026 the per-post figures are under the post's insights, and the account-wide figures are in the Professional dashboard. Check the app if the labels have moved.",
        "If an account hides its like counts, you cannot calculate its rate from the outside. Ask the creator for a screenshot of their insights instead. Our guide on <a href=\"../../blog/how-to-vet-an-influencer-before-you-pay/\">vetting a creator before you pay</a> lists what else to ask for.",
      ],
    },
    {
      h: "What is a good engagement rate on Instagram?",
      p: ["It depends on size. Typical rates fall as accounts grow, because a smaller share of a large audience sees each post. These are the benchmarks the calculator grades against:"],
      table: {
        head: ["Tier", "Followers", "Typical engagement rate"],
        rows: [
          ["Nano", "Under 10K", "4.0%"],
          ["Micro", "10K to 100K", "2.0%"],
          ["Mid", "100K to 500K", "1.4%"],
          ["Macro", "500K to 1M", "1.1%"],
          ["Mega", "Over 1M", "0.8%"],
        ],
      },
      after: [
        "The grade compares your rate with your tier's typical rate. Under half of it is Low. Half to 85% is Below average. 85% to 125% is Average. 125% to 160% is Good. 160% or more is Excellent.",
        "So 2% is Average for a micro account and Excellent for a mega account. To place any rate on the full table, use the <a href=\"../instagram-engagement-rate-benchmark/\">engagement rate benchmark</a> tool. Our article on <a href=\"../../blog/instagram-engagement-rate-by-follower-count/\">Instagram engagement rate by follower count</a> explains why the curve looks like this.",
      ],
    },
    {
      h: "How to read the result, and its limits",
      list: [
        "<b>Use recent posts.</b> Posts from the last 30 to 60 days reflect the audience the account has now. A two-year-old viral post says little about today.",
        "<b>Watch comments per 100 likes.</b> Real audiences leave a small but steady stream of comments. When comments fall under 0.3% of likes, the <a href=\"../instagram-fake-follower-checker/\">fake follower estimator</a> flags it as a sign of bought likes.",
        "<b>Niche matters.</b> The tiers are the same for every niche. Some niches run above them and some below, so compare with accounts like yours where you can, for example with <a href=\"../instagram-account-comparison/\">compare Instagram accounts</a>.",
        "<b>Followers-based rates favour small accounts.</b> That is why the grade is relative to size. Never compare a raw 5% on a 3,000-follower account with a raw 1% on a 2M-follower account without the tier next to it.",
      ],
      after: ["If you are pricing a deal, take the rate straight into the <a href=\"../instagram-pricing-calculator/\">Instagram pricing calculator</a>, which moves the price up or down by how the rate compares with the tier."],
    },
  ],
  faq: [
    ["How do you calculate engagement rate on Instagram?", "Add average likes and average comments per post, divide by followers, and multiply by 100. An account with 10,000 followers averaging 380 likes and 20 comments has a 4% engagement rate."],
    ["What is a good engagement rate on Instagram in 2026?", "It depends on the account's size. The calculator treats about 4% as typical under 10K followers, 2% from 10K to 100K, 1.4% to 500K, 1.1% to 1M and 0.8% above. Anything 1.25 times the typical rate or more is graded Good."],
    ["Can I check someone else's Instagram engagement rate?", "Yes, if their like counts are visible. Note their follower count and the likes and comments on their last 12 posts, then type the averages in. Instagram has no free public API, so no site can pull these numbers for you without a login."],
    ["Should I divide by followers or by reach?", "This calculator divides by followers, because that is the number anyone can see. Engagement by reach is often higher and only the account owner can see reach, in Insights. If you quote a rate to a brand, say which one it is."],
    ["How many posts should I average?", "The last 12 is a good default. Leave out ads, giveaways and anything older than about 60 days, so one unusual post does not move the average."],
    ["Why is my engagement rate dropping as I grow?", "That is normal. Newer followers see fewer of your posts over time, so the share who engage falls. The grade already allows for this by comparing you with accounts of your size."],
    ["Does this include saves, shares and views?", "No. Only the account owner can see those numbers. To value them for a campaign report, use the <a href=\"../instagram-emv-calculator/\">earned media value calculator</a>."],
    ["Is the Instagram engagement rate calculator free?", "Yes. No sign-up, no login and no limit. The maths runs in your browser."],
  ],
};
