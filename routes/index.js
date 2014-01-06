/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var fs = require('fs');
var urls = require('../lib/urls');

module.exports = function (store, viewsPath, urlManager, remixMailer, makeAPIPublisher) {
  var mongoose = require('mongoose');
  var dbconn = mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/appmakerdev');

  return {
    index: function(req, res) {
      res.render('index.ejs');
    },

    designer: function (req, res) {
      var publishUrl = urlManager.createURLPrefix('{remixName}');

      // htmlInjection is disabled for now because the old verify process isn't dependable

      // if (req.method === 'POST' && req.body && req.body.data) {
      //   verify.filter(req.body.data, function (htmlInjection) {
      //     res.render('designer', {
      //       htmlInjection: htmlInjection,
      //       publishUrl: publishUrl
      //     });
      //   });
      // }
      // else {
        res.render('designer', {
          htmlInjection: '',
          publishUrl: publishUrl
        });
      // }
    },

    remix: function (req, res) {
      var email = req.query.email;
      var app = req.query.app;

      if (email) {
        var appURL = process.env.ASSET_HOST + '/designer?remix=' + app;
        remixMailer.send(email, appURL, function () {
          res.json({error: null}, 200);
        });
      }
      else {
        res.json({error: 'No valid email.'}, 500);
      }
    },

    testappdesigner: function(req, res) {
      res.render('testappdesigner');
    },

    testapp: function(req, res) {
      res.render('testapp');
    },

    publish: require('./publish')(store, viewsPath, urlManager, makeAPIPublisher),

    componentRegistry: require('./component-registry')(mongoose, dbconn),

    proxy: require('./proxy'),

    my: require('./my')(mongoose, dbconn)

  }
};
