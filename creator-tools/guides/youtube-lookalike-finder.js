// Guide and FAQ for /creator-tools/youtube-lookalike-finder/. Merged into tools.js by build-tools.js.
// Matches lookalike() and searchChannels() in lib/youtube.js: first 4 channel keywords that do not contain a word of
// the channel's name (3+ letters) + first 3 topic categories, joined into one query (max 100 chars; fallback: first
// 3 words of the title). Channel search, 50 by relevance, seed removed, 25 largest kept, then sorted by
// |log10(subs+1) - log10(seedSubs+1)| and the closest 15 shown. COMPUTE["youtube-lookalike-finder"] shows "Matched on".
module.exports = {
  seoTitle: "YouTube Lookalike Finder: Find Similar Channels | Passive Array",
  seoDescription: "Find YouTube channels similar to one you already know. Paste a channel and get up to 15 lookalikes on the same topics, closest in size first. Free, no sign-up.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What the YouTube lookalike finder does",
      p: ["Paste one channel you already know, the seed, and you get a list of channels that cover the same ground. The result shows:"],
      list: [
        "<b>The seed channel</b> at the top, so you can confirm the tool found the right one.",
        "<b>Matched on</b>, the exact search the tool built from the seed's topics and keywords. This line tells you why the results look the way they do.",
        "<b>Up to 15 similar channels</b> with country, subscribers, total views, videos and views per video, live from the official YouTube Data API.",
      ],
      after: ["The list is sorted by how close each channel's audience size is to the seed's, not by size. A brand that had a good result with one creator can use it to find the next five. A creator can use it to map who else is competing for the same viewers."],
    },
    {
      h: "How similar channels are found",
      ordered: true,
      list: [
        "The tool reads two things the seed channel publishes: its <b>channel keywords</b>, which the creator sets in YouTube settings, and its <b>topic categories</b>, which YouTube assigns, such as Food or Video game culture.",
        "It removes any keyword that contains a word from the channel's own name, so the search finds other channels rather than the seed again.",
        "It joins the first 4 remaining keywords and the first 3 topics into one search. If the channel has none of either, it uses the first three words of the channel name.",
        "It runs that as a YouTube channel search, takes the 50 most relevant channels and removes the seed.",
        "It keeps the 25 biggest of those, then sorts them by how close their subscriber count is to the seed's and shows the closest 15.",
      ],
      after: [
        "Closeness is measured on a log scale, which means in multiples rather than raw numbers. For a seed with 50,000 subscribers, a channel with 25,000 and one with 100,000 count as equally close: each is two times away. A channel with 5,000,000 is a hundred times away and sorts near the bottom.",
      ],
    },
    {
      h: "Why the results sometimes miss, and how to fix it",
      p: ["The lookalike list is only as good as the seed's own keywords. Read the <b>Matched on</b> line first:"],
      table: {
        head: ["If Matched on shows", "What it means", "What to do"],
        rows: [
          ["Specific terms that describe the channel", "The seed is well tagged", "Trust the list and shortlist from it"],
          ["Only broad topics such as Lifestyle or Entertainment", "The creator set no useful keywords", "Search a specific topic with the <a href=\"../find-youtube-influencers-by-niche/\">niche influencer finder</a>"],
          ["Words from the channel name", "No keywords and no topics were set", "Try a different seed channel from the same niche"],
          ["Keywords about a different subject", "The creator changed direction, or tagged loosely", "Use a seed that still covers the topic you want"],
        ],
      },
      after: [
        "One more thing to know. Because the tool keeps the 25 biggest matches before sorting by closeness, a very small seed channel tends to get lookalikes that are larger than it is. If you need channels at a small size, use the niche finder and set a maximum subscriber count.",
      ],
    },
    {
      h: "How to use lookalike channels, for brands and for creators",
      p: ["<b>For brands</b>, a lookalike search is the quickest way to scale a campaign that worked:"],
      ordered: true,
      list: [
        "Use your best-performing creator as the seed.",
        "Open the five closest channels and check they still post on the same topic.",
        "Put the seed and your two favourites side by side with <a href=\"../youtube-channel-comparison/\">compare YouTube channels</a>. If a lookalike gets similar average views at a similar views per subscriber, it is a fair bet for a similar result.",
        "Run anything you plan to pay through the <a href=\"../youtube-channel-quality-checker/\">channel quality checker</a>, and read our guide on <a href=\"../../blog/how-to-vet-an-influencer-before-you-pay/\">vetting an influencer before you pay</a>.",
      ],
      after: [
        "<b>For creators</b>, put your own channel in as the seed. The result is a list of the channels YouTube is most likely to treat as your neighbours. Use it to find collaborators near your size, and to study what is working in your space. Our <a href=\"../../research/outliers/\">outlier videos</a> list shows videos that beat their own channel's usual views by three times or more, which is a good place to look for ideas that travel. To track a few of these rivals over time, add them to the watchlist in the free <a href=\"../../app/\">dashboard</a>.",
      ],
    },
    {
      h: "Lookalike finder or niche search: which should you use?",
      table: {
        head: ["", "Lookalike finder", "Niche influencer finder"],
        rows: [
          ["Starts from", "One channel you already know", "A topic you type"],
          ["Search terms", "Built from the seed's keywords and topics", "Your own words"],
          ["Size filter", "None; sorted by closeness to the seed", "Minimum and maximum subscribers"],
          ["Country filter", "No", "Optional"],
          ["Results", "Up to 15", "Up to 25"],
          ["Best when", "You want more of something that already worked", "You are starting from scratch or need a size or country filter"],
        ],
      },
      after: ["Many people use both: the niche search to find a first good creator, and the lookalike finder to grow the list from there."],
    },
  ],
  faq: [
    ["How do I find YouTube channels similar to another channel?", "Paste the channel's link or @handle into the box above and press <b>Find channels</b>. The tool reads its keywords and topics, searches YouTube for channels on the same subjects, and lists up to 15, closest in size first."],
    ["What does Matched on mean?", "It is the exact search the tool built from the seed channel's keywords and topic categories. If the results look off, this line usually explains why."],
    ["Why are the lookalike channels much bigger than mine?", "The tool keeps the 25 largest matches before sorting by closeness to your size, so small seed channels tend to get bigger lookalikes. For small channels, use the <a href=\"../find-youtube-influencers-by-niche/\">niche finder</a> with a maximum subscriber count."],
    ["Why are the results about a different topic?", "The seed's channel keywords may be missing or about something else. YouTube's topic categories are broad, so a channel with no keywords is matched on terms like Lifestyle. Try a different seed from the same niche."],
    ["Does this use YouTube's own related channels?", "No. YouTube does not publish a related channels list through its API. The tool builds its own search from the seed's public keywords and topics."],
    ["Can brands use this to find influencers?", "Yes. Start from a creator who already delivered for you, then vet the closest matches with the quality checker and the channel comparison before you reach out."],
    ["Can I filter lookalikes by country?", "Not in this tool. The country column shows where each creator says they are based. For a country filter, use <a href=\"../search-youtube-influencers-by-location/\">search YouTube influencers by location</a>."],
    ["Is the lookalike finder free?", "Yes. No sign-up and no limit beyond a fair daily quota shared by all visitors."],
  ],
};
