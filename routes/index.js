/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var fs = require('fs');
var urls = require('../lib/urls');
var dbModels = require('../lib/db-models');

module.exports = function (store, viewsPath, urlManager, remixMailer, makeAPIPublisher) {
  var mongoose = require('mongoose');
  var dbconn = mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGO_URI || 'mongodb://localhost/appmakerdev',function(err) {
      if (err) throw new Error("Problem connecting to mongodb. Is mongod running? Is your database name correct?");
  });

  dbModels.init(dbconn);

  return {
    index: function(req, res) {
      res.render('index.ejs', { view: "home" });
    },

    about: function(req, res) {
      res.render('about.ejs', { view: "about" });
    },

    contribute: function(req, res) {
      res.render('contribute.ejs', { view: "contribute" });
    },

    designer: function (req, res) {
      res.render('designer');
    },

    remix: function (req, res) {
      var email = (req.query.email === undefined ? false : req.query.email);
      var app = req.query.app;
      var appURL = process.env.ASSET_HOST + '/designer?remix=' + encodeURIComponent(app);

      if (email !== false) {
        if (email) {
          remixMailer.sendRemixMail(req, email, appURL, function () {
            res.json({error: null}, 200);
          });
        }
        else {
          res.json({error: 'No valid email.'}, 500);
        }
      }
      else {
        res.redirect(appURL);
      }
    },

    notify: function(req, res) {
      var email = (req.query.email === undefined ? false : req.query.email);
      var appURL = (req.query.appURL === undefined ? false : req.query.appURL);

      if (appURL) {
        if (email) {
          remixMailer.sendPublishMail(req, email, appURL, function (error, result) {
            res.json({error: error, result: result}, result ? result.status : 500);
          });
        }
        else {
          res.json({error: 'No valid email.'}, 500);
        }
      } else {
        res.json({error: 'No valid appURL.'}, 500);
      }
    },

    testappdesigner: function(req, res) {
      res.render('testappdesigner');
    },

    testapp: function(req, res) {
      res.render('testapp');
    },

    publish: require('./publish')(store, viewsPath, urlManager, makeAPIPublisher, dbconn),

    componentRegistry: require('./component-registry')(mongoose, dbconn),

    proxy: require('./proxy'),

    my: require('./my')(mongoose, dbconn)

  }
};
