// Guide and FAQ for /creator-tools/top-youtube-channels-by-country/. Merged into tools.js by build-tools.js.
// Matches lib/top-country.js: candidates from the stored pool (topcset:<CC>), the country's trending charts
// (overall + 8 categories), one channel search and the worldwide top list; only channels whose About page
// names the country count; cached a day. COMPUTE["top-youtube-channels-by-country"] in public/shared.js.
module.exports = {
  seoTitle: "Top YouTube Channels by Country: Live Subscriber Ranking | Passive Array",
  seoDescription: "The biggest YouTube channels in 40 countries, ranked by live subscriber count from the YouTube Data API. Sort by views or videos and download the list. Free.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "What the ranking shows",
      p: ["Pick a country to see its largest YouTube channels by subscribers, with total views, video count and a link to each channel. Re-sort by total views or videos uploaded, and download the list as CSV."],
      after: ["Every number is read live from the official YouTube Data API. Nothing is estimated."],
    },
    {
      h: "How the ranking is built",
      p: ["YouTube does not publish a ranking of channels by country, and its API cannot list every channel in a country. So the ranking is built from channels we can actually find:"],
      ordered: true,
      list: [
        "The channels behind the country's trending chart, overall and in eight big categories.",
        "A channel search for the country's name, sorted by views.",
        "The largest channels worldwide.",
        "Every channel found for that country on earlier days. The pool grows each time the ranking refreshes.",
      ],
      after: [
        "Only channels whose About page names the country are counted. That is the country YouTube shows for the channel, set by its owner.",
        "The result says how many channels it ranked. Treat it as the biggest channels we know of in that country, not a census.",
      ],
    },
    {
      h: "Why a channel might be missing",
      list: [
        "<b>No country set.</b> Many channels leave the country blank, so they cannot be placed in any country ranking.",
        "<b>A different country.</b> A creator living in one country may list another on their channel.",
        "<b>Not found yet.</b> A big channel that has not appeared on the trending charts or in search recently may not be in the pool yet.",
        "<b>Hidden subscriber count.</b> Channels that hide their count are left out, because they cannot be ranked.",
      ],
      after: ["For the biggest channels worldwide, see the <a href=\"../youtube-most-subscribed-channels/\">most subscribed YouTube channels</a>. To find smaller creators in a country, use <a href=\"../search-youtube-influencers-by-location/\">search YouTube influencers by location</a>."],
    },
  ],
  faq: [
    ["Which YouTube channel has the most subscribers in my country?", "Pick your country above. The top row is the most subscribed channel we have found that lists your country on its About page, read live from the YouTube Data API."],
    ["Does YouTube publish an official ranking by country?", "No. YouTube publishes no subscriber ranking at all. This list is built from public channel data, and the page says how many channels it ranked."],
    ["How is a channel's country decided?", "By the country on the channel's About page, which the owner sets. Channels that leave it blank are not included in any country."],
    ["How often does it update?", "The ranking refreshes once a day, and the pool of channels grows with each refresh."],
    ["Why are the subscriber counts rounded?", "YouTube only makes rounded subscriber counts public, for example 12.3M. Channels very close together may swap places as the exact numbers move."],
    ["Is it free?", "Yes. No account and no sign-up."],
  ],
};
