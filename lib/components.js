/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var fs = require('fs');
var path = require('path');
var componentDir = process.env.COMPONENT_DIR;

var EXCLUDED_COMPONENTS = [];
if (process.env.EXCLUDED_COMPONENTS) {
  EXCLUDED_COMPONENTS = process.env.EXCLUDED_COMPONENTS.split(",");
}

function isComponentExcluded(componentDirName) {
  return EXCLUDED_COMPONENTS.indexOf(componentDirName) > -1;
}

// note that components must live in public/bundles -- this is non-negotiable.
function addLocalComponents() {
  components = fs.readdirSync(componentDir).filter(function(dirName) {
    return (dirName.indexOf("component-") > -1) && !isComponentExcluded(dirName);
  }).map(function(dirName) {
    return path.join(componentDir, dirName, 'component.html');
  }).filter(function(fileName) {
    return fs.existsSync(fileName);
  });
  return components;
}

module.exports = {
  load: function(callback) {
    var components = addLocalComponents();
    if(!!process.env.BUNDLE) {
      // simply automatically redo bundling at startup.
      require("./bundle-components");
    }
    console.log("Loaded " + components.length + " local components from ./public/bundles");
    callback(components);
  }
};
