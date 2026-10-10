// Guide and FAQ for /creator-tools/find-youtube-influencers-by-niche/. Merged into tools.js by build-tools.js.
// Matches searchChannels() in lib/youtube.js and COMPUTE["find-youtube-influencers-by-niche"] / channelTable() in
// public/shared.js: YouTube channel search (50 by relevance, regionCode when a country is set), live stats, filter by
// declared country and subscriber range, sort by subscribers, return up to 25. Views per video = lifetime views / videos.
module.exports = {
  seoTitle: "Find YouTube Influencers by Niche: Free Search | Passive Array",
  seoDescription: "Find YouTube influencers in any niche for free. Search by topic, set a subscriber range and country, and get live subscribers, views and video counts.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this YouTube influencer finder returns",
      p: ["Type a topic and you get up to 25 YouTube channels that match it, with live numbers for each one:"],
      list: [
        "<b>Channel</b> name and @handle, linked to the channel on YouTube.",
        "<b>Country</b>, as the creator declared it in their channel settings. Many leave it blank.",
        "<b>Subscribers</b> and <b>total views</b> across the channel's lifetime.",
        "<b>Videos</b>, the number of public uploads.",
        "<b>Views per video</b>, which is total views divided by videos.",
      ],
      after: ["Results are sorted by subscribers, biggest first. The default range is 10,000 to 1,000,000 subscribers. Change either box, or pick a country, to narrow the list. It is useful for brands looking for creators to sponsor and for creators looking for peers to collaborate with or learn from."],
    },
    {
      h: "How the niche search works",
      ordered: true,
      list: [
        "It runs your keyword through YouTube's own channel search and takes the 50 most relevant channels. If you picked a country, the search is also told to favour that region.",
        "It pulls live statistics for every one of those channels from the official YouTube Data API.",
        "It drops channels outside your subscriber range. If you picked a country, it also drops every channel that has not declared that exact country.",
        "It sorts what is left by subscribers and shows the top 25.",
      ],
      after: [
        "Because filtering happens after the first 50 matches, a tight range or a small country can leave you with only a handful of channels, or none. That is not a sign the niche is empty. It means the most relevant 50 were mostly outside your filters. Try a different phrasing of the keyword. Searches are cached for 6 hours, so repeating one is instant.",
      ],
    },
    {
      h: "How to find YouTube influencers in your niche",
      p: ["The keyword does most of the work. YouTube matches it against channel names and descriptions, so search the way creators describe themselves, not the way your marketing team describes your product."],
      table: {
        head: ["Instead of", "Try", "Why"],
        rows: [
          ["skincare brand", "skincare routine, skincare for acne", "Creators describe what they make, not who sponsors them"],
          ["fitness", "home workout, calisthenics, running coach", "A broad word returns the giants first; a specific one returns the specialists"],
          ["software", "excel tutorial, notion setup", "Narrow topics surface smaller teaching channels with loyal audiences"],
        ],
      },
      after: [
        "Then set the subscriber range for your goal. A smaller range, say 10,000 to 100,000, usually finds creators who handle their own email and charge less in total. A larger range finds reach but fewer of them. If you are a creator looking for collaborators, set the range close to your own size: channels within a few times your subscriber count tend to be the ones who say yes.",
        "Run three or four searches with different phrasings and note the channels that keep appearing. Those are the ones YouTube itself sees as central to the topic.",
      ],
    },
    {
      h: "From a search list to a shortlist you can pay",
      p: ["The search list tells you who exists. It does not tell you who is worth a sponsorship. For brands, this is the order we suggest:"],
      ordered: true,
      list: [
        "Open the five to ten channels whose topic fits best and check that they have posted recently.",
        "Run each one through the <a href=\"../youtube-channel-quality-checker/\">channel quality checker</a>. It scores engagement, reach and consistency from the last 10 uploads, which the search list does not show.",
        "Put your top three side by side with <a href=\"../youtube-channel-comparison/\">compare YouTube channels</a>. Look hardest at average views and views per subscriber.",
        "Work out a fair price range from each channel's average views before you ask for a rate.",
        "Ask for audience country and age from YouTube Studio. Our guide on <a href=\"../../blog/how-to-vet-an-influencer-before-you-pay/\">vetting an influencer before you pay</a> covers what to request and which red flags to walk away from.",
      ],
      after: ["If you found one creator you like and want more like them, the <a href=\"../youtube-lookalike-finder/\">lookalike finder</a> starts from that channel instead of a keyword."],
    },
    {
      h: "What the niche search cannot tell you",
      list: [
        "<b>Recent performance.</b> Views per video here is a lifetime average, so one old hit can make a quiet channel look busy. Average views on recent uploads, which is what a sponsor actually buys, comes from the quality checker or the comparison.",
        "<b>Engagement.</b> Likes and comments are per video, so they are not in the search list.",
        "<b>Every channel in the niche.</b> YouTube search returns the most relevant matches, not a complete directory.",
        "<b>Where the audience lives.</b> The country column is where the creator says they are, not where viewers are. Only the creator can see audience geography.",
        "<b>Contact details.</b> The YouTube API does not provide them. Look on the channel's About page or in video descriptions.",
        "<b>Hidden subscriber counts.</b> These read as zero, so those channels drop out whenever your minimum is above zero.",
      ],
      after: ["If you are researching a niche as a creator rather than looking for people to hire, our <a href=\"../../research/\">keyword research</a> shows how much the top results for a topic are getting viewed per day and how big the channels ranking there are."],
    },
  ],
  faq: [
    ["How do I find YouTube influencers in my niche for free?", "Type the topic into the search box, set the subscriber range you want, and press <b>Find channels</b>. You get up to 25 matching channels with live subscribers, total views, video counts and views per video. No sign-up is needed."],
    ["Can I filter YouTube influencers by country?", "Yes. Pick a country and the list keeps only channels that declared that country in their settings. Many creators leave it blank, so the list gets shorter. For a country-first search, use <a href=\"../search-youtube-influencers-by-location/\">search YouTube influencers by location</a>."],
    ["Why did my search return only a few channels?", "The tool looks at the 50 most relevant channels, then removes the ones outside your subscriber range and country. Widen the range, remove the country, or try a different phrasing of the keyword."],
    ["How many subscribers should an influencer have?", "There is no right number. It depends on budget and goal. Smaller channels often have a more engaged audience and lower prices; larger ones give reach. Judge each by average views on recent uploads, not by subscribers."],
    ["Does this show engagement rates?", "Not in the search list. Run any channel you shortlist through the <a href=\"../youtube-channel-quality-checker/\">quality checker</a>, which shows engagement on its last 10 uploads."],
    ["Can I get an influencer's email address?", "No. The YouTube API does not share contact details. Many creators list a business email on their About page or in their video descriptions."],
    ["Can creators use this too?", "Yes. Set the subscriber range near your own size to find peers for collaborations, or search your topic to see who already serves the audience you want."],
    ["Is the YouTube influencer finder free?", "Yes. No sign-up and no limit beyond a fair daily quota shared by all visitors. Searches use more of that quota than single lookups, so please search with purpose."],
  ],
};
