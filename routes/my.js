#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function hex(length){
    if (length > 8) return hex(8) + hex(length-8); // routine is good for up to 8 digits
    var myHex = Math.random().toString(16).slice(2,2+length);
    return pad(myHex, length); // just in case we don't get 8 digits for some reason
}

function pad(str, length){
    while(str.length < length){
        str += '0';
    }
    return str;
}

function variant(){
    return '89ab'[Math.floor(Math.random() * 4)];
}

// Public interface
function uuid(){
    return hex(8) + '-' + hex(4) + '-4' + hex(3) + '-' + variant() + hex(3) + '-' + hex(12);
}

var request = require('request');

module.exports = function (mongoose, dbconn) {
  var componentSchema = mongoose.Schema({author:'string', url: 'string'});
  var Component = mongoose.model('LearnedComponent', componentSchema, 'components');

  var appSchema = mongoose.Schema({author:'string', appid: 'string', name: 'string', html: 'string'});
  var App = mongoose.model('App', appSchema, 'apps');
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
    //Does anything call this controller
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
    updateApp: function(request, response) {
      var appid = request.body.appid;
      console.log("update app: " + appid);
      var html = request.body.html;

      if (! request.session.email) {
        response.json(401, {error: 'need to be signed in'});
        return;
      }
      App.update(
        {author:request.session.email, appid: appid},
        {
          $set: {html: html}
        },
        {},
        function(err,obj){
          if(err){
            return response.json(500, {error: 'App was not updated due to ' + err});
          } else {
            return response.json(200, {message: 'App was updated successfully'});
          }
        });
    },
    renameApp: function(request, response) {
      var appid = request.body.appid;
      var oldName = request.body.oldName;
      var newName = request.body.newName;

      if (! request.session.email) {
        response.json(401, {error: 'need to be signed in'});
        return;
      }

      App.update(
        {author:request.session.email, appid: appid, name: oldName},
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
    deleteApp: function(request,response){
      App.remove({author:request.session.email, appid: request.body.appid},function(err){
        if(err){
           console.error("Error deleting this app!");
           return response.json(500, {error: 'App was not deleted due to ' + err});
        }
      });
      response.json(200);
    },
    getFormJSON: function(request, response){
        if (! request.session.email) {
            response.json(401, {error: 'need to be signed in'});
            return;
        }

        App.findOne({author:request.session.email, formJSON: request.body}, function(err,obj){
            if (err){
                console.log('Unable to retrieve formJSON');
                return response.json(500, 'Unable to retrieve formJSON: ' + err);
            }

            return response.json(obj);
        });

    },
    saveApp: function(request, response) {
      if (! request.session.email) {
        response.json(401, {error: 'need to be signed in'});
        return;
      }
      var incoming_appid = request.body.appid;
      console.log("my.js - incoming appid: " + incoming_appid);
      if(!incoming_appid){
          incoming_appid = 'ceci-app-' + uuid();
      }
      console.log("my.js - after incoming appid: " + incoming_appid)

      //Check if app with same name already exists

      App.findOne({author:request.session.email, appid: incoming_appid}, function(err, obj) {
        if (obj) {
          return response.json(500, {error: 'App name must be unique.'});
        }
        else {
          var appObj = JSON.parse(JSON.stringify(request.body)) // make a copy

          appObj.author = request.session.email;
          appObj.appid = incoming_appid;

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
    },
    components: function(request, response) {
      if (! request.session.email) {
        response.json(401, {error: 'need to be signed in'});
        return;
      }
      Component.find({author:request.session.email}).sort({"name":1}).exec(function (err, components) {
        if (err){
          console.log('Unable to retrieve components');
          return response.json(500, 'Unable to retrieve components: ' + err);
        }
        return response.json(components);
      });
    },
    learnComponent: function(request, response) {
      if (! request.session.email) {
        response.json(401, {error: 'need to be signed in'});
        return;
      }
      //Check if app with same url already exists
      Component.findOne({author:request.session.email, url: request.body.name}, function(err, obj) {
        if (obj) {
          return response.json(500, {error: 'We already know about this component.'});
        } else {
          var compObj = JSON.parse(JSON.stringify(request.body)) // make a copy
          compObj.author = request.session.email;
          var newComponent = new Component(compObj);
          newComponent.save(function(err, component){
            if (err) {
              return response.json(500, {error: 'Component was not learned due to ' + err});
            }
            return response.json(component);
          });
          response.json(200);
        }
      });
    },
    forgetComponent: function(request, response) {
      Component.remove({author:request.session.email, url: request.body.url}, function(err){
        if(err){
           console.error("Error forgetting this component!");
           return response.json(500, {error: 'Component was not deleted due to ' + err});
        }
      });
      response.json(200);
    }
  }
};
