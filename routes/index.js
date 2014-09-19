/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var fs = require('fs');
var urls = require('../lib/urls');
var dbModels = require('../lib/db-models');

module.exports = function (store, viewsPath, urlManager, remixMailer, makeAPIPublisher) {
  var mongoose = require('mongoose');
  var dbconn = mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGO_URI || 'mongodb://localhost/appmakerdev', function(err) {
      if (err) {
        console.log("****************************************************************************************");
        console.log("*                                                                                      *");
        console.log("*   Problem connecting to mongodb! Is mongod running? Is your database name correct?   *");
        console.log("*   NOTE: Appmaker *will* run, but you will not be able to save or publish anything!   *");
        console.log("*                                                                                      *");
        console.log("****************************************************************************************");
      }
  });

  if(dbconn) {
    dbModels.init(dbconn);
  }

  return {

    index: function(req, res) {
      res.redirect(301, 'designer');
    },

    testInstall: function (req, res) {
      res.render('install', {
        appname : "Test App",
        webmakerurl : "http://example.com",
        username : "Mr. Test Testerson",
        description : "One of the best test apps in the business. Test it all you want, it will never fail you.",
        manifestUrl : "test.manifest",
        iframeSrc : "http://example.com"
      });
    },

    testPublish: function (req, res) {
      res.render('publish', {
        appHTML : "<p>I'm an app, don't youk now!</p>",
        appName : "Test App",
        ceciComponentURL : "ceciComponentURL",
        userComponents : [],
        webmakerurl : "http://example.com",
        remixUrl : "http://example.com",
        username : "testperson",
        description : "One of the best test apps in the business. Test it all you want, it will never fail you.",
        manifestUrl : "test.manifest",
        iframeSrc : "http://example.com"
      });
    },

    designer: function (req, res) {
      res.render('designer', { allowCustomComponents: !!process.env.ALLOW_CUSTOM_COMPONENTS });
    },

    remix: function (req, res) {
      var email = (req.query.email === undefined ? false : req.query.email);
      var app = req.query.app;
      var appURL = process.env.ASSET_HOST + '/designer?remix=' + encodeURIComponent(app);

      res.set('Access-Control-Allow-Origin', "*");
      if (email !== false) {
        if (email) {
          remixMailer.sendRemixMail(req, email, appURL, function (error, result) {
            if (error) {
              res.json({error: error}, 500);
            } else {
              res.json({result: result}, 200);
            }
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
            if (error) {
              res.json({error: error}, 500);
            } else {
              res.json({result: result}, 200);
            }
          });
        }
        else {
          res.json({error: 'No valid email.'}, 500);
        }
      } else {
        res.json({error: 'No valid appURL.'}, 500);
      }
    },

    publish: require('./publish')(store, viewsPath, urlManager, makeAPIPublisher, dbconn),

    componentRegistry: require('./component-registry')(mongoose, dbconn),

    proxy: require('./proxy'),

    my: require('./my')(mongoose, dbconn, makeAPIPublisher)

  }
};
