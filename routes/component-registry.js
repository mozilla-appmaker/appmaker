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
      // console.log('retrieved %s components from mongo', components.length);
      res.json(components);
  });
};

exports.component = function (req, res) {
  Component.findOne({_id: req.params.id}, function(err,obj) {
    // console.log('returns the component: ' + obj);
    res.json(obj);
  });
};
// POST

exports.addComponent = function (req, res) {
  // Handle Angular's lack of PUT or passing of id for updates
  if (req.body._id){
    return editComponent(req, res);
  }
  // console.log('add component: %j', req.body);
  var newComponent = new Component(req.body);
  newComponent.save(function(err, component){
    if (err){
      console.error('saving new component failed');
      return res.json({error: 'Component was not saved due to ' + err});
    }
    // console.log("component added %j: ", component);
    return res.json(component);
  });
};

// PUT (Not supported by Angular, boo!)
var editComponent = function (req, res) {
  // console.log('edit component: %j', req.body);
  Component.findByIdAndUpdate(req.params.id || req.body._id, {
    $set: { name: req.body.name, url: req.body.url }}, {upsert:true}, function (err, user) {
      if (err){
        console.error('saving modified component failed: ' + err);
        return res.json({error: 'Component was not updated due to ' + err});
      }
      return res.json();
    }
  );
};

exports.deleteComponent = function (req, res) {
  Component.remove({_id: req.params.id}, function (err) {
    if (!err) {
      console.log('no delete component error');
      res.json(true);
    }else {
      console.log('delete component error');
      res.json(false);
    }
  });
};
