var async = require('async');
var request = require('request');
var _ = require('lodash');

module.exports = function (components, locales, callback) {

  var globalMap = {};
  var paths = [];
  var counter = 0;

  components.forEach(function (component) {
    var componentMatch = component.match("/component-.*/");
    locales.forEach(function (locale) {
      globalMap[locale] = {};
      paths.push([componentMatch, locale]);
    });
  });

  function iterator(where, done) {
  	counter++;
    var options = {};
    var component = where[0];
    var locale = where[1];
    var URL = "http://mozilla-appmaker.github.io/" + component + "/locale/" + locale + '.json'
    request.get(URL, options, function (error, response, body) {
      if (response.statusCode !== 404) {
        try {
          _.extend(globalMap[locale], JSON.parse(body));
        } catch (e) {
          console.log(e);
        }
        if (error) {
          return done(error);
        };
        done(null, body);
      } else {
        return done(error);
      }
    });
  };

  async.mapSeries(paths, iterator, function (err, results) {
    if (err) {
      console.log(err)
    } else {
      console.log(counter + ' GET requests successful');
      callback(globalMap);
    }
  });
};
