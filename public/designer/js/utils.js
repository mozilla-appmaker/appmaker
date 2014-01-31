/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(['inflector'], function(Inflector) {
  return {
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


    // from http://jeffreifman.com/2006/06/26/how-can-i-get-query-string-values-from-url-in-javascript/
    // linked from http://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
    getQueryStringVariable: function (variable) {
      var query = window.location.search.substring(1);
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
          return decodeURIComponent(pair[1]);
        }
      }
      return null;
    }
  };
});
