#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var http = require('http');
var url = require('url');
var request = require('request');
var path = require('path');
var fs = require('fs');

module.exports = function (mongoose, dbconn) {
  var appSchema = mongoose.Schema({name: 'string', html: 'string'});
  var App = mongoose.model('App', appSchema);
  return {
    apps: function(request, response) {
      if (! request.session.email) {
        response.json({'apps': []}, 400);
        return;
      }
      App.find({}, function (err, apps) {
        if (err){
          console.log('Unable to retrieve apps');
          return response.json(500, 'Unable to retrieve apps: ' + err);
        }
        // console.log('retrieved %s apps from mongo', apps.length);
        // console.log('retrieved %s apps from mongo', apps);
        return response.json(apps);
      });
    },
    app: function(request, response) {
      if (! request.session.email) {
        response.json({'apps': []}, 400);
        return;
      }
      App.findOne({name: request.query.name}, function(err, obj) {
        if (err) {
          console.log('Unable to find app for %s', request.query.name);
          return response.json(500, {error: 'Unable to find app: ' + err});
        }
        return response.json(obj);
      });
    },
    save_app: function(request, response) {
      if (! request.session.email) {
        response.json({'apps': []}, 400);
        return;
      }
      var newApp = new App(request.body);
      newApp.save(function(err, app){
        if (err){
          console.error('saving new app failed');
          return response.json(500, {error: 'App was not saved due to ' + err});
        }
        return response.json(app);
      });
      response.json(200);
    }
  }
};

