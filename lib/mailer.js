/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
var ejs = require('ejs');
var fs = require('fs');

var remixEmailHTML = fs.readFileSync(__dirname + '/../views/remix-email.ejs', 'utf8'),
    remixEmailTemplate = ejs.compile(remixEmailHTML, {}),

    publishEmailHTML = fs.readFileSync(__dirname + '/../views/publish-email.ejs', 'utf8'),
    publishEmailTemplate = ejs.compile(publishEmailHTML, {});

function postmarkObject(email, subject, body) {
  return {
    "From": process.env.POSTMARK_FROM_ADDRESS,
    "To": email,
    "Subject": subject,
    "HtmlBody": body
  };
}

function sendHandler(callback) {
  return function(err, result) {
    if(err) {
      console.warn("Sending to Postmark failed");
      return callback(err);
    }
    console.info("Sent to postmark for delivery");
    return callback(false, result);
  };
}

/**
 * mailer object for the various transactional emails appmaker can send
 */
module.exports = function (postmark) {
  return {
    sendRemixMail: function (req, email, appURL, callback) {
      postmark.send(
        postmarkObject(
          email,
          "Your Appmaker Remix",
          remixEmailTemplate({
            appURL: appURL,
            gettext: req.gettext
          })
        ),
        sendHandler(callback)
      );
    },
    sendPublishMail: function (req, email, appURL, callback) {
      postmark.send(
        postmarkObject(
          email,
          "Your Published Appmaker App",
          publishEmailTemplate({
            appURL: appURL,
            gettext: req.gettext
          })
        ),
        sendHandler(callback)
      );
    }
  };
};
