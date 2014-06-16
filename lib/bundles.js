/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var fs = require('fs');
var path = require('path');
var expressBundles = require('express-bundles');

var PUBLIC = path.join(__dirname, '..', 'public');


var ceci = fs.readdirSync(path.join(PUBLIC, "ceci")).filter(function(filename) {
  return /^ceci-.*?\.html$/.test(filename);
}).map(function(filename){
  return 'ceci/' + filename;
});

// ceci.push("http://mozilla-appmaker.github.io/component-metronome/component.html");

var ceciBase = ceci.slice(0);

// Remove elements that the designer will substitute
ceciBase.splice(ceciBase.indexOf('ceci/ceci-card.html'), 1);
ceciBase.splice(ceciBase.indexOf('ceci/ceci-element.html'), 1);

// var designerComponents = fs.readdirSync(path.join(PUBLIC, "designer", "components")).filter(function(filename) {
//   return /\.html$/.test(filename);
// });

// Need to list these explicitly so they load in the right order (Polymer HTMLImports heirarchy problem).
var designerComponents = [
  'ceci-card-designer.html',
  'ceci-channel-menu.html',
  'ceci-channel-vis.html',
  'ceci-broadcast-vis.html',
  'ceci-listen-vis.html',
  'ceci-element-designer.html',
  'designer-component-tray-item.html',
  'user-state.html',
  'ceci-channel-map.html',
  'data-manager.html',
  'project-settings.html'
];

designerComponents = designerComponents.map(function(filename){
  return 'designer/components/' + filename;
});

try{
  // Delete files from last server run
  fs.unlinkSync(path.join(PUBLIC, "ceci.html"));
  fs.unlinkSync(path.join(PUBLIC, "designer-components.html"));
}
catch(x){}

module.exports = {
  configure: function(app){
    app.use(expressBundles.middleware({
      env: !!process.env.BUNDLE ? 'production' : 'development',
      src: path.join(__dirname, '..', 'public'),
      bundles: {
        'ceci.html': ceci,
        'designer-components.html': ceciBase.concat(designerComponents),
      },
      attachTo: app.locals
    }));
  }
}


