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
  var appSchema = mongoose.Schema({author:'string', name: 'string', html: 'string'});
  var App = mongoose.model('App', appSchema);
  return {
    apps: function(request, response) {
      if (! request.session.email) {
        response.json(401, {error: 'need to be signed in'});
        return;
      }
      App.find({author:request.session.email}, function (err, apps) {
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
        response.json(401, {error: 'need to be signed in'});
        return;
      }
      App.findOne({author:request.session.email, name: request.query.name}, function(err, obj) {
        if (err) {
          console.log('Unable to find app for %s', request.query.name);
          return response.json(500, {error: 'Unable to find app: ' + err});
        }
        return response.json(obj);
      });
    },
    delete_app: function(request,response){
      App.remove({author:request.session.email, name: request.body.name},function(err){
        if(err){
           console.error("Error deleting this app!");
           return response.json(500, {error: 'App was not deleted due to ' + err});
        }
      });
      response.json(200);
    },
    save_app: function(request, response) {
      if (! request.session.email) {
        response.json(401, {error: 'need to be signed in'});
        return;
      }
      var appObj = JSON.parse(JSON.stringify(request.body)) // make a copy
      appObj.author = request.session.email;
      var newApp = new App(appObj);
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
