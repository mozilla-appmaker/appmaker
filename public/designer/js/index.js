/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(
  [
    "l10n", "inflector", "designer/utils", "ceci/ceci-designer", "tutorial/intro",

    // Unreferenced:
    "designer/component-tray",
    "designer/mutant",
    "designer/channels",
    "designer/editable",
    "designer/keyboard",
    "designer/click",
    "designer/modes",
    "designer/userstate",
    "designer/debugger",
    "jquery-ui"
  ],
  function(l10n, Inflector, Utils, Ceci, Intro) {
    "use strict";

    if (Utils.getQueryStringVariable('tutorial')) {
      Polymer.whenPolymerReady(function () {
        var intro = new Intro();
        intro.start();
      });
    }
  }
);
