/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

module.exports = function(app){
  // Redirect to REDIRECT_URL if user came in on different proto/host
  // and REDIRECT_URL is set.
  if (process.env.REDIRECT_URL){
    var split = process.env.REDIRECT_URL.split("://");
    var target = {
      protocol: split[0],
      host: split[1]
    };

    app.get("*", function(req, res, next){
      var src = {
        protocol: req.headers["x-forwarded-proto"] || req.protocol,
        host: req.headers["host"]
      };

      if (src.protocol !== target.protocol || src.host != target.host){
        var url = process.env.REDIRECT_URL + req.url;
        console.log("Redirecting user to: " + url);
        res.redirect(url);
      }
      else {
        next();
      }
    });
  }
};
