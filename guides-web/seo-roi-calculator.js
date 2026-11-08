// Long-form guide for /seo-roi-calculator/.
// Every formula here matches calculate() in seo-roi-calculator/index.html.
// The page already has its own FAQ and ROI benchmark table; this guide avoids repeating them.
module.exports = {
  seoTitle: "SEO ROI Calculator: Estimate Traffic and Revenue | Passive Array",
  seoDescription: "Estimate what first-page Google rankings are worth. Free SEO ROI calculator: visitors, conversions, revenue, profit and ROI from your own numbers. No sign-up.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this SEO ROI calculator estimates",
      p: ["Enter six numbers about your rankings and your business, and the calculator shows:"],
      list: [
        "<b>Total estimated searches</b> a month across the keywords you rank for.",
        "<b>Expected monthly visitors</b> from those searches.",
        "<b>Monthly conversions,</b> meaning sales or enquiries.",
        "<b>Estimated monthly revenue</b> and the same figure for a year.",
        "<b>Monthly profit after SEO cost</b> and <b>SEO ROI</b> as a percentage, once you enter what SEO costs you.",
      ],
      after: ["Results update as you type. The calculation runs in your browser, so the numbers you enter are not sent anywhere. Copy link saves every input in the address, so you can share a scenario or come back to it later."],
    },
    {
      h: "How to calculate SEO ROI",
      p: [
        "The calculator chains five simple steps. Here they are with a second example, different from the one on the page:",
      ],
      table: {
        head: ["Step", "Formula", "Example"],
        rows: [
          ["Searches", "keywords x average monthly search volume", "20 x 500 = 10,000"],
          ["Visitors", "searches x visit %", "10,000 x 10% = 1,000"],
          ["Conversions", "visitors x conversion rate", "1,000 x 2% = 20"],
          ["Revenue", "conversions x average sale value", "20 x $250 = $5,000"],
          ["ROI", "(revenue - SEO cost) / SEO cost x 100", "($5,000 - $1,500) / $1,500 = 233%"],
        ],
      },
      after: [
        "At that ROI, every $1 spent on SEO brings back $3.33 in revenue. The calculator shows that line under the result.",
        "Conversions are displayed as whole numbers, but revenue uses the exact fraction, so small inputs are not rounded down to zero.",
      ],
    },
    {
      h: "Where to find honest numbers for each input",
      p: ["The output is only as good as what goes in. These sources give you real figures instead of guesses:"],
      list: [
        "<b>Keywords on the first page:</b> Google Search Console, under Performance. Filter for queries with an average position of 10 or better and count them. Leave out your brand name if you want to measure new demand only.",
        "<b>Search volume:</b> Google Keyword Planner or a paid SEO tool. Every source is an estimate, and Keyword Planner may show broad ranges. Use the middle of the range across your keywords, not your single biggest term.",
        "<b>Visit %:</b> Search Console also shows your actual click-through rate for those queries. Your own figure beats any industry average.",
        "<b>Conversion rate:</b> your analytics, filtered to organic search visitors.",
        "<b>Value of a sale or lead:</b> your average order value, or for leads, the average deal size times the share of leads that become customers.",
      ],
    },
    {
      h: "Revenue ROI or profit ROI: which one are you measuring?",
      p: [
        "The calculator works from revenue. That is the standard way SEO ROI is quoted, but it flatters the result, because a sale is not all profit. A shop with a 30 percent margin that shows 200 percent ROI on revenue is losing money once the cost of the goods is paid.",
        "To see ROI on profit instead, enter the <b>profit</b> from a typical sale in the average value box rather than the price. The rest of the calculation stays the same, and the ROI it shows is the one that pays the bills.",
        "The break-even point follows from the same numbers. Divide your monthly SEO cost by the value of one conversion to get the conversions you need each month just to cover it. At $1,500 a month and $250 a sale, that is 6 sales.",
      ],
    },
    {
      h: "Why real SEO results differ from the estimate",
      list: [
        "<b>Rankings are not even.</b> The calculator applies one visit % to every keyword. In reality, the top few positions take far more clicks than the bottom of page one.",
        "<b>Search volume is modelled.</b> Every tool estimates it, and the estimates disagree.",
        "<b>Not every search ends in a click.</b> Answers, maps and AI summaries on the results page satisfy some searchers before they reach any site.",
        "<b>Demand moves with the season.</b> A monthly average hides busy and quiet months.",
        "<b>SEO takes time.</b> Costs start on day one, while rankings and traffic build over months. Early months often show a negative ROI.",
        "<b>Some value is missed.</b> Repeat customers, and visitors who come back later through another channel, are not counted.",
      ],
      after: ["Use the result as a scenario, not a promise. Run a cautious version and a hopeful version and plan around the gap. Choosing a name for a new site first? The <a href=\"/domain-finder/\">domain finder</a> checks which names are free, and the <a href=\"/plagiarism-checker/\">plagiarism checker</a> makes sure the content you publish is your own."],
    },
  ],
  faq: [
    ["How do you calculate SEO ROI?", "ROI = (revenue from organic search - SEO cost) / SEO cost x 100. The calculator estimates the revenue from your rankings, search volume, click rate, conversion rate and sale value, then applies that formula."],
    ["What is a break-even point for SEO?", "It is the number of conversions that covers your SEO cost. Divide the monthly cost by the value of one conversion. Anything above that number is return."],
    ["Should I use revenue or profit in the calculator?", "Revenue gives the figure most agencies quote. Profit gives the truer one. Enter the profit per sale in the average value box to see ROI on profit."],
    ["Does the currency setting convert my numbers?", "No. It changes the symbol and number format only. Enter every amount in the currency you choose. The options are Indian rupee, US dollar, euro, British pound and UAE dirham."],
    ["Can I share my SEO ROI estimate?", "Yes. Click Copy link. The link contains every input, so whoever opens it sees the same numbers and result."],
    ["Can I use this to check an SEO agency's quote?", "Yes. Enter the agency's monthly fee as the SEO cost, then the rankings they promise. If the result only works with very optimistic inputs, ask them to explain theirs."],
    ["Is the SEO ROI calculator free?", "Yes. There is no sign-up, and nothing you type leaves your browser."],
  ],
};
