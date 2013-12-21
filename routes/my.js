#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var request = require('request');

module.exports = function (mongoose, dbconn) {
  var appSchema = mongoose.Schema({author:'string', name: 'string', html: 'string'});
  var App = mongoose.model('App', appSchema);
  return {
    apps: function(request, response) {
      if (! request.session.email) {
        response.json(401, {error: 'need to be signed in'});
        return;
      }
      App.find({author:request.session.email}).sort({"name":1}).exec(function (err, apps) {
        if (err){
          console.log('Unable to retrieve apps');
          return response.json(500, 'Unable to retrieve apps: ' + err);
        }
        return response.json(apps);
      });
    },
    app: function(request, response) {
      if (! request.session.email) {
        response.json(401, {error: 'need to be signed in'});
        return;
      }
      App.findOne({author:request.session.email, name: request.query.name}, function(err, obj) {
        if (!obj) {
          console.log('Unable to find app for %s', request.query.name);
          return response.json(500, {error: 'Unable to find app: ' + err});
        } else {
          console.log("success");
          return response.json(obj);
        }
      });
    },
    update_app: function(request, response) {
      var name = request.body.name;
      var html = request.body.html;
      console.log(name + " to " + html);
      if (! request.session.email) {
        response.json(401, {error: 'need to be signed in'});
        return;
      }
      App.update(
        {author:request.session.email, name: name},
        {
          $set: {html: html}
        },
        {},
        function(err,obj){
          if(err){
            return response.json(500, {error: 'App was not pudated due to ' + err});
          } else {
            return response.json(200, {message: 'App was updated successfully'});
          }
        });
    },
    rename_app: function(request, response) {
      var oldName = request.body.oldName;
      var newName = request.body.newName;

      if (! request.session.email) {
        response.json(401, {error: 'need to be signed in'});
        return;
      }

      App.update(
        {author:request.session.email, name: oldName},
        {
          $set: {name: newName}
        },
        {},
        function(err,obj){
          if(err){
            return response.json(500, {error: 'App was not renamed due to ' + err});
          } else {
            return response.json(200, {message: 'App was renamed successfully'});
          }
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

      //Check if app with same name already exists

      App.findOne({author:request.session.email, name: request.body.name}, function(err, obj) {
        if (obj) {
         return response.json(500, {error: 'App name must be unique.'});
        } else {
          var appObj = JSON.parse(JSON.stringify(request.body)) // make a copy
         appObj.author = request.session.email;
         var newApp = new App(appObj);
         newApp.save(function(err, app){
           if (err){
             return response.json(500, {error: 'App was not saved due to ' + err});
           }
           return response.json(app);
         });
         response.json(200);
        }
      });



    }
  }
};
