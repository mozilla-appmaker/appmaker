var async = require('async');
var request = require('request');

var globalMap = {};
components = ['component-button', 'component-counter'];
locales = ['en-US'];
var paths = [];

components.forEach(function (component) {
  globalMap[component] = {};
  locales.forEach(function (locale) {
    globalMap[component][locale] = {};
    paths.push([component, locale]);
  });
});

console.log(paths);

function iterator(where, done){
  var options = {};
  var component = where[0];
  var locale = where[1];
  var URL = "http://mozilla-appmaker.github.io/" + component + "/locale/" + locale + '.json'
  request.get(URL, options, function(error, response, body){
  	globalMap[component][locale] = JSON.parse(body);
    if(error){ return done(error) };
    done(null, body);
  });
};

async.mapSeries(paths, iterator, function (err, results){
  if(err){
    console.log(err)
  } else {
    console.log('All GET requests successful');
    console.log(JSON.stringify(globalMap, null, 4));
  }
});
