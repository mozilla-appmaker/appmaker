#!/usr/bin/env node

var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

if (!process.env.DISABLE_TESTS){
  app.use('/test', express.static(__dirname + '/test'));
}

app.use('/', express.static(__dirname + '/public'));


var server = app.listen(process.env.PORT, function (err) {
  console.log('Running on', server.address());
});
