# JPG to PDF Converter

A small tool that turns images into a PDF, like the "JPG to PDF" tool on iLovePDF.
It runs completely inside the browser. Nothing is uploaded anywhere, no account,
no API key, no internet connection needed.

## How to run it

1. Open this folder.
2. Double-click **Start.bat** (or just double-click `index.html`).
3. The page opens in your browser.
4. Click **Select JPG images** or drop images onto the page.
5. Reorder, rotate or remove images, pick your options, then press **Convert to PDF**.
6. The PDF is downloaded to your Downloads folder.

## What it can do

| Feature | Details |
|---|---|
| Formats | JPG, PNG, WebP, GIF, BMP. (HEIC and TIFF are not supported by browsers.) |
| Reorder | Drag a thumbnail onto another one, or use the ← → buttons. |
| Rotate | The ⟳ button turns an image 90° each click. |
| Page orientation | Auto (matches each image), Portrait, Landscape. |
| Page size | Fit image (page is exactly the image size), A4, US Letter. |
| Margin | None, Small, Big. |
| Merge | On: one PDF with all images. Off: a separate PDF for every image. |
| Quality | Plain JPG files are put in the PDF without recompression. Other formats are converted to JPG at 92% quality first. |

## What is in this folder

| File | What it does |
|---|---|
| `index.html` | The whole tool: page, styling and the PDF builder. Change text, colours, or layout here. |
| `Start.bat` | Opens the tool in your browser. Double-click it. |
| `README.md` | This file. |

## Changing things

Everything lives in `index.html`. Near the top of the `<script>` section:

- `JPEG_QUALITY` sets how strongly non-JPG images are compressed (0 to 1).
- `PAGE_SIZES` holds the paper sizes in PDF points. Add a new one there and a
  matching button in the "Page size" section of the HTML.
- The `Margin` buttons carry their size in points in `data-val` (72 points = 1 inch).

## Putting it on a website later

Because there is no server, you can upload `index.html` to any static host
(Netlify, GitHub Pages, your own web hosting) or paste it into a page as-is.
