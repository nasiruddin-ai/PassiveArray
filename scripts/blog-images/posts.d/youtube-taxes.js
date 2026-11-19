module.exports = {
  cover: {
    kicker: "Earnings",
    title: "YouTube *taxes*: US withholding explained",
    sub: "Who submits which form, what Google withholds, and where to find it.",
    size: 58,
    visual: { type: "stats", items: [
      { big: "0-30%", label: "of earnings from US viewers, with tax info", note: "Rate depends on your country's tax treaty with the US" },
      { big: "24%", label: "of total worldwide earnings, with no tax info", note: "Individual accounts, per YouTube Help" },
    ] },
  },
  figures: [
    {
      file: "youtube-tax-withholding-example.webp", type: "bars",
      title: "YouTube's example: *$1,000* earned, $100 from US viewers",
      sub: "A hypothetical creator in India. US tax withheld in each case.",
      bars: [
        { label: "No tax info submitted", value: 240, display: "$240", hi: true },
        { label: "Tax info, no treaty benefit", value: 30, display: "$30" },
        { label: "Tax info, treaty benefit claimed", value: 15, display: "$15" },
      ],
      note: "Source: YouTube Help, \"U.S. tax requirements for YouTube earnings\".",
    },
    {
      file: "youtube-tax-year-dates.webp", type: "timeline",
      title: "The YouTube tax calendar",
      sub: "Dates from YouTube Help's US tax pages.",
      events: [
        { dot: "1", when: "10 December", what: "Submit tax info and claim any treaty benefit; refund window for this year's over-withholding" },
        { dot: "2", when: "End of year", what: "Later refunds of this year's withholding must be claimed from the IRS" },
        { dot: "3", when: "Early March", what: "Form 1099-MISC typically issued to US creators" },
        { dot: "4", when: "By 14 April", what: "Form 1042-S issued for the previous year's withholding" },
        { dot: "!", when: "Every few years", what: "Forms expire at the end of the third full calendar year after signing" },
      ],
      note: "Source: YouTube Help, \"U.S. tax requirements for YouTube earnings\" and \"Submitting your U.S. tax info to Google\".",
    },
  ],
};
