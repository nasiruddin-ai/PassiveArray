// Long-form guide for /serp-snippet-preview/.
// Describes only what the tool does: in-browser preview, Arial pixel measurement, 600 px title / 920 px and 680 px description limits.
module.exports = {
  seoTitle: "SERP Snippet Preview: Check Title and Meta Length | Passive Array",
  seoDescription: "See how your page looks in Google before you publish. Free SERP snippet preview: desktop and mobile results, pixel widths, cut-off warnings and keyword bolding.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this SERP snippet preview shows",
      p: ["Type a page URL, a title and a meta description, and add a focus keyword if you have one. The preview updates as you type:"],
      list: [
        "<b>A desktop and a mobile Google result,</b> side by side, so you see both versions at once.",
        "<b>The URL as a breadcrumb,</b> the way Google prints it: the domain, then each part of the path separated by ›.",
        "<b>The title and description cut with ...</b> at the point where Google would cut them on that screen.",
        "<b>Your focus keyword in bold</b> inside the description, the way Google often highlights the words someone searched for.",
        "<b>Character counts and pixel widths,</b> each with a bar that shows how much of the space you have used.",
      ],
      after: [
        "Below the preview, warnings flag the common problems: a missing title, a title under 30 characters, a title that will be cut, a missing description, a description under 70 characters, a description that will be cut, a keyword that appears in neither the title nor the description, and a title and description that are word-for-word the same.",
        "Everything runs in your browser. Nothing you type is sent anywhere. The one exception is the <b>Fetch from URL</b> button: press it and the page's current title and description are read through our <a href=\"/meta-tag-checker/\">meta tag checker</a> and dropped into the boxes, so you can edit what is already live.",
      ],
    },
    {
      h: "Why Google cuts titles by pixel width, not character count",
      p: [
        "Google does not stop a title at a set number of characters. It stops when the text runs out of room, and the room is measured in pixels. Letters are not all the same width. A capital W takes up several times the space of a lowercase i, so a title in capitals or full of wide letters gets cut much sooner than one full of narrow letters.",
        "That is why a 55-character title can fit while a different 55-character title is cut. Character counters cannot see the difference. This preview measures each title and description with the font Google uses for results, Arial, at the size Google uses, and compares the width with the space available.",
      ],
      after: ["The character count is still shown as a quick check. When it and the pixel bar disagree, trust the pixels."],
    },
    {
      h: "How long should a title tag and meta description be?",
      p: ["These are the limits the preview uses, as of October 2026:"],
      table: {
        head: ["Element", "Where", "Limit the preview uses"],
        rows: [
          ["Title", "Desktop", "600 px at 20 px Arial"],
          ["Meta description", "Desktop", "920 px at 14 px Arial"],
          ["Meta description", "Mobile", "680 px at 14 px Arial"],
        ],
      },
      after: [
        "In practice that means aiming to fill most of the title bar without going past the end, and saying the important part of the description early, because the mobile limit is much shorter than the desktop one. A description that fits on desktop can still be cut on a phone.",
        "Google does not publish official limits and changes its result layout from time to time, so treat these widths as a close guide, not a rule. A title that is a little too long is not a penalty. It simply loses its last words to the ...",
      ],
    },
    {
      h: "Why Google shows a different title or description than yours",
      p: [
        "Writing a title and meta description does not guarantee Google will show them. As of October 2026, Google often rewrites titles and very often picks its own description, and it may change how it does this at any time.",
        "Descriptions are rewritten most. Google tends to pull a passage from the page that matches the words someone searched for, so the same page can show different descriptions for different searches. Titles are rewritten less often, usually when the title is missing, stuffed with repeated words, the same on many pages, or does not match what the page is about.",
        "This preview shows what your snippet looks like if Google uses it as written. It cannot predict a rewrite. What you can do is make the title and description accurate and specific to the page, which makes them more likely to be used.",
      ],
    },
    {
      h: "How to write a title and meta description people click",
      ordered: true,
      list: [
        "<b>Lead with what the page is.</b> Put the main topic near the start of the title, where it cannot be cut.",
        "<b>Give every page its own title and description.</b> Duplicates across a site are one of the common reasons Google writes its own.",
        "<b>Write the description as a promise the page keeps.</b> Say what the reader gets. Do not describe something the page does not have.",
        "<b>Use the focus keyword once, naturally.</b> Repeating it does not help and reads badly. The preview flags it if it is missing, not if it appears only once.",
        "<b>Keep the brand short.</b> A site name at the end of the title is fine, but it uses pixels your topic might need.",
        "<b>Check mobile last.</b> Read the mobile description as it is cut. If the sentence stops before the point, move the point forward.",
      ],
      after: ["Once the page is live, run it through the <a href=\"/meta-tag-checker/\">meta tag checker</a> to confirm the tags were saved as written, and add structured data with the <a href=\"/schema-markup-generator/\">schema markup generator</a> if the page qualifies for rich results."],
    },
  ],
  faq: [
    ["What is a SERP snippet?", "It is the block Google shows for a page in its search results: the site name and URL breadcrumb, a blue title link, and a short description underneath. This tool previews that block for desktop and mobile."],
    ["How many characters can a Google title have?", "There is no fixed character limit, because Google cuts titles by width in pixels. This preview uses a 600 px limit at 20 px Arial on desktop. That fits roughly 50 to 60 characters of normal text, fewer if the title uses wide letters or capitals."],
    ["How long should a meta description be?", "Long enough to say what the page offers, short enough not to be cut where it matters. The preview uses 920 px on desktop and 680 px on mobile, at 14 px Arial. It warns when a description is under 70 characters, because a very short one gives Google little to work with."],
    ["Why is my title cut off in Google even though it is under 60 characters?", "Because the cut is based on pixels, not characters. Wide letters such as W and M, and words in capitals, use more space. Paste the title into the preview to see exactly where it would be cut."],
    ["Will Google use the title and description I write?", "Often, but not always. As of October 2026, Google frequently writes its own description from the page text and sometimes rewrites titles. Accurate, page-specific tags are the most likely to be shown as written, but Google decides."],
    ["Does a better snippet improve my rankings?", "No tool can promise that. A clear title and description can make more people click your result, but where the page ranks depends on many other things Google weighs."],
    ["Is the SERP snippet preview free and private?", "Yes, it is free with no sign-up. It runs in your browser and sends nothing anywhere, unless you press Fetch from URL, which reads the page's current title and description through our server."],
  ],
};
