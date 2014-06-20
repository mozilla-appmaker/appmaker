/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
* Serve JSON to our AngularJS client
*/

var dbModels = require('../lib/db-models');

module.exports = function (mongoose, dbconn) {
  var Component = dbModels.get('Component');

  return {
    // GET
    components: function (req, res) {
      if (! request.session.email) {
        response.json(401, {error: 'need to be signed in'});
        return;
      }
      Component.find({author: request.session.email}, function (err, components) {
        if (err){
          console.log('Unable to retrieve components');
          return res.json(500, 'Unable to retrieve components: ' + err);
        }
        // console.log('retrieved %s components from mongo', components.length);
        return res.json(components);
      });
    },
    component: function (req, res) {
      if (! request.session.email) {
        response.json(401, {error: 'need to be signed in'});
        return;
      }
      Component.findOne({_id: req.params.id}, function(err,obj) {
        // console.log('returns the component: ' + obj);
        if (err){
          console.log('Unable to find component for %s', req.params.id);
          return res.json(500, {error: 'Unable to find component: ' + err});
        }
        return res.json(obj);
      });
    },

    addComponent: function (req, res) { // POST
      if (! request.session.email) {
        response.json(401, {error: 'need to be signed in'});
        return;
      }
      if (req.body._id){
        // Handle Angular's lack of PUT or passing of id for updates
        return editComponent(req, res);
      }
      // console.log('add component: %j', req.body);
      var compObj = JSON.parse(JSON.stringify(req.body)) // make a copy
      compObj['created-date'] = compObj['modified-date'] = new Date();
      var newComponent = new Component(compObj);
      newComponent.save(function(err, component){
        if (err){
          console.error('saving new component failed');
          return res.json(500, {error: 'Component was not saved due to ' + err});
        }
        // console.log("component added %j: ", component);
        return res.json(component);
      });
    },
    editComponent: function (req, res) { // PUT (Not supported by Angular, boo!)
      // console.log('edit component: %j', req.body);
      if (! request.session.email) {
        response.json(401, {error: 'need to be signed in'});
        return;
      }
      var compObj = {
        'name': req.body.name,
        'url': req.body.url,
        'modified-date': new Date()
      };
      var newComponent = new Component(compObj);
      Component.findByIdAndUpdate(req.params.id || req.body._id, {
        $set: compObj}, {upsert:true}, function (err, user) {
          if (err){
            console.error('saving modified component failed: ' + err);
            return res.json(500, {error: 'Component was not updated due to ' + err});
          }
          return res.json(null);
        }
      );
    },
    deleteComponent: function (req, res) { // DEL
      if (! request.session.email) {
        response.json(401, {error: 'need to be signed in'});
        return;
      }
      Component.remove({_id: req.params.id}, function (err) {
        if (err) {
          console.log('delete component error');
          res.json(500, {error: 'unable to delete component: ' + err});
        }
        return res.json(true);
      });
    }
  }
};
