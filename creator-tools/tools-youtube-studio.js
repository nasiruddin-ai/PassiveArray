// YouTube creation and ranking tools. Kept in their own file so tools.js stays
// readable; tools.js concatenates this list onto its own.
//
// These close the gap with the free-tool sections vidIQ and TubeBuddy use to
// bring people in. Ours differ in two ways that matter: none of them need an
// account, and every one that produces a number shows how it got there.

const YEAR = new Date().getFullYear();

const VIDEO_INPUT = {
  id: "video",
  label: "Video link or ID",
  type: "text",
  placeholder: "Paste a YouTube link or video ID",
  hint: "Works with watch links, youtu.be links, Shorts links, or the 11-character ID on its own",
};

module.exports = function (NICHES) {
  const nicheOptions = NICHES.map((n) => [n, n[0].toUpperCase() + n.slice(1)]);

  return [
    /* ------------------------------------------------------------ create */
    {
      slug: "youtube-title-generator",
      name: "YouTube Title Generator",
      platform: "YouTube",
      intent: "create",
      api: "ai",
      action: "yt_titles",
      short: "Ten title angles for any topic, each with a character count and a click check.",
      intro: "Type what the video is about. You get ten titles across different angles, from how-to to contrarian, each measured against the 60-character limit where YouTube starts cutting titles off in search.",
      inputs: [
        { id: "topic", label: "What the video is about", type: "text", placeholder: "Type your topic, e.g. squarespace seo for beginners" },
        { id: "related", label: "Related keywords", type: "text", placeholder: "Comma separated, optional", optional: true, hint: "A few phrases you want worked in naturally" },
      ],
      how: [
        "Ten angles are used so you are not choosing between ten versions of the same sentence: how-to, mistakes, list, comparison, question, story, contrarian and beginner.",
        "Each title is measured against 60 characters, which is roughly where YouTube truncates in search results and on mobile.",
        "With a Claude API key set on the server the titles are written by AI from your topic. Without one, proven title patterns are filled with your words. Neither invents facts about you.",
      ],
      next: ["youtube-title-analyzer", "youtube-description-generator", "youtube-tag-generator"],
    },
    {
      slug: "youtube-description-generator",
      name: "YouTube Description Generator",
      platform: "YouTube",
      intent: "create",
      api: "ai",
      action: "yt_description",
      short: "A full description with a keyword-led hook, timestamps, links and hashtags.",
      intro: "Describe the video and get a description laid out the way YouTube rewards: the keyword in the first two lines where it shows above the fold, then what the viewer learns, then chapter timestamps, links and hashtags.",
      inputs: [
        { id: "topic", label: "What the video is about", type: "text", placeholder: "Type your topic, e.g. how to price a sponsorship" },
        { id: "notes", label: "What the video covers", type: "textarea", rows: 5, placeholder: "Three to five bullet points in your own words", optional: true },
        { id: "related", label: "Related keywords", type: "text", placeholder: "Comma separated, optional", optional: true },
      ],
      how: [
        "The first two lines carry the main keyword, because that is all a viewer sees before tapping \"more\".",
        "Timestamps are included as placeholders. Filling them in creates chapters, which give you a second set of entries in search.",
        "Anything the notes do not cover is written as a [placeholder] in square brackets rather than invented.",
      ],
      next: ["youtube-title-generator", "youtube-tag-generator", "youtube-hashtag-generator"],
    },
    {
      slug: "youtube-video-ideas-generator",
      name: "YouTube Video Ideas Generator",
      platform: "YouTube",
      intent: "create",
      api: "ai",
      action: "yt_ideas",
      short: "Twelve specific video ideas for your niche, each with a hook and a format.",
      intro: "Say what your channel is about and who watches it. You get twelve concrete ideas, not categories: a title you could publish, the opening line that earns the first thirty seconds, and the format that suits it.",
      inputs: [
        { id: "niche", label: "What your channel is about", type: "text", placeholder: "Type your niche, e.g. budget camera gear" },
        { id: "audience", label: "Who watches it", type: "text", placeholder: "Describe your audience, e.g. wedding videographers" },
        { id: "format", label: "Format", type: "select", options: [["mixed", "A mix"], ["long", "Long-form only"], ["short", "Shorts only"]], value: "mixed" },
      ],
      how: [
        "Ideas are built from patterns that reliably earn clicks in any niche, filled with your subject and audience.",
        "Each idea includes a hook, because retention in the first thirty seconds decides whether the video gets shown to more people.",
        "Run it again for a different set. The patterns are shuffled from your inputs, so the same inputs give the same ideas.",
      ],
      next: ["youtube-title-generator", "youtube-keyword-generator", "youtube-niche-finder"],
    },
    {
      slug: "youtube-script-outline-generator",
      name: "YouTube Script Outline Generator",
      platform: "YouTube",
      intent: "create",
      api: "ai",
      action: "yt_script",
      short: "A section-by-section outline with a hook, beats, timings and a close.",
      intro: "Give the topic and a target length. You get an outline with a hook written out in full, the beats in order with rough timings, and a close that earns the next click. It is a structure to film from, not a word-for-word script.",
      inputs: [
        { id: "topic", label: "What the video is about", type: "text", placeholder: "Type your topic, e.g. five lighting mistakes" },
        { id: "audience", label: "Who it is for", type: "text", placeholder: "Describe your audience, e.g. beginners with one light", optional: true },
        { id: "minutes", label: "Target length", type: "select", options: [["1", "Under a minute (Shorts)"], ["5", "About 5 minutes"], ["8", "8 to 10 minutes"], ["15", "15 minutes or more"]], value: "8" },
      ],
      how: [
        "The opening is written in full because the first thirty seconds decide retention, and retention decides reach.",
        "Timings are spread across your target length so you can see whether a section is carrying too much.",
        "Videos over eight minutes can carry mid-roll ads, which is why that option exists. Only use it if the content really fills the time.",
      ],
      next: ["youtube-title-generator", "youtube-description-generator", "youtube-video-ideas-generator"],
    },
    {
      slug: "youtube-channel-name-generator",
      name: "YouTube Channel Name Generator",
      platform: "YouTube",
      intent: "create",
      short: "Twenty channel name ideas in the style you pick, with a length check.",
      intro: "Type your subject and pick a style. You get twenty names built the way channel names actually work, with the ones that are too long to read on mobile flagged.",
      inputs: [
        { id: "topic", label: "What the channel is about", type: "text", placeholder: "Type your subject, e.g. home coffee" },
        { id: "word", label: "A word about you", type: "text", placeholder: "Your name or a word you like, optional", optional: true },
        {
          id: "style", label: "Style", type: "select", value: "descriptive",
          options: [["descriptive", "Descriptive, says what it is"], ["personal", "Personal, built on your name"], ["authority", "Authority, sounds established"], ["playful", "Playful, easy to remember"]],
        },
      ],
      how: [
        "Names are built from patterns that work on YouTube: a subject plus a role, a subject plus a place, or a short compound you can say out loud.",
        "Anything over 20 characters is flagged, because longer names get cut off next to a video on a phone.",
        "We cannot tell you whether a handle is free. Check it at youtube.com/@thename before you commit.",
      ],
      next: ["youtube-niche-finder", "youtube-video-ideas-generator", "youtube-keyword-generator"],
    },
    {
      slug: "youtube-thumbnail-downloader",
      name: "YouTube Thumbnail Downloader",
      platform: "YouTube",
      intent: "create",
      short: "Grab any video's thumbnail in every size YouTube stores, straight from the source.",
      intro: "Paste a video link. You get every thumbnail size YouTube publishes for it, with a preview and a direct download. Useful for checking what a competitor's thumbnail actually looks like at the size viewers see it.",
      inputs: [VIDEO_INPUT],
      how: [
        "YouTube stores several fixed sizes for every video at public addresses. This tool works those addresses out from the video ID; nothing is uploaded and no API is used.",
        "Maximum resolution (1280 by 720) only exists for videos uploaded with a thumbnail that large. Older or smaller videos stop at 640 by 480.",
        "Thumbnails belong to the creator who made them. Use them for research and comparison, not for republishing.",
      ],
      next: ["youtube-title-analyzer", "youtube-channel-quality-checker", "youtube-subscriber-count-checker"],
    },

    /* -------------------------------------------------------------- rank */
    {
      slug: "youtube-keyword-generator",
      name: "YouTube Keyword Generator",
      platform: "YouTube",
      intent: "rank",
      short: "Turn one keyword into dozens of long-tail phrases people actually search.",
      intro: "Type a seed keyword. You get it expanded into long-tail phrases, questions, comparisons and buyer-intent variations, grouped so you can see which kind of video each one wants.",
      inputs: [
        { id: "keyword", label: "Seed keyword", type: "text", placeholder: "Type a keyword, e.g. youtube seo" },
        { id: "niche", label: "Niche", type: "select", options: [["", "Not sure"]].concat(nicheOptions), optional: true },
      ],
      how: [
        "Your keyword is combined with the modifiers that appear most often in real YouTube searches: how, best, vs, for beginners, tutorial, mistakes, and the current year.",
        "Phrases are grouped by what the searcher wants, because a how-to and a comparison need different videos.",
        "We do not show a search volume, because no tool outside Google has YouTube's volume data. Anything you see quoted elsewhere is modelled. Check demand by searching the phrase and seeing who ranks.",
      ],
      next: ["youtube-tag-generator", "youtube-title-generator", "youtube-niche-finder"],
    },
    {
      slug: "youtube-tag-generator",
      name: "YouTube Tag Generator",
      platform: "YouTube",
      intent: "rank",
      api: "ai",
      action: "yt_tags",
      short: "A copy-ready tag list that fits YouTube's 500-character limit.",
      intro: "Type your topic and get a tag list built the way tags still help: the exact keyword, long-tail variations, realistic misspellings and broad category terms, all inside the 500-character limit YouTube enforces.",
      inputs: [
        { id: "topic", label: "What the video is about", type: "text", placeholder: "Type your topic, e.g. squarespace seo" },
        { id: "related", label: "Related keywords", type: "text", placeholder: "Comma separated, optional", optional: true },
      ],
      how: [
        "The list stays under 500 characters including commas, which is YouTube's hard limit for the whole tag field.",
        "Tags play a small role in ranking. YouTube says they mainly help when your subject is commonly misspelled, which is why realistic misspellings are included and nonsense tags are not.",
        "Paste the copied list straight into the Tags box in YouTube Studio.",
      ],
      next: ["youtube-keyword-generator", "youtube-title-analyzer", "youtube-description-generator"],
    },
    {
      slug: "youtube-title-analyzer",
      name: "YouTube Title Analyzer",
      platform: "YouTube",
      intent: "rank",
      short: "Score a title out of 100 on length, keyword position and click appeal.",
      intro: "Paste a title you are considering. You get a score with every check shown separately, so you can see which part is weak rather than being handed a number with no reasoning.",
      inputs: [
        { id: "title", label: "Your title", type: "text", placeholder: "Paste the title you are considering" },
        { id: "keyword", label: "Main keyword", type: "text", placeholder: "Type the phrase you want to rank for, optional", optional: true },
      ],
      how: [
        "Length is scored against 60 characters, where YouTube starts truncating in search and on mobile. Under 30 characters usually means you left room unused.",
        "A keyword near the front is worth more than the same keyword at the end, both for search and for the viewer deciding in half a second.",
        "Numbers, brackets and a clear promise all correlate with higher click-through. Shouting in capitals and stacked punctuation correlate with lower trust, so they lose points.",
      ],
      next: ["youtube-title-generator", "youtube-tag-generator", "youtube-thumbnail-downloader"],
    },
    {
      slug: "youtube-hashtag-generator",
      name: "YouTube Hashtag Generator",
      platform: "YouTube",
      intent: "rank",
      short: "Hashtags for a YouTube video, in the order that decides which three show up.",
      intro: "YouTube shows only the first three hashtags from your description, above the title. This builds a set in the right order: the specific ones first where they do the work, broader ones after.",
      inputs: [
        { id: "topic", label: "What the video is about", type: "text", placeholder: "Type your topic, e.g. home coffee brewing" },
        { id: "count", label: "How many", type: "select", options: [["5", "5"], ["8", "8"], ["12", "12"], ["15", "15"]], value: "8" },
      ],
      how: [
        "Only the first three appear above your title, so specific tags go first where they attract the right viewer.",
        "YouTube ignores everything past 15 hashtags on a video, and using more than that can get all of them ignored.",
        "Hashtags are a small signal. They help people browsing a tag, they do not rescue a weak title.",
      ],
      next: ["youtube-tag-generator", "youtube-description-generator", "youtube-keyword-generator"],
    },
    {
      slug: "youtube-niche-finder",
      name: "YouTube Niche Finder",
      platform: "YouTube",
      intent: "rank",
      short: "Compare niches on earning potential, competition and how hard they are to film.",
      intro: "Pick what you could happily make videos about and what you want from the channel. You get the niches ranked for you, with the trade-off for each one spelled out rather than hidden behind a single score.",
      inputs: [
        {
          id: "goal", label: "What matters most", type: "select", value: "money",
          options: [["money", "Earning the most per view"], ["growth", "Growing subscribers fastest"], ["easy", "Getting started with the least effort"], ["balanced", "A balance of all three"]],
        },
        {
          id: "area", label: "Area you could film about", type: "select", value: "",
          options: [["", "Show me everything"], ["money", "Money and business"], ["tech", "Tech and software"], ["life", "Lifestyle and home"], ["body", "Health and fitness"], ["play", "Gaming and entertainment"], ["learn", "Education and skills"]],
        },
        { id: "camera", label: "Are you willing to be on camera?", type: "select", value: "either", options: [["either", "Either way"], ["yes", "Yes, on camera"], ["no", "No, faceless only"]] },
      ],
      how: [
        "Advertiser demand varies enormously by subject, which is why a finance channel and a gaming channel with identical views earn very differently. The RPM band shows where each niche sits.",
        "Competition and effort are scored 1 to 5. A high-paying niche with heavy competition can be a worse bet than a mid-paying one nobody has covered properly.",
        "These bands are our editorial read of public RPM reports and of what currently ranks in each niche. They are a starting point for your own research, not measured data, and we would rather say so than dress a judgement up as a statistic.",
      ],
      next: ["youtube-keyword-generator", "youtube-money-calculator", "youtube-video-ideas-generator"],
    },
  ];
};
