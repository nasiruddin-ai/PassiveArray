/**
 * Passive Array receiver for Google Sheets.
 *
 * Handles everything the site sends to SUBSCRIBE_WEBHOOK_URL:
 *   kind "signup" / "newsletter"  a row in the sheet
 *   kind "contact"                a row, plus an email to you
 *   kind "login"                  emails the visitor their sign-in link
 *   kind "preferences"            a row recording their choice
 *   kind "delete"                 a row, plus an email to you to action it
 *
 * Paste this whole file into a Google Apps Script project bound to a Google
 * Sheet, deploy it as a Web app, and put the resulting URL in the Vercel
 * environment variable SUBSCRIBE_WEBHOOK_URL. Full steps are in README.md.
 *
 * It creates the header row by itself on the first message, so there is
 * nothing to set up in the sheet beforehand.
 */

var HEADERS = ["receivedAt", "kind", "email", "name", "platform", "weekly", "message", "source"];

function doPost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }

    // A sign-in link is time-critical and private: email it, never log it.
    if (body.kind === "login") {
      sendLoginLink(body);
      logRow({ receivedAt: body.receivedAt, kind: "login", email: body.email, source: body.source });
      return json({ ok: true });
    }

    logRow(body);

    var owner = Session.getEffectiveUser().getEmail();
    if (owner && body.kind === "contact") {
      MailApp.sendEmail(owner, "Passive Array contact: " + (body.email || "no email"),
        "From: " + (body.name || "(no name)") + " <" + (body.email || "") + ">\n" +
        "Topic: " + (body.platform || "") + "\n" +
        "Page: " + (body.source || "") + "\n\n" + (body.message || ""));
    }
    if (owner && body.kind === "delete") {
      MailApp.sendEmail(owner, "Passive Array: delete request from " + (body.email || ""),
        "This person asked for their data to be removed:\n\n" + (body.email || "") +
        "\n\nDelete their rows from the sheet to complete it.");
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

/** Writes one row, creating the header row on first use. */
function logRow(body) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  sheet.appendRow(HEADERS.map(function (key) {
    return body[key] === undefined ? "" : String(body[key]);
  }));
}

/** Emails the visitor the one-time link that signs them in. */
function sendLoginLink(body) {
  if (!body.email || !body.link) return;
  var minutes = body.minutes || 20;

  var text =
    "Here is your sign-in link for Passive Array.\n\n" +
    body.link + "\n\n" +
    "It expires in " + minutes + " minutes.\n\n" +
    "If you did not ask to sign in, ignore this email. Nobody can use the link without it.\n\n" +
    "Passive Array, free tools for creators and brands.";

  var html =
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1F2A44;max-width:520px">' +
    '<p style="margin:0 0 18px">Here is your sign-in link for <strong>Passive Array</strong>.</p>' +
    '<p style="margin:0 0 22px"><a href="' + body.link + '" style="display:inline-block;background:#1F7F73;color:#ffffff;' +
    'text-decoration:none;font-weight:600;padding:13px 22px;border-radius:12px">Sign me in</a></p>' +
    '<p style="margin:0 0 18px;color:#5A6478;font-size:13px">It expires in ' + minutes + ' minutes. ' +
    'If the button does not work, paste this into your browser:<br>' +
    '<span style="word-break:break-all">' + body.link + '</span></p>' +
    '<p style="margin:0;color:#5A6478;font-size:13px">If you did not ask to sign in, ignore this email. ' +
    'Nobody can use the link without it.</p></div>';

  MailApp.sendEmail({
    to: body.email,
    subject: "Your Passive Array sign-in link",
    body: text,
    htmlBody: html,
    name: "Passive Array",
  });
}

/** Lets you open the deployment URL in a browser to check it is live. */
function doGet() {
  return json({ ok: true, service: "Passive Array receiver" });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
