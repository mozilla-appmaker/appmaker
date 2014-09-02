var fs = require('fs');
var path = require('path');

module.exports = function (components, locales, callback) {
  var success = 0,
      failed = 0,
      globalMap = {};

  // preallocate the global locale mapping object
  locales.forEach(function (locale) {
    globalMap[locale] = {};
  });

  // rule out anything that isn't in the bundles directory
  components.filter(function(component) {
    return (component.indexOf("bundles") > -1);
  })

  // for each known locale, try to find a matching localisation file and do a global aggregate
  .forEach(function(component) {
    locales.forEach(function (locale) {
      var localise = component.replace('component.html', path.join("locale", locale + '.json'));
      if (fs.existsSync(localise)) {
        var data = fs.readFileSync(localise,"utf-8");
        if (data) {
          try {
            var parsed = JSON.parse(data);
            Object.keys(parsed).forEach(function(key) {
              globalMap[locale][key] = parsed[key];
            });
            success++;
          } catch(e) {
            console.warn("could not parse locale strings from "+localise);
            failed++;
          }
        }
      }
    });
  });

  console.log("Created locale mapping from "+success+" locale files, with "+failed+" failures.");
  callback(globalMap);
};
