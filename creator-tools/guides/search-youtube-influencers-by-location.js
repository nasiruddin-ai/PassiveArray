// Guide and FAQ for /creator-tools/search-youtube-influencers-by-location/. Merged into tools.js by build-tools.js.
// Matches searchChannels() in lib/youtube.js: channel search with regionCode = country (the word "vlog" is used when
// no keyword is given), 50 results by relevance, keep only channels whose declared country matches, filter by the
// subscriber range (defaults 1,000 to 10,000,000), sort by subscribers, show up to 25. Cached 6 hours.
module.exports = {
  seoTitle: "Search YouTube Influencers by Location: Free Tool | Passive Array",
  seoDescription: "Search YouTube influencers by country for free. Pick a location, add a keyword and a subscriber range, and get local channels with live stats. No sign-up.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What the YouTube location search shows",
      p: ["Pick a country, add a keyword if you have one, and you get up to 25 channels based in that country. For each one you see:"],
      list: [
        "<b>Channel</b> name and @handle, linked to YouTube.",
        "<b>Country</b>, which always matches the one you picked.",
        "<b>Subscribers</b>, <b>total views</b> and <b>videos</b>, live from the official YouTube Data API.",
        "<b>Views per video</b>, which is lifetime views divided by videos.",
      ],
      after: ["The default subscriber range is 1,000 to 10,000,000, wide on purpose so small markets still return results. Results are sorted by subscribers, biggest first. Brands use it to find local creators for a campaign in one market. Creators use it to find people nearby to collaborate or film with."],
    },
    {
      h: "How the country filter works",
      ordered: true,
      list: [
        "The tool runs a YouTube channel search with your keyword, told to favour the country you picked. If you leave the keyword empty, it still needs a search term, so it searches for <b>vlog</b>. Add your own keyword for anything specific.",
        "It takes the 50 most relevant channels and pulls live statistics for each.",
        "It keeps only channels whose declared country is exactly the one you picked. Channels that never set a country are dropped.",
        "It applies your subscriber range, sorts by subscribers and shows the top 25.",
      ],
      after: ["The country a channel shows is the one its owner chose in YouTube settings. It is self-declared and not verified. It says where the creator says they are based, not where their viewers are."],
    },
    {
      h: "Why some countries return only a few channels",
      p: ["An empty or short list is common for smaller markets. These are the usual reasons and what to try:"],
      table: {
        head: ["What happened", "What to try"],
        rows: [
          ["Most of the 50 matches never set a country", "Use a more local keyword, such as a city, a dish or a word in the local language"],
          ["The keyword is in English but local creators post in another language", "Search in the language the creators use"],
          ["Your subscriber range is too tight", "Lower the minimum. In a small market, a good local creator can have a small subscriber count"],
          ["The keyword is too narrow for one country", "Broaden it, for example cooking instead of vegan baking"],
        ],
      },
      after: ["Run the same country with three or four keywords and combine the lists. Searches are cached for 6 hours, so going back to an earlier one is instant."],
    },
    {
      h: "How to find local YouTube influencers for a brand campaign",
      ordered: true,
      list: [
        "Search your country with two or three keywords that describe your product's world, not the product itself.",
        "Open the channels that fit and check they have posted in the last few weeks.",
        "Run the strongest candidates through the <a href=\"../youtube-channel-quality-checker/\">channel quality checker</a> to see engagement, reach and upload pace on recent videos.",
        "Compare your top three with <a href=\"../youtube-channel-comparison/\">compare YouTube channels</a>, paying most attention to average views and views per subscriber.",
        "Ask each creator for the audience country breakdown from YouTube Studio. A creator based in one country can have most of their viewers in another.",
      ],
      after: ["Our guide on <a href=\"../../blog/how-to-vet-an-influencer-before-you-pay/\">vetting an influencer before you pay</a> explains what else to ask for and which red flags matter. If the country is less important than the topic, start with <a href=\"../find-youtube-influencers-by-niche/\">find YouTube influencers by niche</a> instead, which has the country as an optional filter."],
    },
    {
      h: "What location data YouTube makes public, and what it does not",
      table: {
        head: ["Data", "Public?", "Where it comes from"],
        rows: [
          ["Channel country", "Yes, if the creator set it", "Channel settings, chosen by the owner"],
          ["Audience country", "No", "YouTube Studio analytics, seen only by the owner"],
          ["Language of the videos", "Not as a filter here", "Read the titles, or search in that language"],
          ["City or region", "No", "Sometimes in the channel description or video titles"],
        ],
      },
      after: [
        "So this tool is a fast way to build a list of creators who say they are based in a market. It cannot prove the audience is there too. For a sponsorship where geography matters, always get the audience screenshot before you pay.",
        "Creators can use the same search the other way round: look up your own country and topic to see which local channels already serve your audience, then study what works for them with our <a href=\"../../research/outliers/\">outlier videos</a> list.",
      ],
    },
  ],
  faq: [
    ["How do I find YouTube influencers in a specific country?", "Pick the country, add a keyword that describes the content you want, set a subscriber range and press <b>Find channels</b>. You get up to 25 channels that declared that country, with live subscribers, views and video counts."],
    ["Why are there so few results for my country?", "Only channels that set a country in their settings can match, and many creators leave it blank. The tool also starts from the 50 most relevant channels for your keyword. Try a local-language keyword, a lower subscriber minimum, or several keywords in turn."],
    ["Do I need a keyword?", "No, but it helps a lot. Without one, the tool searches for the word vlog in that country, which gives a general list of local vloggers rather than a niche."],
    ["Does the country mean the audience is in that country?", "No. It is where the creator says they are based. Audience geography is private to the channel owner in YouTube Studio, so ask for it before a deal."],
    ["Can I search by city?", "Not directly. YouTube only stores a country. Add the city name as your keyword, which matches creators who mention it in their channel name or description."],
    ["Which countries can I search?", "The menu lists 37 countries across North and South America, Europe, Africa, the Middle East, Asia and Oceania. Pick the closest market if yours is missing and filter by keyword."],
    ["Can I get contact details for local creators?", "No. The YouTube API does not share them. Check the channel's About page and video descriptions for a business email."],
    ["Is the location search free?", "Yes. No sign-up and no limit beyond a fair daily quota shared by all visitors."],
  ],
};
