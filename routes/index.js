/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


var verify = require('../lib/verify');

/*
 * GET home page.
 */
module.exports = {
  index: function(req, res) {
    res.render('index.ejs');
  },

  designer: function(req, res) {
    if (req.method === 'POST' && req.body && req.body.data) {
      verify.filter(req.body.data, function (htmlInjection) {
        res.render('designer', {
          htmlInjection: htmlInjection
        });
      });
    }
    else {
      res.render('designer', {
        htmlInjection: ''
      });
    }

  },

  testappdesigner: function(req, res) {
    res.render('testappdesigner');
  },

  testapp: function(req, res) {
    res.render('testapp');
  },

  publish: require('./publish')
};
