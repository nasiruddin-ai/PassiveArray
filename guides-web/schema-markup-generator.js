// Long-form guide for /schema-markup-generator/.
// Describes only what the tool does: in-browser JSON-LD for 7 types, live output, Copy button, Rich Results Test link.
module.exports = {
  seoTitle: "Schema Markup Generator: Free JSON-LD for 7 Types | Passive Array",
  seoDescription: "Create JSON-LD schema markup without code. Free generator for FAQ, local business, article, product, organization, person and breadcrumb structured data.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this schema markup generator creates",
      p: ["Pick a type, fill in the form, and the generator writes JSON-LD structured data inside a script tag. The code updates as you type. Copy it with one click, then test it with the link to Google's Rich Results Test. Required fields are marked, and any that are still empty are listed so nothing is missed."],
      table: {
        head: ["Type", "What the form asks for", "Typical use"],
        rows: [
          ["FAQ page", "As many question and answer pairs as you need", "A page that lists questions with their answers"],
          ["Local business", "Name, business type (such as Dentist or Restaurant), address, phone, URL, opening hours, price range, optional map coordinates", "The home or contact page of a business with a location"],
          ["Article", "Headline, author, published and modified dates, image, publisher", "Blog posts and news articles"],
          ["Product", "Name, image, description, brand, SKU, price, currency, availability, optional rating value and count", "A page selling one product"],
          ["Organization", "Name, URL, logo, sameAs profile links", "The home page of a company or brand"],
          ["Person", "Name, job title, URL, image, sameAs profile links", "An author page or personal site"],
          ["Breadcrumb list", "As many name and URL steps as your path has", "Any page that sits inside a site hierarchy"],
        ],
      },
      after: ["The generator runs entirely in your browser. Nothing you type is sent to us."],
    },
    {
      h: "Where to paste JSON-LD schema on your site",
      ordered: true,
      list: [
        "Copy the full output, including the opening and closing script tags.",
        "Paste it into the HTML of the one page it describes. The head is the usual place, but Google reads JSON-LD in the body too.",
        "On a site builder, use the page-level code injection or custom code setting. In Squarespace that is the page's Advanced settings; in WordPress, a header code plugin or your SEO plugin's schema settings. Use site-wide injection only for markup that is true on every page, such as Organization.",
        "Publish, then paste the live URL into Google's Rich Results Test to confirm Google can read it.",
        "Check Search Console in the following weeks. Its enhancement reports list valid items and any errors Google finds.",
      ],
      after: ["Already have an SEO plugin? Check whether it outputs schema of its own. Two conflicting blocks for the same thing are a common source of errors. The <a href=\"/meta-tag-checker/\">meta tag checker</a> lists every JSON-LD type a page already contains."],
    },
    {
      h: "Does schema markup help SEO?",
      p: [
        "Schema markup describes your page in a format machines can read. It does not make a page rank higher on its own, and no generator can promise it will.",
        "What valid markup does is make a page <b>eligible</b> for rich results, such as product prices or breadcrumb trails in Google's results. Eligible is not the same as shown. As of October 2026, Google decides case by case whether to display a rich result, and a page with perfect markup may still get a plain blue link. Google also changes which rich results it supports and for whom.",
        "Even when no rich result appears, clear structured data helps search engines understand who you are, what you sell and how your pages connect.",
      ],
    },
    {
      h: "Google's rules for structured data",
      p: ["Google publishes structured data guidelines, and markup that breaks them can be ignored or lead to a manual action. The main rules are simple:"],
      list: [
        "<b>Mark up only what is on the page.</b> Every question, price, address or rating in the JSON-LD must be visible to visitors on that same page.",
        "<b>No fake or invented reviews.</b> The Product rating fields are optional for a reason. Fill them in only if the page shows real reviews from real customers, and use the actual average and count. Leave them empty otherwise.",
        "<b>No reviews you wrote about yourself.</b> As of October 2026, Google does not show review stars for a local business or organization based on reviews it publishes about itself.",
        "<b>Keep it current.</b> If a price, opening hours or availability changes, update the markup at the same time as the page.",
        "<b>Describe the page, not the whole site.</b> A product block belongs on that product's page, not on the home page.",
      ],
    },
    {
      h: "Is FAQ schema still worth adding in 2026?",
      p: [
        "Since 2023, Google shows FAQ rich results mainly for well-known, authoritative government and health websites. Most other sites no longer get the expandable questions under their result, whatever their markup says.",
        "FAQ markup is still valid schema.org, and Google still reads it. It does no harm on a page that genuinely lists questions and answers, and other search engines and tools may use it. Just do not add it expecting the dropdowns to appear.",
        "For most sites, the types that matter more are the ones that match what the business is: Local business for a shop or practice, Product for a store page, Article for posts, and Organization or Person to tie a site to its owner. Breadcrumb markup is worth adding to any site with sections. Before you publish, the <a href=\"/serp-snippet-preview/\">SERP snippet preview</a> helps you get the title and description right as well.",
      ],
    },
  ],
  faq: [
    ["What is schema markup?", "It is code that describes a page's content in the shared schema.org vocabulary, such as a business name, product price or article author, so search engines can read it reliably. This generator writes it in JSON-LD, the format Google recommends."],
    ["Do I need to know code to use this generator?", "No. Fill in the form and copy the output. The only technical step is pasting it into your page, which most site builders allow through a code injection or custom code setting."],
    ["Will schema markup get me rich results?", "It makes a page eligible, not guaranteed. Google decides whether to show a rich result for each page and search. Valid markup that matches the visible content is the requirement, not a promise."],
    ["Why are my FAQ rich results not showing?", "Since 2023, Google shows FAQ rich results mainly for authoritative government and health sites. If your markup passes the Rich Results Test, it is valid. Google is simply not displaying that feature for most sites."],
    ["Can I add star ratings to my product schema?", "Only if the page shows real reviews from customers. Enter the true average rating and review count. Invented ratings break Google's guidelines and can lead to the markup being ignored or a manual action."],
    ["How do I test my schema markup?", "Use the Rich Results Test link next to the output. Test the live URL once the page is published, so you check what Google actually sees. The schema.org validator is useful for types Google does not show as rich results."],
    ["Is the schema markup generator free?", "Yes, with no sign-up and no limit. It runs in your browser, so the details you enter stay on your device."],
  ],
};
