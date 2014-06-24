#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

//TODO use node UUID module instead https://github.com/mozilla-appmaker/appmaker/issues/826
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
var dbModels = require('../lib/db-models');

module.exports = function (mongoose, dbconn) {
  var Component = dbModels.get('Component');
  var App = dbModels.get('App');

  var checkAuthorised = function(request, response, next) {
    if (! request.session.email) {
      response.json(401, {error: 'need to be signed in'});
      return false;
    }
    if(next) next();
    return true;
  };

  return {
    apps: function(request, response) {
      if (!checkAuthorised(request, response)) return;

      App.find({author:request.session.email}).sort({"name":1}).exec(function (err, apps) {
        if (err){
          console.log('Unable to retrieve apps');
          return response.json(500, 'Unable to retrieve apps: ' + err);
        }
        return response.json(apps);
      });
    },
    app: function(request, response) {
      if (!checkAuthorised(request, response)) return;

      App.findOne({author:request.session.email, name: request.query.name}, function(err, obj) {
        if (!obj) {
          console.error('Unable to find app for %s', request.query.name);
          return response.json(500, {error: 'Unable to find app: ' + err});
        } else {
          return response.json(obj);
        }
      });
    },
    renameApp: function(request, response) {
      if (!checkAuthorised(request, response)) return;

      var setObj = {};
      var oldName = request.body.oldName;
      var newName = request.body.newName;
      setObj.name = newName;
      setObj['modified-date'] = new Date();

      App.update(
        {author:request.session.email, name: oldName},
        {
          $set: setObj
        },
        {},
        function(err,obj){
          if(err){
            return response.json(500, {error: 'App was not renamed due to ' + err});
          } else {
            return response.json(200, {message: 'App was renamed successfully'});
          }
        }
      );
    },
    deleteApp: function(request,response){
      if (!checkAuthorised(request, response)) return;

      App.remove({author:request.session.email, name: request.body.name},function(err){
        if(err){
          console.error("Error deleting this app!");
          return response.json(500, {error: 'App was not deleted due to ' + err});
        }
      });
      response.json(200);
    },
    saveApp: function(request, response) {
      if (!checkAuthorised(request, response)) return;

      //Check if app with same name already exists
      App.findOne({author:request.session.email, name: request.body.name}, function(err, obj) {
        if (obj) {
          return response.json(500, {error: 'App name must be unique.'});
        }
        else {
          var appObj = JSON.parse(JSON.stringify(request.body)) // make a copy
          appObj.author = request.session.email;
          appObj.appid = request.body.appid;
          appObj['created-date'] = appObj['modified-date'] = new Date();
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
    updateApp: function(request, response) {
      if (!checkAuthorised(request, response)) return;

      var name = request.body.name;
      //TODO query by appid instead of name https://github.com/mozilla-appmaker/appmaker/issues/898
      var html = request.body.html || false;
      var url = request.body.url || false;

      if(html === false) {
          return response.json(409, {error: 'App was not updated as no data was sent with the request'});
      }

      var setObj = {};
      if(html) setObj.html = html;
      if(url) setObj['last-published-url'] = url;
      setObj['modified-date'] = new Date();
      App.update(
        {author:request.session.email, name: name},
        { $set: setObj },
        {},
        function(err,obj){
          if(err){
            return response.json(500, {error: 'App was not updated due to ' + err});
          } else {
            return response.json(200, {message: 'App was updated successfully'});
          }
        });
    },
    components: function(request, response) {
      if (!checkAuthorised(request, response)) return;

      Component.find({author:request.session.email}).sort({"name":1}).exec(function (err, components) {
        if (err){
          console.log('Unable to retrieve components');
          return response.json(500, 'Unable to retrieve components: ' + err);
        }
        return response.json(components);
      });
    },
    learnComponent: function(request, response) {
      if (!checkAuthorised(request, response)) return;

      //Check if component with same url already exists
      Component.findOne({author:request.session.email, url: request.body.url}, function(err, obj) {
        if (obj) {
          return response.json(500, {error: 'We already know the component at '+obj.url+' (as '+obj.name+')'});
        }
        var compObj = JSON.parse(JSON.stringify(request.body)) // make a copy
        compObj.author = request.session.email;
        compObj['created-date'] = compObj['modified-date'] = new Date();
        var newComponent = new Component(compObj);
        newComponent.save(function(err, component){
          if (err) {
            return response.json(500, {error: 'Component was not learned due to ' + err});
          }
          return response.json(component);
        });
        response.json(200);
      });
    },
    forgetComponent: function(request, response) {
      if (!checkAuthorised(request, response)) return;

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
