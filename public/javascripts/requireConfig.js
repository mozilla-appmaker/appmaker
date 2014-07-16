/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

requirejs.config({
  baseUrl: "/javascripts/",
  paths: {
    "text": "../vendor/requirejs-text/text",

    "inflector": "../vendor/inflection-js/inflection.min",

    "jquery": "../vendor/jquery/jquery.min",

    "l10n": "l10n",

    "jquery-ui": "../vendor/jquery-ui/ui/minified/jquery-ui.min",

    "persona": "https://login.persona.org/include",

    "ceci": "../ceci",

    "designer": "../designer/js",

    "tutorial": "../tutorial",

    'analytics': '../vendor/webmaker-analytics/analytics',

    "colorpicker.core": "../vendor/colorpicker/jquery.colorpicker",
    "colorpicker.swatches.crayola": "../vendor/colorpicker/swatches/jquery.ui.colorpicker-crayola",
    "colorpicker.swatches.pantone": "../vendor/colorpicker/swatches/jquery.ui.colorpicker-pantone",
    "colorpicker.swatches.ral-classic": "../vendor/colorpicker/swatches/jquery.ui.colorpicker-ral-classic",
    "colorpicker.parts.memory": "../vendor/colorpicker/parts/jquery.ui.colorpicker-memory",
    "colorpicker.parts.rgbslider": "../vendor/colorpicker/parts/jquery.ui.colorpicker-rgbslider",
    "colorpicker.parsers.rgbslider": "../vendor/colorpicker/parsers/jquery.ui.colorpicker-cmyk-parser",
    "colorpicker.parsers.cmyk-parser": "../vendor/colorpicker/parsers/jquery.ui.colorpicker-cmyk-percentage-parser",
    "colorpicker.i18n.de": "../vendor/colorpicker/i18n/jquery.ui.colorpicker-de",
    "colorpicker.i18n.en": "../vendor/colorpicker/i18n/jquery.ui.colorpicker-en",
    "colorpicker.i18n.fr": "../vendor/colorpicker/i18n/jquery.ui.colorpicker-fr",
    "colorpicker.i18n.nl": "../vendor/colorpicker/i18n/jquery.ui.colorpicker-nl",
    "colorpicker.i18n.pt-br": "../vendor/colorpicker/i18n/jquery.ui.colorpicker-pt-br",
    "Firebase": "https://cdn.firebase.com/v0/firebase",

    "webmaker-auth-client": "../vendor/webmaker-auth-client/dist/webmaker-auth-client.min",

    "selectize": "../vendor/selectize/dist/js/standalone/selectize.min"
  },
  shim: {
    "jquery-ui": {
      exports: "$",
      deps: ['jquery']
    },
    "colorpicker.core": ["jquery-ui"],
    "colorpicker.swatches.crayola": ["colorpicker.core"],
    "colorpicker.swatches.pantone": ["colorpicker.core"],
    "colorpicker.swatches.ral-classic": ["colorpicker.core"],
    "colorpicker.parts.memory": ["colorpicker.core"],
    "colorpicker.parts.rgbslider": ["colorpicker.core"],
    "colorpicker.parsers.rgbslider": ["colorpicker.core"],
    "colorpicker.parsers.cmyk-parser": ["colorpicker.core"],
    "colorpicker.i18n.de": ["colorpicker.core"],
    "colorpicker.i18n.en": ["colorpicker.core"],
    "colorpicker.i18n.fr": ["colorpicker.core"],
    "colorpicker.i18n.nl": ["colorpicker.core"],
    "colorpicker.i18n.pt-br": ["colorpicker.core"]
  }
});
