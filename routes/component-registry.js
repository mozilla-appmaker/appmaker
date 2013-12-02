/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
* Serve JSON to our AngularJS client
*/


var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/componentregistry');

var componentSchema = mongoose.Schema({name: 'string', url: 'string'});
var Component = mongoose.model('Component', componentSchema);


// GET
exports.components = function (req, res) {
  Component.find({}, function (err, components) {
      if (err){
        console.log('Unable to retrieve components');
        return res.json(500, 'Unable to retrieve components: ' + err);
      }
      // console.log('retrieved %s components from mongo', components.length);
      return res.json(components);
  });
};

exports.component = function (req, res) {
  Component.findOne({_id: req.params.id}, function(err,obj) {
    // console.log('returns the component: ' + obj);
    if (err){
      console.log('Unable to find component for %s', req.params.id);
      return res.json(500, {error: 'Unable to find component: ' + err});
    }
    return res.json(obj);
  });
};
// POST

exports.addComponent = function (req, res) {
  if (req.body._id){
    // Handle Angular's lack of PUT or passing of id for updates
    return editComponent(req, res);
  }
  // console.log('add component: %j', req.body);
  var newComponent = new Component(req.body);
  newComponent.save(function(err, component){
    if (err){
      console.error('saving new component failed');
      return res.json(500, {error: 'Component was not saved due to ' + err});
    }
    // console.log("component added %j: ", component);
    return res.json(component);
  });
};

var editComponent = function (req, res) {
  // console.log('edit component: %j', req.body);
  Component.findByIdAndUpdate(req.params.id || req.body._id, {
    $set: { name: req.body.name, url: req.body.url }}, {upsert:true}, function (err, user) {
      if (err){
        console.error('saving modified component failed: ' + err);
        return res.json(500, {error: 'Component was not updated due to ' + err});
      }
      return res.json(null);
    }
  );
};

exports.deleteComponent = function (req, res) {
  Component.remove({_id: req.params.id}, function (err) {
    if (err) {
      console.log('delete component error');
      res.json(500, {error: 'unable to delete component: ' + err});
    }
    return res.json(true);
  });
};
