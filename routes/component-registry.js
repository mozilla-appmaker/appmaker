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
      console.log('retrieved %s components from mongo', components.length);
      res.json(components);
  });
};

exports.component = function (req, res) {
  Component.findOne({_id: req.params.id}, function(err,obj) {
    console.log('returns the component: ' + obj);
  res.json({
    component: obj
    });
});
};
// POST

exports.addComponent = function (req, res) {
  var newComponent = new Component(req.body);
  newComponent.save(function(err){
    if (err){
      console.error('saving new component failed');
      req.json({error: 'Component was not saved due to ' + err});
      return;
    }
    console.log("component added %j: ", req.body);
    res.json(req.body);
  });
};

// PUT
exports.editComponent = function (req, res) {
  //console.log("edit post: " + req.body.title);
  Component.findByIdAndUpdate(req.params.id, {
    $set: { name: req.body.name, url: req.body.url }}, {upsert:true}, function (err, user) {
      return res.json(true);
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
