/**
 * Passive Array sign-up receiver for Google Sheets.
 *
 * Paste this whole file into a Google Apps Script project bound to a Google
 * Sheet, deploy it as a Web app, and put the resulting URL in the Vercel
 * environment variable SUBSCRIBE_WEBHOOK_URL. Full steps are in README.md
 * under "Sign-up, newsletter and contact forms".
 *
 * It creates the header row by itself on the first sign-up, so there is
 * nothing to set up in the sheet beforehand.
 */

var HEADERS = ["receivedAt", "kind", "email", "name", "platform", "message", "source"];

function doPost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // First run: write the header row and freeze it.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    }

    sheet.appendRow(HEADERS.map(function (key) {
      return body[key] === undefined ? "" : String(body[key]);
    }));

    // Email yourself when somebody uses the contact form, so you see it the
    // same day. Delete these three lines if you would rather not get email.
    if (body.kind === "contact") {
      var owner = Session.getEffectiveUser().getEmail();
      if (owner) {
        MailApp.sendEmail(owner, "Passive Array contact: " + (body.email || "no email"),
          "From: " + (body.name || "(no name)") + " <" + (body.email || "") + ">\n" +
          "Topic: " + (body.platform || "") + "\n" +
          "Page: " + (body.source || "") + "\n\n" + (body.message || ""));
      }
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

/** Lets you open the deployment URL in a browser to check it is live. */
function doGet() {
  return json({ ok: true, service: "Passive Array sign-up receiver" });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
