// Guide and FAQ for /creator-tools/youtube-niche-finder/. Merged into tools.js by build-tools.js.
// Every weight and score matches NICHE_DATA and COMPUTE["youtube-niche-finder"] in public/shared.js:
// 26 niches in 6 areas; RPM band High 100 / Mid 62 / Low 28; openness = (6 - competition) x 20; ease = (6 - effort) x 20;
// money 0.6/0.3/0.1, growth 0.2 money + 0.5 openness + 0.3 ease, easy 0.1/0.3/0.6, balanced 0.34/0.33/0.33;
// faceless only drops on-camera niches and adds 6 to faceless-native ones; top 14 shown. Worked scores checked in node.
module.exports = {
  seoTitle: "YouTube Niche Finder: Compare Profitable Niches | Passive Array",
  seoDescription: "Compare YouTube niches on RPM, competition and effort, ranked for your goal: money, growth or an easy start. Faceless options included. Free, no sign-up.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this YouTube niche finder compares",
      p: ["Choose what matters most to you, the area you could film about, and whether you will be on camera. You get up to 14 niches ranked for that choice, each with:"],
      list: [
        "<b>A score from 0 to 100</b> for your goal. The top niche is shown first with a one-line reason.",
        "<b>An RPM band</b>, High, Mid or Low, with a dollar range per 1,000 views.",
        "<b>Competition</b> and <b>effort</b>, each rated 1 to 5. More filled circles means more competition or more work.",
        "<b>Faceless</b>: Yes if the niche works well without showing your face, Possible if it can go either way, No if viewers expect a person on screen.",
      ],
      after: [
        "The list covers 26 niches across six areas: money and business, tech and software, lifestyle and home, health and fitness, gaming and entertainment, and education and skills.",
        "Be clear about what these numbers are. The RPM bands are our editorial read of what creators report publicly, not measured data. Competition and effort are our judgement too. The tool is a structured way to think through trade-offs, and it says so on the page.",
      ],
    },
    {
      h: "How the niche score is worked out",
      p: [
        "Each niche gets three part scores out of 100. <b>Money</b> comes from its RPM band: High is 100, Mid is 62, Low is 28. <b>Openness</b> is the reverse of competition: a 1 out of 5 for competition scores 100, a 5 scores 20. <b>Ease</b> is the reverse of effort, worked out the same way.",
        "Your goal decides how the three are weighted:",
      ],
      table: {
        head: ["Your goal", "Money", "Openness", "Ease"],
        rows: [
          ["Earning the most per view", "60%", "30%", "10%"],
          ["Growing subscribers fastest", "20%", "50%", "30%"],
          ["Getting started with the least effort", "10%", "30%", "60%"],
          ["A balance of all three", "34%", "33%", "33%"],
        ],
      },
      after: [
        "If you choose <b>No, faceless only</b>, niches where viewers expect a face are removed, and niches that are naturally faceless get 6 extra points. Choosing <b>Yes, on camera</b> removes nothing, because someone happy to be on camera can make any of them.",
      ],
    },
    {
      h: "A worked example: why finance is not top for money",
      p: ["Pick <b>Earning the most per view</b> with every area shown. The top four look like this:"],
      table: {
        head: ["Niche", "RPM band", "Competition", "Effort", "Score"],
        rows: [
          ["Insurance and legal explainers", "High, $15 to $35", "2 of 5", "4 of 5", "88"],
          ["B2B software and SaaS reviews", "High, $15 to $40", "3 of 5", "4 of 5", "82"],
          ["Real estate and property", "High, $10 to $25", "4 of 5", "4 of 5", "76"],
          ["Personal finance and investing", "High, $12 to $30", "5 of 5", "3 of 5", "72"],
        ],
      },
      after: [
        "All four earn full money points. Personal finance falls to fourth because its competition is rated 5 out of 5, so it gets only 20 openness points against 80 for insurance and legal explainers. That is the point of the tool: a high-paying niche that everyone is already in can be a worse bet than a high-paying one that few people make watchable.",
        "Switch the goal to <b>Growing subscribers fastest</b> and exam prep and study skills moves to the top with 76, because it is rated low on both competition and effort. Switch on <b>faceless only</b> with the money goal and insurance and legal explainers rises to 94.",
      ],
    },
    {
      h: "How to check a niche before you commit",
      p: ["Treat the ranking as a shortlist. Then test the top two or three against real data:"],
      ordered: true,
      list: [
        "Put the niche's main phrase into the <a href=\"../youtube-keyword-generator/\">keyword generator</a> to see the specific searches people type around it.",
        "Look those phrases up in our <a href=\"../../research/\">keyword research</a>. It shows what the top results are actually getting: views per day, how big the ranking channels are, and how fresh the videos are. If small channels rank with recent videos, the niche is open.",
        "Check the <a href=\"../../research/outliers/\">outlier videos</a> for the topic. Videos that beat their own channel's usual views by three times or more show which angles are working right now.",
        "Find five channels already in the niche with the <a href=\"../find-youtube-influencers-by-niche/\">niche influencer finder</a> and look at how often they post and how many views they get.",
        "Run one of them through the <a href=\"../youtube-money-calculator/\">YouTube money calculator</a> with the RPM band from this tool to see what that level of views might earn.",
      ],
      after: ["Our <a href=\"../../blog/free-youtube-keyword-research/\">free keyword research method</a> explains how to judge demand without paying for a tool that guesses search volume."],
    },
    {
      h: "What the niche finder cannot tell you",
      list: [
        "<b>Your real RPM.</b> RPM depends heavily on where your viewers live. The same finance video earns far less per view from some countries than others. The bands are broad ranges, and where your viewers live can put you well outside them. See <a href=\"../../blog/how-much-does-youtube-pay-per-view/\">how much YouTube pays per view</a>.",
        "<b>Live competition.</b> Ratings are a snapshot of our judgement. A niche can fill up in months, especially around new tools and trends.",
        "<b>Whether you will last.</b> The score has no input for how much you like the subject. A Mid niche you can film for three years beats a High one you quit after ten videos.",
        "<b>Sponsorship income.</b> Some niches with modest RPM, such as home office and productivity or parenting, attract brands that pay well for a genuine voice. The tool notes this in the one-line reason where it applies.",
        "<b>Shorts.</b> The bands describe long-form videos. Shorts pay far less per view in every niche.",
      ],
    },
  ],
  faq: [
    ["What is the most profitable YouTube niche?", "On RPM alone, the High band in this tool covers personal finance, B2B software reviews, real estate, and insurance and legal explainers. Profit also depends on competition and on how long each video takes to make, which is why the tool scores those too."],
    ["Where do the RPM ranges come from?", "They are our editorial read of RPM figures creators share publicly. They are not measured from any channel's earnings, and your real RPM depends on where your audience lives. Once monetized, use the RPM YouTube Studio shows you."],
    ["What is a good faceless YouTube niche?", "Choose <b>No, faceless only</b> to see them. For the money goal, insurance and legal explainers, B2B software reviews and software tutorials rank highest. For the least effort, software tutorials and exam prep lead."],
    ["What YouTube niche grows fastest?", "No niche guarantees growth. The growth setting favours low competition and low effort, because a new channel is more likely to be found where few others post. Exam prep and study skills ranks first on that setting."],
    ["How many niches does the tool compare?", "26, across six areas. The results table shows the top 14 for your settings."],
    ["Is the niche score measured data?", "No. It combines our editorial ratings for RPM, competition and effort using the weights shown above. Check demand with real numbers in our <a href=\"../../research/\">keyword research</a> before you commit."],
    ["Can I pick a niche that is not on the list?", "Yes. Find the closest match to see its likely trade-offs, then test your exact topic with the keyword generator and our research pages."],
    ["Is the YouTube niche finder free?", "Yes. It runs in your browser, with no sign-up and no limit."],
  ],
};
