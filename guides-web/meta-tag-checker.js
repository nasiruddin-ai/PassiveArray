// Long-form guide for /meta-tag-checker/.
// Describes only what the tool does: server fetch (public URLs, 8 s timeout, 3 MB, 5 redirects), raw HTML only, no JavaScript.
module.exports = {
  seoTitle: "Meta Tag Checker: Check Any Page's SEO Tags Free | Passive Array",
  seoDescription: "Check the SEO tags on any web page. Free meta tag checker: title, description, robots, canonical, Open Graph, headings, alt text and redirects, each with a fix.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this meta tag checker looks at",
      p: ["Paste a URL and the checker reads the page and reports on the tags search engines and social networks use:"],
      list: [
        "<b>Status and redirects:</b> the final status code, every redirect on the way with its status code, and the response time.",
        "<b>Title and meta description,</b> with their lengths.",
        "<b>Indexing signals:</b> the meta robots tag and the X-Robots-Tag header, with noindex and nofollow flagged.",
        "<b>Canonical:</b> whether it is missing, points to the page itself, or points somewhere else.",
        "<b>Basics:</b> the html lang attribute and the viewport tag.",
        "<b>Headings:</b> how many H1s the page has and what they say, plus the number of H2s.",
        "<b>Social tags:</b> Open Graph (og:title, og:description, og:image, og:url, og:type) and Twitter card tags.",
        "<b>Hreflang:</b> how many language alternates the page lists.",
        "<b>Structured data:</b> the schema types found in JSON-LD blocks.",
        "<b>Content:</b> the number of images and how many have no alt text, an approximate visible word count, and counts of internal and external links.",
      ],
      after: ["Each check is marked pass, warning or fail, with a one-line fix next to anything that is not a pass."],
    },
    {
      h: "How the checker reads a page, and what it cannot see",
      ordered: true,
      list: [
        "Our server requests the URL. Only public http and https addresses are accepted. Private and local network addresses are refused.",
        "It follows up to 5 redirects and records each step, so you can see a chain such as http to https to www.",
        "It waits up to 8 seconds for a response and reads up to 3 MB of the page.",
        "It parses the HTML that came back and runs every check on it.",
      ],
      after: [
        "One limit matters more than the rest: <b>the checker does not run JavaScript.</b> It sees the HTML the server sends, nothing more. If a site adds its title, description, canonical or content with scripts after the page loads, the checker will report those as missing even though they appear in your browser.",
        "Google can render JavaScript, but rendering can happen later than the first crawl and does not always succeed. Tags that are in the server's HTML from the start are the safer choice, and this checker shows you exactly what that HTML contains.",
      ],
    },
    {
      h: "Noindex, canonical and redirects: the checks that can hide a page",
      p: ["Most warnings are small. These three can keep a page out of search results entirely, so read them first:"],
      table: {
        head: ["Result", "What it means", "What to do"],
        rows: [
          ["noindex in meta robots or X-Robots-Tag", "The page asks search engines not to show it.", "Remove it if the page should appear in search. Check both places: the header is easy to miss."],
          ["Canonical points elsewhere", "The page tells Google another URL is the main version.", "Fine for duplicates. On a page you want ranked, point the canonical at the page itself."],
          ["Final status is not 200", "The page is missing, erroring or redirecting.", "Fix the error, or update links so they point straight at the final URL."],
          ["Long redirect chain", "Visitors and crawlers pass through several hops.", "Redirect the first URL directly to the last one."],
        ],
      },
      after: ["Google treats a canonical as a strong hint, not an order, and may choose a different main URL. The checker shows what your page declares, not what Google finally picks. Search Console's URL Inspection tool shows Google's choice."],
    },
    {
      h: "What the other results mean and how to fix them",
      list: [
        "<b>Title and description length.</b> Long ones get cut in results. Paste them into the <a href=\"/serp-snippet-preview/\">SERP snippet preview</a> to see the cut by pixel width, which is what Google uses.",
        "<b>No H1, or several.</b> One clear H1 that says what the page is about is the tidy pattern. Several H1s are not an error in HTML, but they often point to a template problem.",
        "<b>Missing lang or viewport.</b> The lang attribute helps browsers and screen readers; the viewport tag makes the page display properly on phones.",
        "<b>Images without alt text.</b> Add a short description to each image that carries meaning. Decorative images can have an empty alt.",
        "<b>Missing Open Graph or Twitter tags.</b> Without them, shared links may show the wrong image or text. They control link previews; they are not a Google ranking signal.",
        "<b>No structured data.</b> Not required, but it is how a page becomes eligible for some rich results. The <a href=\"/schema-markup-generator/\">schema markup generator</a> builds JSON-LD for common types.",
        "<b>Low word count.</b> The count is approximate and only a prompt. A short page that fully answers the question is fine.",
      ],
    },
    {
      h: "When to run a meta tag check",
      list: [
        "<b>After you publish or edit a page,</b> to confirm the CMS saved the tags you typed.",
        "<b>After a redesign or platform move,</b> when noindex tags, broken canonicals and redirect chains often slip in.",
        "<b>When a page disappears from Google,</b> as a first look for a noindex or a wrong canonical.",
        "<b>When a shared link shows the wrong preview,</b> to see which Open Graph tags are missing.",
        "<b>To look at a competitor's page</b> and see how its title, headings and structured data are set up.",
      ],
      after: ["Checking the domain itself? The <a href=\"/domain-age-checker/\">domain age checker</a> shows when it was registered and when it expires."],
    },
  ],
  faq: [
    ["How do I check the meta tags on a website?", "Paste the page's full URL into the box above and run the check. The tool fetches the page and lists its title, description, robots, canonical, social tags, headings and more, each marked pass, warning or fail."],
    ["Why does the checker say my title or description is missing when I can see it?", "Most likely your site adds it with JavaScript after the page loads. The checker reads the HTML your server returns and does not run scripts, so it cannot see tags added later. Putting the tags in the server's HTML is the more reliable setup."],
    ["Can I check a page that needs a login or is on my local network?", "No. The checker only fetches public http and https pages. Private and local addresses are refused, and it cannot log in."],
    ["What is the difference between meta robots and X-Robots-Tag?", "Both tell search engines whether to index a page and follow its links. Meta robots is a tag in the HTML; X-Robots-Tag is sent in the HTTP header. The checker reads both and flags noindex or nofollow in either."],
    ["Does Google still use the meta keywords tag?", "No. Google has said for many years that it ignores meta keywords, so the checker does not score it."],
    ["Will fixing every warning improve my rankings?", "No checker can promise that. Fixing a noindex or a wrong canonical can bring a page back into search, but most of these checks are about clarity and presentation. Rankings depend on far more than tags."],
    ["Is the meta tag checker free?", "Yes, with no sign-up. Very large or slow pages may stop at the 3 MB or 8 second limit, and the result will say so."],
  ],
};
