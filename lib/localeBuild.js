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
      if (componentMatch) {
        paths.push([componentMatch, locale]);
      }
    });
  });

  function iterator(where, done) {
  	counter++;
    var options = {};
    var component = where[0];
    var locale = where[1];
    if (component) {
      var URL = "http://mozilla-appmaker.github.io" + component + "locale/" + locale + '.json';
      request.get(URL, options, function (error, response, body) {
        if (error) {
          if (!process.env.LOAD_FROM_GITHUB) {
            // request calls should fail if we're not loading from github.
          }
          else if (error.code === 'ENOTFOUND') {
            console.error('Couldn\'t get ' + URL);
          }
          else {
            console.error(error);
          }
        }
        else {
          if (response.statusCode === 200) {
            try {
              _.extend(globalMap[locale], JSON.parse(body));
              success++;
            } catch (e) {
              console.error(e);
            }
          }
          else {
            if(!process.env.IGNORE_LOCALELOGGER) {
              console.error("Error "+ response.statusCode, URL);
            }
          }
        }

        // We're not using async.map to place data into an array. Always call back without an error
        // so that every iterator can finish.
        done(null, null);
      });
    }
  };

  async.map(paths, iterator, function (err, results) {
    if (err) {
      console.log(err);
    } else {
      console.log(counter + ' GET requests made and ' + success + ' object added successfully');
    }
    callback(globalMap);
  });
};
