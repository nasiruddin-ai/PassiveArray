// Long-form guide for /creator-tools/youtube-keyword-generator/. Merged into tools.js by build-tools.js.
module.exports = {
  seoTitle: "YouTube Keyword Generator: Free Long-Tail Ideas | Passive Array",
  seoDescription: "Free YouTube keyword generator, no sign-up. Turn one seed keyword into long-tail phrases grouped by search intent, then check which ones you can rank for.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this YouTube keyword generator does",
      p: ["Type one seed keyword, such as <b>home workout</b> or <b>squarespace seo</b>. The generator combines it with the modifiers that turn up most often in YouTube searches and gives you around 35 long-tail phrases, sorted into seven groups by what the searcher wants:"],
      list: [
        "<b>How-to and tutorials</b>: people who want step-by-step help.",
        "<b>Beginner</b>: people who need a starting point and no jargon.",
        "<b>Questions</b>: people who want one clear answer, fast.",
        "<b>Best and comparison</b>: people choosing between options.",
        "<b>Problems and mistakes</b>: people trying not to get it wrong, or fixing something that broke.",
        "<b>Current and trending</b>: people who want this year's answer.",
        "<b>Tools and money</b>: people looking for something to use or buy.",
      ],
      after: ["Each group comes with a line on <b>what wins it</b>, meaning the kind of video that satisfies that searcher. Pick a niche from the menu and you also get phrases narrowed to that audience, where competition is usually far lower. Copy the whole list with one click."],
    },
    {
      h: "How to find keywords for YouTube videos",
      ordered: true,
      list: [
        "Type a short seed keyword of one to three words. Broad is fine here; the generator does the narrowing.",
        "Optionally pick your niche, then run it.",
        "Scan the groups and pick the phrases that match a video you could actually make well.",
        "Type each shortlisted phrase into YouTube's search box. If autocomplete offers it, or something very close, real people are searching it.",
        "Look at who ranks for it today. That tells you whether you can win it, which matters more than how popular it is.",
      ],
      after: ["The phrases here are built from proven patterns, so treat them as candidates, not a verified list. Step 4 is what turns a candidate into a keyword. Our <a href=\"../../research/\">keyword research page</a> does steps 4 and 5 for you, using YouTube's own autocomplete and the live top 10."],
    },
    {
      h: "Why there is no search volume here",
      p: [
        "No tool outside Google has YouTube's search volume. Every \"monthly searches\" figure you see in a YouTube keyword tool is modelled, usually from Google web search data or browsing panels, then shown with a precision it has not earned. We would be making the number up, so we do not show one.",
        "What you can measure is better anyway. The question that matters is not how many people search a phrase but whether a video like yours can rank for it. Search the phrase and look at the first ten results:",
      ],
      list: [
        "<b>How big are the channels?</b> If every result comes from a channel with millions of subscribers, the topic is settled. If channels under 100,000 subscribers hold spots, the door is open.",
        "<b>Is any video outperforming its channel?</b> More views than the channel has subscribers means the topic pulls in new viewers through search and suggestions.",
        "<b>How old are the top results?</b> If the best answers are years old, there is room for a current one.",
        "<b>Do they actually answer the phrase?</b> Loosely related results mean nobody has made the right video yet.",
      ],
      after: ["The <a href=\"../../research/\">research page</a> turns those four questions into an opportunity score from measured data: competing videos, channel sizes, average views of the top 10 and freshness. The full manual method is in <a href=\"../../blog/free-youtube-keyword-research/\">free YouTube keyword research</a>."],
    },
    {
      h: "Short-tail vs long-tail YouTube keywords",
      p: ["A short-tail keyword is one or two broad words. A long-tail keyword is a longer, specific phrase. Most new and small channels win on long-tail first, because the searcher's intent is clear and fewer big channels have answered it."],
      table: {
        head: ["", "Short-tail", "Long-tail"],
        rows: [
          ["Example", "home workout", "home workout for beginners with no equipment"],
          ["What the searcher wants", "Unclear: ideas, a routine, gear?", "Clear: a routine they can start today"],
          ["Who usually ranks", "Large, established channels", "A mix, often including small channels"],
          ["Best use", "Your channel's overall topic", "The title of a single video"],
        ],
      },
      after: ["The sweet spot is a specific long-tail phrase inside a popular subject: the particular question people ask that nobody has answered properly this year."],
    },
    {
      h: "How to use your keyword once you pick it",
      ordered: true,
      list: [
        "<b>Put it near the front of your title</b>, in natural language. The <a href=\"../youtube-title-generator/\">title generator</a> writes ten options around it.",
        "<b>Repeat it in the first two lines of the description</b>, which are all a viewer sees before tapping more. The <a href=\"../youtube-description-generator/\">description generator</a> lays this out for you.",
        "<b>Say it out loud in the first thirty seconds.</b> YouTube reads the spoken words in your video too.",
        "<b>Add it as your first tag</b>, with a few variations from the <a href=\"../youtube-tag-generator/\">tag generator</a>. Tags matter least of the four, so this is the last step, not the first.",
      ],
      after: ["Still deciding what your channel should cover? Compare whole subjects on earning potential and competition with the <a href=\"../youtube-niche-finder/\">YouTube niche finder</a>."],
    },
  ],
  faq: [
    ["Is this YouTube keyword generator free?", "Yes. No sign-up, no account and no daily limit on generating phrases. The list is built in your browser."],
    ["Does this tool show YouTube search volume?", "No, on purpose. Nobody outside Google has YouTube's search volume, so any figure you see elsewhere is an estimate. We show what can be measured instead: on the research page, how the videos ranking for a phrase are actually performing."],
    ["Are these keywords real YouTube searches?", "They are built from the modifiers that appear most often in real YouTube searches, combined with your seed keyword. Most will be searched, but not all. Confirm a phrase by typing it into YouTube's search box and seeing whether autocomplete offers it, or run it through the research page, which uses YouTube's own autocomplete."],
    ["How do I know if I can rank for a keyword?", "Search it on YouTube and look at the top ten. If channels smaller than yours are ranking, especially with more views than they have subscribers, the topic is open. If every result is from a channel with millions of subscribers, pick a narrower phrase."],
    ["How many keywords should I target in one video?", "One main phrase, plus two or three close variations that come up naturally. A video that tries to rank for ten unrelated phrases usually ranks for none of them."],
    ["What is the difference between a keyword and a tag?", "A keyword is the phrase you want the video to be found for, and it belongs in your title, description and script. Tags are a hidden field YouTube says plays a minimal role, so they are where a keyword goes last, not first."],
    ["Is the YouTube keyword generator good for Shorts?", "Yes for picking the topic, though Shorts are found far more through the Shorts feed than through search. Use it to find a clear subject, then focus on the first second of the video."],
  ],
};
