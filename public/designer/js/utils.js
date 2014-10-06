/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var Inflector = require('inflection');
var qs = require('querystring');

module.exports = {
  hexToRgb: function(hex, opacity){
    hex = hex.replace('#', '');
    if (hex.length == 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    return "rgba(" +
      [
        parseInt(hex.substring(0, 2), 16),
        parseInt(hex.substring(2, 4), 16),
        parseInt(hex.substring(4, 6), 16),
        opacity / 100
      ].join(',') +
      ")";
  },

  prettyName: function(name){
    name = name.replace('ceci-', '');
    return Inflector.titleize(name);
  },


  getQueryStringVariable: function (variable, query) {
    query = query || window.location.search.substring(1);
    return qs.decode(query)[variable];
  }
};
