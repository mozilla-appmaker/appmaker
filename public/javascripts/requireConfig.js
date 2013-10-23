/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

requirejs.config({
  "baseUrl": "/vendor/",
  "paths": {
    "inflector": "inflection-js/inflection.min",
    "jquery": "jquery/jquery.min",
    "ceci": "ceci/ceci",
    "ceci-ui": "ceci/ceci-ui",
    "ceci-cards": "ceci/ceci-cards",
    "ceci-app": "ceci/ceci-app",
    "ceci-utils": "ceci/ceci-utils",
    "jquery-ui": "jquery-ui/ui/minified/jquery-ui.min",
    "togetherjs": "https://togetherjs.com/togetherjs",
    "togetherjsSupport": "/javascripts/togetherjsSupport",
    "angular": "angular/angular.min",
    "designer-keyboard": "/javascripts/designer-keyboard",
    "persona": "https://login.persona.org/include"
  },
  shim: {
    "jquery-ui": {
      exports: "$",
      deps: ['jquery']
    },
    "togetherjs": {
      exports: "TogetherJS"
    }
  }
});

requirejs(["/javascripts/application.js"]);
