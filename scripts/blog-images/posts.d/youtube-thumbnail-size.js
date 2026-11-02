module.exports = {
  "cover": {
    "kicker": "Thumbnails",
    "title": "YouTube thumbnail *size*",
    "sub": "The size YouTube asks for, and the much smaller size viewers see.",
    "size": 66,
    "visual": {
      "type": "stats",
      "items": [
        {
          "big": "1280 x 720",
          "label": "pixels at 16:9, the recommended size",
          "note": "Minimum width 640 pixels, from YouTube's help pages"
        },
        {
          "big": "2 MB",
          "label": "maximum file size, as JPG, PNG or GIF",
          "note": "Larger files are refused, from YouTube's help pages"
        }
      ]
    }
  },
  "figures": [
    {
      "file": "thumbnail-downloader-stored-sizes.webp",
      "type": "shot",
      "src": "youtube-thumbnail-size--downloader.png"
    },
    {
      "file": "thumbnail-size-viewers-see.webp",
      "type": "bars",
      "title": "Uploaded size vs the size *people see*",
      "sub": "Width in pixels. Design for the smallest one.",
      "bars": [
        {
          "label": "Uploaded thumbnail",
          "value": 1280,
          "display": "1280 px"
        },
        {
          "label": "Phone home feed",
          "value": 430,
          "display": "~350 to 430 px"
        },
        {
          "label": "Suggested, desktop",
          "value": 168,
          "display": "~168 px",
          "hi": true
        }
      ],
      "note": "Approximate widths (~); they vary by device and layout."
    }
  ]
};
