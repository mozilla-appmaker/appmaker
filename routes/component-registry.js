/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var express = require("express"),
  app     = express(),
  port    = parseInt(process.env.PORT, 10) || 6080;

app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/app'));
  app.use(app.router);
});

var componentsMap = {
  '1': {
    "id": 1,
    "name": "Button",
    "url": "button.html"
  },
  '2': {
    "id": 2,
    "name": "Slider",
    "url": "slider.html"
  }
};
var next_id = 3;

app.get('/components', function(req, res) {
  var components = [];

  for (var key in componentsMap) {
    components.push(componentsMap[key]);
  }
  res.send(components);
});

app.get('/components/:id', function(req, res) {
  console.log('Requesting component with id', req.params.id);
  res.send(componentsMap[req.params.id]);
});

app.post('/components', function(req, res) {
  var component = {};
  component.id = next_id++;
  component.name = req.body.name;
  component.url = req.body.url;

  componentsMap[component.id] = component;

  res.send(component);
});

app.post('/components/:id', function(req, res) {
  var component = {};
  component.id = req.params.id;
  component.name = req.body.name;
  component.url = req.body.url;

  componentsMap[component.id] = component;

  res.send(component);
});

app.delete('/components/:id', function(req, res) {
  var key = req.params.id;
  delete componentsMap[key]
  res.send();
});

var notificationsMap = {
  '1': {
    "id": 1,
    "type": "yuck",
    "message": "This is a stupid component"
  },
  '2': {
    "id": 2,
    "type": "gross",
    "message": "This component sucks"
  }
};

app.get('/notification/:notificationId', function(req, res) {
  console.log('Requesting notification with id', req.params.notificationId);
  res.send(notificationsMap[req.params.notificationId]);
});

app.listen(port);
console.log('Now serving the app at http://localhost:' + port + '/');
