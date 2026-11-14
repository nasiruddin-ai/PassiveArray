// Long-form guide for /heading-analyzer/.
module.exports = {
  seoTitle: "Free Heading (H1-H6) & Readability Checker | Passive Array",
  seoDescription: "Paste HTML or Markdown to inspect your H1-H6 heading outline, spot skipped heading levels or multiple H1s, and measure Flesch reading ease.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "Why heading hierarchy matters for SEO and AI search",
      p: [
        "Search engines and AI answer engines use H1–H6 headings to understand the outline and subtopics of a page. Screen readers also rely on sequential headings so visitors can jump cleanly between sections.",
        "Keep one descriptive H1 for the main topic, use H2s for major sections, and nest H3s underneath without skipping levels (like jumping from H2 straight to H4).",
      ],
    },
  ],
  faq: [
    ["Can I paste Markdown instead of HTML?", "Yes. Lines starting with #, ##, ###, etc. are automatically parsed alongside standard <h1> through <h6> HTML tags."],
    ["What is a good Flesch Reading Ease score for web content?", "Aim for 60 or higher for general audiences. Scores between 60 and 80 are easy to scan on mobile screens."],
  ],
};
