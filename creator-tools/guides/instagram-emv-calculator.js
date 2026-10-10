// Guide and FAQ for /creator-tools/instagram-emv-calculator/. Merged into tools.js by build-tools.js.
// Weights match COMPUTE["instagram-emv-calculator"] in public/shared.js:
// impressions $6 CPM (range $4 to $10), likes $0.10, comments $0.50, shares $1.50, saves $0.40, link clicks $0.60.
module.exports = {
  seoTitle: "Earned Media Value Calculator for Instagram | Passive Array",
  seoDescription: "Calculate earned media value for an Instagram post or campaign. Enter impressions, likes, comments, shares, saves and clicks to see EMV line by line. Free.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What earned media value means",
      p: [
        "Earned media value, or EMV, puts a dollar figure on the attention a post or campaign earned without paying for it. It asks one question: if you had bought the same impressions, likes, comments, shares, saves and clicks through ads, roughly what would they have cost?",
        "EMV is not revenue and it is not cash. It is a way to compare campaigns, creators and posts on one scale. Its value comes from using the same weights every time, so a $3,000 campaign this quarter can be set honestly against a $2,000 one last quarter.",
      ],
    },
    {
      h: "How to calculate earned media value",
      p: ["The calculator values each action at a fixed rate and adds them up:"],
      table: {
        head: ["Action", "Value used"],
        rows: [
          ["Impressions", "$6 per 1,000 (range $4 to $10)"],
          ["Likes", "$0.10 each"],
          ["Comments", "$0.50 each"],
          ["Shares", "$1.50 each"],
          ["Saves", "$0.40 each"],
          ["Link clicks (optional)", "$0.60 each"],
        ],
      },
      after: [
        "<b>EMV = impressions / 1,000 x $6 + likes x $0.10 + comments x $0.50 + shares x $1.50 + saves x $0.40 + clicks x $0.60</b>",
        "Actions that take more effort, or that spread a post further, are worth more. A share puts the post in front of new people, so it carries the highest weight. The $6 rate for impressions is the calculator's assumption for a typical Instagram ad CPM, the price of 1,000 ad impressions. Real ad prices move with audience, country and season, which is why the result also shows a range using $4 and $10.",
      ],
    },
    {
      h: "Worked example: one sponsored post",
      p: ["A post reaches 250,000 impressions and earns 8,000 likes, 300 comments, 150 shares and 400 saves, with no link clicks."],
      table: {
        head: ["Line", "Sum", "Value"],
        rows: [
          ["Impressions", "250 x $6", "$1,500"],
          ["Likes", "8,000 x $0.10", "$800"],
          ["Comments", "300 x $0.50", "$150"],
          ["Shares", "150 x $1.50", "$225"],
          ["Saves", "400 x $0.40", "$160"],
          ["Earned media value", "", "$2,835"],
        ],
      },
      after: [
        "With impressions valued at $4 instead, EMV falls to $2,335. At $10 it rises to $3,835. In this example impressions are about half the total, so the CPM you assume matters a lot. If your team uses its own CPM from real ad campaigns, apply it consistently and say so in the report.",
        "If the post cost $1,500, an EMV of $2,835 suggests the brand got attention worth almost twice what it paid. That is a useful comparison, not a profit figure. Sales, sign-ups and discount code use are still the numbers that prove a deal paid off.",
      ],
    },
    {
      h: "Where to find the numbers in Instagram Insights",
      p: ["Impressions, shares and saves are private. Only the account owner can see them, so a brand needs the creator to share a screenshot of the post's insights."],
      ordered: true,
      list: [
        "On a professional (creator or business) account, open the post and tap <b>View insights</b>.",
        "Copy the likes, comments, shares and saves, and the link clicks if the post or story had a link.",
        "For impressions, use the views figure. Instagram's insights have moved from impressions to views as the headline count. As of October 2026, use whichever total the app shows for the post, and use the same one every time.",
        "For a whole campaign, add the totals from every post, reel and story, then enter the sums.",
      ],
      after: ["Menus in the app change. If a label has moved, look in the Professional dashboard. Ask creators for insights screenshots when you agree the deal, as our <a href=\"../../blog/how-to-vet-an-influencer-before-you-pay/\">brand's vetting checklist</a> suggests, not after the campaign ends."],
    },
    {
      h: "Using EMV well, and its limits",
      list: [
        "<b>Keep the weights fixed.</b> EMV only means something next to another EMV built the same way. This calculator never changes its weights between runs.",
        "<b>Do not add EMV to revenue.</b> It is what the attention might have cost, not money anyone received.",
        "<b>Bought engagement inflates EMV.</b> Likes from fake accounts count at the same $0.10. Check a creator with the <a href=\"../instagram-fake-follower-checker/\">fake follower estimator</a> before you report their EMV.",
        "<b>Compare with the fee.</b> To see what a creator would normally charge for the same post, run their numbers through the <a href=\"../instagram-pricing-calculator/\">Instagram pricing calculator</a>.",
      ],
      after: ["Before a campaign, the <a href=\"../instagram-engagement-rate-calculator/\">engagement rate calculator</a> helps you predict roughly what engagement a creator's post will bring. After it, EMV tells you what that engagement was worth."],
    },
  ],
  faq: [
    ["What is earned media value?", "It is an estimate of what the attention a post earned would have cost to buy as ads. It turns impressions, likes, comments, shares, saves and clicks into one dollar figure so campaigns can be compared."],
    ["How do you calculate EMV for Instagram?", "Multiply each action by a fixed value and add them up. This calculator uses $6 per 1,000 impressions, $0.10 per like, $0.50 per comment, $1.50 per share, $0.40 per save and $0.60 per link click."],
    ["What is a good EMV?", "There is no universal figure. Compare EMV with what you paid for the content, and with your own past campaigns built on the same weights. EMV above the fee means the attention was worth more than it cost to buy."],
    ["Is EMV the same as ROI?", "No. ROI compares money made with money spent. EMV estimates what the attention would have cost. A campaign can have a high EMV and still sell nothing, so track sales or sign-ups too."],
    ["Why does the result show a range?", "Impressions are valued at a typical ad CPM, which varies. The range recalculates impressions at $4 and $10 per 1,000 while keeping the other values the same."],
    ["Can I calculate EMV for a creator's post if I am not the creator?", "Only partly. Likes and comments are public, but impressions, shares and saves are in the creator's insights. Ask for a screenshot of the post's insights."],
    ["Does EMV work for TikTok or YouTube?", "The idea works anywhere, but these weights are set for Instagram. Use the same tool and weights across every campaign you compare so the numbers stay consistent."],
    ["Is the earned media value calculator free?", "Yes. No sign-up, no login and no limit. Nothing you enter is stored."],
  ],
};
