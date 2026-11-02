module.exports = {
  cover: {
    kicker: "Benchmarks",
    title: "Instagram engagement *by industry*",
    sub: "What three 2026 reports say, and why their numbers differ by more than ten times.",
    size: 62,
    visual: { type: "stats", items: [
      { big: "4.2%", label: "all-industry average, Hootsuite 2026", note: "Best-performing content type, per post, by followers" },
      { big: "0.30%", label: "all-industry median, Quid (Rival IQ) 2026", note: "Median brand, total interactions by followers" },
    ] },
  },
  figures: [
    {
      file: "instagram-benchmark-reports-compared.webp", type: "bars",
      title: "Same platform, *three answers*",
      sub: "All-industry Instagram figures: Hootsuite average of the best format, Socialinsider 2025 average, Quid median.",
      bars: [
        { label: "Hootsuite 2026", value: 4.2, display: "4.2%", hi: true },
        { label: "Socialinsider 2026", value: 0.48, display: "0.48%" },
        { label: "Quid (Rival IQ) 2026", value: 0.30, display: "0.30%" },
      ],
      note: "Sources: Hootsuite, \"Average engagement rate by industry\", 13 Oct 2026; Socialinsider, \"2026 Social Media Benchmarks\"; Quid, \"2026 Social Media Industry Benchmark Report\".",
    },
    {
      file: "hootsuite-instagram-engagement-by-industry.webp", type: "bars",
      title: "Hootsuite 2026: *top and bottom* industries",
      sub: "Instagram engagement rate, best-performing content type, per post by followers.",
      bars: [
        { label: "Nonprofit", value: 5.5, display: "5.5%", hi: true },
        { label: "Utilities and energy", value: 5.5, display: "5.5%", hi: true },
        { label: "Education", value: 5.4, display: "5.4%" },
        { label: "All industries", value: 4.2, display: "4.2%" },
        { label: "Consumer goods and retail", value: 3.6, display: "3.6%" },
        { label: "Media and entertainment", value: 3.2, display: "3.2%" },
      ],
      note: "Source: Hootsuite, \"Average engagement rate by industry\", 13 October 2026. Five of its 13 industries plus the all-industry figure.",
    },
  ],
};
