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

var HEADERS = ["receivedAt", "kind", "email", "name", "channel", "channelId", "platform", "weekly", "message", "source"];

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

    if (body.kind === "digest" && body.email && body.html) {
      // Growth reports, welcome greetings and weekly watchlist emails, sent to the member.
      var senderEmail = Session.getEffectiveUser().getEmail();
      MailApp.sendEmail({
        to: body.email,
        subject: body.subject || "Your Passive Array update",
        body: body.message || "Open your Passive Array dashboard: https://passivearray.com/app/",
        htmlBody: body.html,
        name: "Passive Array",
        replyTo: senderEmail || undefined,
      });
      logRow({ receivedAt: body.receivedAt, kind: "digest", email: body.email, channel: body.channel, channelId: body.channelId, message: body.subject, source: body.source });
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

/** Writes one row, creating the header row on first use and dynamically adding missing headers. */
function logRow(body) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  } else {
    var lastCol = sheet.getLastColumn();
    var existingHeaders = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
    HEADERS.forEach(function (h) {
      if (existingHeaders.indexOf(h) === -1) {
        lastCol++;
        sheet.getRange(1, lastCol).setValue(h).setFontWeight("bold");
        existingHeaders.push(h);
      }
    });
  }

  var currentCols = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var row = currentCols.map(function (key) {
    return body[key] === undefined ? "" : String(body[key]);
  });
  sheet.appendRow(row);
}

/** Emails the visitor the one-time link that verifies their email and signs them in. */
function sendLoginLink(body) {
  if (!body.email || !body.link) return;
  var minutes = body.minutes || 20;
  var chNote = body.channel ? " (" + body.channel + ")" : "";
  var senderEmail = Session.getEffectiveUser().getEmail();

  var text =
    "Hi,\n\n" +
    "Confirm your email for Passive Array" + chNote + " by opening this link:\n\n" +
    body.link + "\n\n" +
    "This link is valid for " + minutes + " minutes.\n\n" +
    "If you did not request this, you can safely ignore this message.\n\n" +
    "— Passive Array (https://passivearray.com)";

  var html =
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1F2A44;max-width:520px">' +
    '<p style="margin:0 0 14px">Hi,</p>' +
    '<p style="margin:0 0 18px">Click below to confirm your email and sign in to <strong>Passive Array</strong>' + chNote + ':</p>' +
    '<p style="margin:0 0 20px"><a href="' + body.link + '" style="display:inline-block;background:#1F7F73;color:#ffffff;' +
    'text-decoration:none;font-weight:600;padding:12px 22px;border-radius:8px">Verify email &amp; sign in</a></p>' +
    '<p style="margin:0 0 14px;color:#5A6478;font-size:13px">This link is valid for ' + minutes + ' minutes. ' +
    'If you did not request this email, you can safely ignore it.</p>' +
    '<p style="margin:0;color:#5A6478;font-size:12px">— Passive Array · <a href="https://passivearray.com" style="color:#5A6478">passivearray.com</a></p></div>';

  MailApp.sendEmail({
    to: body.email,
    subject: "Confirm your email for Passive Array",
    body: text,
    htmlBody: html,
    name: "Passive Array",
    replyTo: senderEmail || undefined,
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
