/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([], function() {
  "use strict";

  var BUILT_IN = [
    "polymer-element",
    "ceci-app",
    "ceci-broadcast",
    "ceci-card",
    "ceci-element",
    "ceci-listen"
  ];

  return {
    getRegisteredComponents: function(){
      var components = [];
      for (var tagName in window.CustomElements.registry){
        if (BUILT_IN.indexOf(tagName) === -1){
          components.push(window.CustomElements.registry[tagName]);
        }
      }
      return components;
    }
  };
});
