module.exports = {
  cover: {
    kicker: "YouTube SEO",
    title: "YouTube *upload settings*",
    sub: "MP4, H.264, 48 kHz audio and your recorded frame rate.",
    size: 62,
    visual: { type: "stats", items: [
      { big: "8 Mbps", label: "for 1080p SDR at 24, 25 or 30 fps", note: "35–45 Mbps for 4K, per YouTube Help" },
      { big: "256 GB", label: "or 12 hours, the largest upload", note: "Over 15 minutes needs a verified account" },
    ] },
  },
  figures: [
    {
      file: "youtube-sdr-bitrates.webp", type: "bars",
      title: "Recommended *SDR* bitrates",
      sub: "Video bitrate at 24, 25 or 30 fps, in Mbps.",
      bars: [
        { label: "2160p (4K)", value: 45, display: "35–45 Mbps", hi: true },
        { label: "1440p (2K)", value: 16, display: "16 Mbps" },
        { label: "1080p", value: 8, display: "8 Mbps" },
        { label: "720p", value: 5, display: "5 Mbps" },
        { label: "480p", value: 2.5, display: "2.5 Mbps" },
        { label: "360p", value: 1, display: "1 Mbps" },
      ],
      note: "Source: YouTube Help, \"YouTube recommended upload encoding settings\".",
    },
    {
      file: "youtube-processing-timeline.webp", type: "timeline",
      title: "What happens after you *upload*",
      sub: "Low quality comes first. HD and 4K can take hours.",
      events: [
        { dot: "1", when: "Upload", what: "The video is first processed in low quality" },
        { dot: "2", when: "SD done", what: "The video can be published" },
        { dot: "3", when: "Hours later", what: "1080p and 4K appear; 60 min of 4K at 30fps: up to 4 hours" },
        { dot: "4", when: "Check", what: "Watch page: Settings, then Quality" },
      ],
      note: "Source: YouTube Help, \"Low video quality after upload\" and \"Upload YouTube videos\".",
    },
  ],
};
