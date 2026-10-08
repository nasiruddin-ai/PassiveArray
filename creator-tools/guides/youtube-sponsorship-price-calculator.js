// Long-form guide for /creator-tools/youtube-sponsorship-price-calculator/. Merged into tools.js by build-tools.js.
// Multipliers, CPM defaults and engagement thresholds match COMPUTE["youtube-sponsorship-price-calculator"] in public/shared.js.
module.exports = {
  seoTitle: "YouTube Sponsorship Calculator: What to Charge | Passive Array",
  seoDescription: "What to charge for a YouTube sponsorship. Free, no sign-up: paste a channel to price an integration, a dedicated video and a Shorts mention from real views.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this YouTube sponsorship calculator shows",
      p: ["Paste any channel and you get a price range for the three most common sponsorship formats, plus the numbers a brand will look at:"],
      list: [
        "<b>60-second integration</b>: a sponsor segment inside a normal video. This is the base price.",
        "<b>Dedicated video</b>: a whole video about the product, priced at 1.75 times an integration.",
        "<b>Shorts mention</b>: a sponsor mention in a Short, priced at 0.25 times an integration.",
        "<b>Engagement rate by views</b>, with a grade from Low to Excellent.",
        "<b>Average views on the last 10 uploads</b> and the subscriber count.",
      ],
      after: ["The defaults assume brands pay $20 to $50 per 1,000 views. You can change both numbers to match your niche."],
    },
    {
      h: "How much should I charge for a sponsored YouTube video?",
      p: [
        "Price it the way brands do: on the views the sponsor read will get. The calculator uses one formula:",
        "<b>Integration price = average views / 1,000 x CPM</b>",
        "Here CPM is what a brand pays per 1,000 views of a sponsored placement. It is not the ad CPM in YouTube Studio, and it is far higher than ad RPM, because the creator is recommending the product personally.",
        "Example: a channel averages 40,000 views on its last 10 uploads. At $20 to $50 CPM, an integration is 40 x $20 = $800 to 40 x $50 = $2,000. A dedicated video is $1,400 to $3,500. A Shorts mention is $200 to $500.",
      ],
      after: ["Quote the range, not one number. A range shows the brand you understand what moves the price, and gives both sides room to agree. Our full walkthrough is in <a href=\"../../blog/how-much-to-charge-for-a-sponsored-youtube-video/\">how much to charge for a sponsored YouTube video</a>."],
    },
    {
      h: "Integration vs dedicated video vs Shorts mention",
      table: {
        head: ["Format", "Price vs integration", "Why"],
        rows: [
          ["60-second integration", "1x", "The standard unit most deals are quoted in"],
          ["Dedicated video", "1.75x", "The whole video is the ad, and it takes one of your upload slots"],
          ["Shorts mention", "0.25x", "Short attention and fewer ways to click through"],
        ],
      },
      after: ["All three are based on the channel's average views across its last 10 uploads, which can mix long videos and Shorts. If your Shorts get very different views from your long videos, price each format from its own average views and say so in the pitch."],
    },
    {
      h: "Why brands price on views, not subscribers",
      p: [
        "A subscriber count shows how many people once clicked a button. Average views show how many people will see the sponsor message. A channel with 500,000 subscribers and 30,000 views a video is a 30,000-view channel to a brand. A smaller channel with higher average views earns more per deal.",
        "Engagement moves the price too. The calculator adjusts for it in a simple, visible way:",
      ],
      table: {
        head: ["Engagement rate by views", "Adjustment"],
        rows: [
          ["Above 4%", "Price raised by 20%"],
          ["1.5% to 4%", "No change"],
          ["Below 1.5%", "Price lowered by 20%"],
        ],
      },
      after: [
        "Engagement rate here is likes plus comments divided by views, averaged over the last 10 uploads. Check the full breakdown with the <a href=\"../youtube-engagement-rate-calculator/\">YouTube engagement rate calculator</a>.",
        "Niche and audience country matter as much as engagement. Finance, software and business audiences usually justify the top of the CPM range or more. Entertainment and general vlogs usually sit near the bottom. A mostly US, UK, Canadian or Australian audience tends to command more than the same views from a global audience.",
      ],
    },
    {
      h: "What to add on top, and how to negotiate",
      list: [
        "<b>Usage rights.</b> If the brand wants to run your video as its own ad, charge extra. The calculator suggests 20 to 50 percent on top, for a set period.",
        "<b>Exclusivity.</b> Agreeing not to work with competitors for a few months costs you future deals. Charge 20 to 50 percent for that too.",
        "<b>Bundles.</b> Several integrations across several videos can cost less per video and more in total. Brands like bundles because they lower risk.",
        "<b>Tracked links and codes.</b> Fine to include, but keep a flat fee. Do not let a commission replace it.",
        "<b>Your first price.</b> Do not undercharge to land the first deal. The rate you set tends to stick.",
      ],
      after: ["Put the numbers in a one-page media kit: average views, engagement rate and audience countries. Our guide to <a href=\"../../blog/how-to-make-a-creator-media-kit/\">making a creator media kit</a> shows what brands read. To see what the same channel earns from ads alone, try the <a href=\"../youtube-money-calculator/\">YouTube money calculator</a>."],
    },
  ],
  faq: [
    ["How much do YouTubers charge for sponsored videos?", "Most price on average views. At the calculator's default of $20 to $50 per 1,000 views, a channel averaging 10,000 views would charge about $200 to $500 for a 60-second integration, and 100,000 views would mean about $2,000 to $5,000. Niche, audience country and engagement move it up or down."],
    ["How much should a small YouTuber charge for a sponsorship?", "Use the same formula at any size. A channel averaging 5,000 views would quote about $100 to $250 for an integration at the default CPM. Small channels with high engagement can push toward the top of the range."],
    ["Should I price a sponsorship on subscribers or views?", "Views. Brands pay for the people who will see the sponsor read, and average views on recent uploads measure that. Subscriber counts include people who no longer watch."],
    ["What CPM should I use for a YouTube sponsorship?", "Start with the defaults of $20 to $50 per 1,000 views. Raise them for finance, software, business or high-ticket hobby niches. Lower them for entertainment or a mostly global audience. Treat the result as a negotiation band, not a fixed rate."],
    ["How much should I charge for a dedicated YouTube video?", "The calculator prices a dedicated video at 1.75 times a 60-second integration, because the whole video is about the product. Add usage rights or exclusivity on top if the brand asks for them."],
    ["How much is a YouTube Shorts sponsorship worth?", "The calculator prices a Shorts mention at a quarter of an integration. If your Shorts get far more or fewer views than your long videos, adjust from your Shorts' own average views."],
    ["Do I have to disclose a YouTube sponsorship?", "Yes. As of October 2026, YouTube asks creators to tick the paid promotion box in YouTube Studio for sponsored videos, and advertising rules in many countries also require a clear spoken or written disclosure. Confirm the current rules in YouTube Studio and your local regulator's guidance."],
    ["Is this sponsorship price calculator free?", "Yes. There is no sign-up and no limit beyond a fair daily quota shared by all visitors."],
  ],
};
