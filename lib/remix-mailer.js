/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
var ejs = require('ejs');
var fs = require('fs');

var remixEmailHTML = fs.readFileSync(__dirname + '/../views/remix-email.ejs', 'utf8');

remixEmailTemplate = ejs.compile(remixEmailHTML, {
});

module.exports = function (postmark) {
  return {
    send: function (email, appURL, callback) {
      postmark.send({
        "From": process.env.REMIX_EMAIL,
        "To": email,
        "Subject": "Your Appmaker Remix",
        "HtmlBody": remixEmailTemplate({
          appURL: appURL
        })
      }, function(error, success) {
        if(error) {
          console.error("Unable to send via postmark: " + error.message);
          callback();
        }
        console.info("Sent to postmark for delivery");
        callback();
      });
    }
  };
};
