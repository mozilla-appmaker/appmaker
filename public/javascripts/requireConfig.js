/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

requirejs.config({
  baseUrl: "/javascripts/",
  paths: {
    "inflector": "/vendor/inflection-js/inflection.min",

    "jquery": "/vendor/jquery/jquery.min",

    "localized": "/vendor/webmaker-i18n/localized",

    "jquery-ui": "/vendor/jquery-ui/ui/minified/jquery-ui.min",

    "persona": "https://login.persona.org/include",

    "ceci": "/ceci",

    "togetherjs": "https://togetherjs.com/togetherjs-min",

    "angular": "/vendor/angular/angular.min",

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

requirejs(["application"]);
requirejs(["/javascripts/togetherjsSupport.js"]);
