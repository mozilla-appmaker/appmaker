/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

requirejs.config({
    "baseUrl": "/vendor/",
    "paths": {
      "jquery": "jquery/jquery.min",
      "ceci": "ceci/ceci",
      "ceci-ui": "ceci/ceci-ui",
      "jquery-ui": "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min",
      "angular": "angular/angular.min"
    },
    shim: {
      "jquery-ui": {
        exports: "$",
        deps: ['jquery']
      }
    } 
});

requirejs(["/javascripts/application.js"]);
