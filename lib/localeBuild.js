var async = require('async');
var request = require('request');
var _ = require('lodash');

module.exports = function (components, locales, callback) {

  var globalMap = {};
  var paths = [];
  var counter = 0;
  var success = 0;

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
    var URL = "http://mozilla-appmaker.github.io" + component + "locale/" + locale + '.json';
    request.get(URL, options, function (error, response, body) {
      if (error) {
        return done(error);
      }
      if (response.statusCode === 200) {
        try {
          _.extend(globalMap[locale], JSON.parse(body));
          success++;
        } catch (e) {
          console.log(e);
        }
        done(null, body);
      } else {
        if(!process.env.IGNORE_LOCALELOGGER) {
          console.log("Error "+ response.statusCode, URL);
        }
        return done(error);
      }
    });
  };

  async.map(paths, iterator, function (err, results) {
    if (err) {
      console.log(err)
    } else {
      console.log(counter + ' GET requests made and ' + success + ' object added successfully');
    }
    callback(globalMap);
  });
};
