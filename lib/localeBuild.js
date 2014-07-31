var async = require('async');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

module.exports = function (components, locales, callback) {
  var globalMap = {};
  var paths = [];
  var counter = 0;
  var success = 0;

  // actual component based on where in the FS it is?
  components.forEach(function (component) {
    var componentMatch = (component.indexOf("bundles") > -1);
    locales.forEach(function (locale) {
      globalMap[locale] = {};
      if (componentMatch) {
        paths.push([component, locale]);
      }
    });
  });

  // Find a component's locale/lang.json file, and bundle it into
  // the global locale string mapping object for that locale so we
  // can serve that as a single bundled resource.
  function iterator(where, done) {
  	counter++;
    var options = {};
    var component = where[0];
    var locale = where[1];
    if (component) {
      var componentPath = component.replace('component.html', path.join("locale", locale + '.json'));
      componentPath = path.join("public", componentPath);
      fs.exists(componentPath, function (result) {
        if (result) {
          fs.readFile(componentPath, 'utf8', function (err, localeData) {
            try {
              _.extend(globalMap[locale], JSON.parse(localeData));
              success++;
            } catch (e) {
              console.error(e);
            }
            done(null, null);
          });
        }
        else {
          done(null, null);
        }
      });

    }
  };

  async.map(paths, iterator, function (err, results) {
    if (err) {
      console.log(err);
    } else {
      console.log(counter + ' locale files requested and ' + success + ' object added successfully');
    }
    callback(globalMap);
  });
};
