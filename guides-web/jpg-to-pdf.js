// Long-form guide for /jpg-to-pdf/.
// Every behaviour and number here matches jpg-to-pdf/index.html (the PDF is built in the browser).
module.exports = {
  seoTitle: "JPG to PDF Converter: Free, No Upload | Passive Array",
  seoDescription: "Convert JPG to PDF free, right in your browser. Your photos are never uploaded. Merge several images into one PDF, reorder, rotate and set page size and margin.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "How to convert JPG to PDF",
      ordered: true,
      list: [
        "Click <b>Select JPG images</b>, or drag images anywhere onto the page. JPG, PNG, WebP, GIF and BMP all work.",
        "Put the pages in order. Drag one thumbnail onto another, or use the arrows. The number in the corner is the page number.",
        "Rotate any image a quarter turn with the rotate button, and remove any you do not want.",
        "Pick a page orientation, a page size and a margin on the right.",
        "Leave <b>Merge all images in one PDF</b> ticked for a single file, or untick it to get one PDF per image.",
        "Click <b>Convert to PDF</b>. The file downloads straight away.",
      ],
      after: ["A merged file is named after the image when there is only one, and images-to-pdf.pdf when there are several. If you chose one PDF per image and only one file appears, your browser is blocking multiple downloads; allow them for this page."],
    },
    {
      h: "Are my images uploaded anywhere?",
      p: [
        "No. The converter runs entirely in your browser. It reads your images, writes the PDF file itself and hands it to your downloads folder. Your photos never leave your computer or phone, and there is no server copy to delete afterwards.",
        "That makes it a sensible choice for scans of an ID, a signed form, a receipt or anything else you would rather not send to a stranger's server. You can check this yourself: the page keeps working for a conversion even if you switch off your connection after it has loaded.",
      ],
    },
    {
      h: "Page size, orientation and margin explained",
      table: {
        head: ["Option", "Choices", "What it does"],
        rows: [
          ["Page size", "Fit image", "Each page is exactly the size of its image, at 96 pixels to the inch. Nothing is cropped or padded."],
          ["Page size", "A4 or US Letter", "Every page is a standard paper size, and each image is scaled to fit and centred on it."],
          ["Orientation", "Auto, Portrait, Landscape", "Auto turns a page sideways when its image is wider than it is tall. It applies to A4 and Letter pages."],
          ["Margin", "None, Small, Big", "White space around the image: none, about 1 cm, or about 2 cm."],
        ],
      },
      after: [
        "<b>For printing,</b> choose A4 or US Letter with a small margin. Printers cannot reach the very edge of the paper, and a fixed size prints predictably.",
        "<b>For a screen,</b> Fit image is cleaner, because there are no white bands. Phone photos are large, so a Fit image page can measure many inches across. That does not affect quality; PDF readers simply zoom to fit.",
      ],
    },
    {
      h: "Does converting JPG to PDF reduce quality?",
      p: [
        "Not for ordinary JPGs. A PDF can hold JPEG data as it is, so the tool copies standard colour and greyscale JPG files into the PDF byte for byte. There is no recompression, so there is no loss, and the PDF ends up close to the combined size of the images.",
        "Some images do have to be redrawn and saved as JPEG at high quality first:",
      ],
      list: [
        "<b>PNG, WebP, GIF and BMP files,</b> because a PDF page needs them in a form it can embed. Transparent areas become white. An animated GIF keeps only one frame.",
        "<b>JPGs with a rotation flag,</b> which phones often add instead of turning the pixels. Redrawing them makes sure the page faces the right way.",
        "<b>JPGs in CMYK colour,</b> the format some print software saves.",
      ],
      after: ["HEIC photos from iPhones and TIFF files cannot be read by most browsers, so the tool cannot open them. Convert them to JPG first. On an iPhone, you can also set Settings, Camera, Formats to Most Compatible so new photos are saved as JPG."],
    },
    {
      h: "How to make the PDF smaller",
      p: [
        "Because original JPGs go in untouched, the PDF is about as large as the images you add. A dozen full-resolution phone photos make a large file, which some email services and upload forms will refuse.",
        "If you need a smaller file, shrink the images before you convert them. Most phones and photo apps can export at a smaller size, and a document photo rarely needs more than the width of a printed page. Then convert the smaller copies here.",
        "Making something for social media or YouTube instead? The <a href=\"/creator-tools/youtube-thumbnail-downloader/\">YouTube thumbnail downloader</a> saves any video's thumbnail as a JPG you can use as a reference.",
      ],
    },
  ],
  faq: [
    ["Is this JPG to PDF converter free?", "Yes. No sign-up, no watermark and no limit on the number of conversions. Because the work happens on your own device, there is nothing for us to meter."],
    ["Can I combine several JPGs into one PDF?", "Yes. Add all the images, put them in order, keep Merge all images in one PDF ticked and click Convert. Each image becomes one page."],
    ["Does it work on a phone?", "Yes. Tap Select JPG images to pick photos from your gallery. Very large batches may be slow on older phones, because the device does all the work."],
    ["Is there a limit on the number of images?", "There is no fixed limit. The practical limit is your device's memory. If a very large batch fails, convert it in two or three parts."],
    ["Why can't I add my HEIC or TIFF photos?", "Most browsers cannot decode those formats, so the page cannot read them. Convert them to JPG with your phone or a photo app first, then add them here."],
    ["Will my PDF pages be the right way up?", "Yes. Phone photos that carry a rotation flag are redrawn the right way up. If one still faces the wrong way, use the rotate button on its thumbnail before converting."],
    ["Can I convert PNG to PDF with this tool?", "Yes. PNG, WebP, GIF and BMP are all accepted. They are saved as high-quality JPEG inside the PDF, and any transparent areas turn white."],
  ],
};
