// Long-form guide for /plagiarism-checker/.
// Every number here matches plagiarism-checker/lib/plagiarism.js and the live function settings
// (api/plagiarism.js and netlify/functions/plagiarism.mjs: 20 sentences per check unless overridden).
module.exports = {
  seoTitle: "Free Plagiarism Checker: Sentence by Sentence | Passive Array",
  seoDescription: "Check text for plagiarism free. Each sentence is searched as an exact phrase and marked plagiarized or unique, with its source. Or compare two texts directly.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this plagiarism checker does",
      p: ["The tool has two modes, on the two tabs above:"],
      list: [
        "<b>Check against the web.</b> Paste up to 1,000 words, upload a .txt, .docx or .pdf file, or paste a page address to pull its text. Each sentence is searched on the web and marked Plagiarized or Unique, with a link to the page it matched.",
        "<b>Compare two texts.</b> Paste two texts and the tool marks every sentence of the first that also appears in the second, and shows the closest sentence it matched. No web search is involved.",
      ],
      after: [
        "Both modes give a plagiarized and a unique percentage, a sentence-by-sentence breakdown, and a Download report button that saves the result as a text file.",
        "Uploaded files are read in your browser. Scanned PDFs are images of text, so they contain no words to read; run them through OCR first.",
      ],
    },
    {
      h: "How the web check finds copied sentences",
      ordered: true,
      list: [
        "Your text is split into sentences. Very short fragments are joined to the sentence before them.",
        "Sentences under 5 words are skipped and marked Too short, because a phrase that short matches thousands of pages by chance.",
        "From each remaining sentence, a run of up to 12 words from its middle is searched on Google as an exact phrase, in quotes.",
        "The top 5 results are compared with that phrase. If a result's snippet contains the exact phrase, the match is 100 percent. If not, the tool counts how many of the phrase's three-word sequences appear in the snippet.",
        "A sentence is flagged as Plagiarized when the best match reaches 60 percent. The source link is the result that matched best.",
      ],
      after: [
        "The plagiarized percentage is the share of words, not sentences: the words in flagged sentences divided by all the words that were checked. A long copied sentence counts for more than a short one.",
        "Use the Exclude a site box for your own domain. When you pull text from a URL, the tool fills it in for you, so the page does not match itself.",
      ],
    },
    {
      h: "How Compare two texts works",
      p: [
        "This mode needs no search, so it is not limited by any daily allowance. Both texts are broken into overlapping three-word sequences. For each sentence in Text 1, the tool works out what share of its sequences also appear anywhere in Text 2.",
        "A sentence is flagged when half or more of its sequences are found. Next to it you see the sentence in Text 2 that overlaps it most, so you can read the two side by side.",
        "It is the right mode for checking a student essay against a source, a freelancer's draft against a competitor's article, or a rewrite against the original you gave a writer.",
      ],
    },
    {
      h: "What a free plagiarism checker cannot catch",
      p: ["Be clear about the limits before you act on a result:"],
      list: [
        "<b>Paraphrasing.</b> The check looks for exact and near-exact wording. A sentence rewritten in different words will usually pass as unique.",
        "<b>AI-written text.</b> This is not an AI detector. Text a model wrote fresh will usually show as unique, because nobody published it before.",
        "<b>Pages Google cannot see.</b> Paywalled articles, content behind a login, most books and private documents are not in the search results, so copies from them are missed.",
        "<b>Matches the snippet hides.</b> The tool judges a match from the short snippet Google returns, not the full page. If the snippet shows a different part of the page, a real match can be missed.",
        "<b>Long texts.</b> Each check searches up to 20 sentences on the live site. Anything after that is listed as not checked, with a note. Split a long piece into parts.",
      ],
      after: ["Web checks also share a daily search allowance. When it runs out, the tool says so, and Compare two texts keeps working."],
    },
    {
      h: "What to do with flagged sentences",
      list: [
        "<b>Open the source.</b> Read it to confirm the match is real and not a common phrase, a quotation or a product name that many pages share.",
        "<b>Quote and credit</b> anything you meant to borrow. A quoted, linked sentence is not plagiarism.",
        "<b>Rewrite</b> anything you did not mean to borrow, in your own words and your own structure, not by swapping a few synonyms.",
        "<b>Check again</b> after editing, and keep the downloaded report if you need a record.",
      ],
      after: ["Writing for YouTube? The <a href=\"/creator-tools/youtube-description-generator/\">YouTube description generator</a> and the <a href=\"/creator-tools/youtube-script-outline-generator/\">script outline generator</a> give you a fresh starting point. For a site of your own, the <a href=\"/seo-roi-calculator/\">SEO ROI calculator</a> shows what original, ranking content could be worth."],
    },
  ],
  faq: [
    ["Is this plagiarism checker free?", "Yes, with no sign-up. You can check up to 1,000 words at a time. Web checks depend on a shared daily search allowance; Compare two texts has no such limit."],
    ["How accurate is the plagiarism percentage?", "It is an estimate. Exact copying is caught well when the source is indexed by Google. Paraphrased text, paywalled sources and matches the search snippet does not show can be missed. Always read the flagged sentences yourself."],
    ["Is my text stored or shared?", "Your text is sent to the tool's server to be checked, and short phrases from it are sent to Google as searches. The report is generated in your browser. Do not paste confidential text into any online checker, this one included."],
    ["Can it check a whole website page?", "Yes. Paste the address in the URL box and click Get text from URL. The tool downloads the page, strips menus, headers and footers, and puts the readable text in the box. Trim it to 1,000 words if it is longer."],
    ["Does it detect AI-generated content?", "No. It finds text that already exists on the web. Text an AI model wrote fresh is usually unique, so it will pass. Use a dedicated AI detector if that is what you need, and treat its result with care too."],
    ["Why are some sentences marked Too short or Not checked?", "Too short means the sentence had fewer than 5 words, which would match many pages by chance. Not checked means the sentence was past the per-check limit, or its search failed. Split long text into smaller parts."],
    ["Which files can I upload?", ".txt, .md, .docx and .pdf. The text is pulled out in your browser. PDFs must contain real text; a scanned page is just a picture."],
  ],
};
