module.exports = {
  "cover": {
    "kicker": "YouTube links",
    "title": "Link to a *specific time*",
    "sub": "Three ways to make a YouTube link that starts at the moment you choose.",
    "size": 66,
    "visual": {
      "type": "shot",
      "src": "youtube-timestamp-link--generator.png",
      "label": "YouTube Timestamp Link Generator",
      "tag": "Free, no account",
      "style": "height:400px;object-fit:cover;object-position:top"
    }
  },
  "figures": [
    {
      "file": "timestamp-link-generator-result.webp",
      "type": "shot",
      "src": "youtube-timestamp-link--generator.png"
    },
    {
      "file": "timestamps-to-chapters.webp",
      "type": "flow",
      "title": "When timestamps become *chapters*",
      "sub": "A list of times in the description splits the progress bar if it follows three rules.",
      "steps": [
        {
          "title": "Start at 0:00",
          "text": "The first timestamp in the description must be 0:00."
        },
        {
          "title": "At least three",
          "text": "There must be at least three timestamps, one per line."
        },
        {
          "title": "10 seconds or more",
          "text": "Each chapter must be at least 10 seconds long."
        }
      ],
      "note": "YouTube's chapter rules."
    }
  ]
};
