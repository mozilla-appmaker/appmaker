/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(
  [
    "l10n", "inflector", "designer/utils", "ceci/ceci-designer", "tutorial/intro",

    // Unreferenced but loading:
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

    // making things easier for devs of all walks of life
    if(!NodeList.prototype.array) {
      NodeList.prototype.array = Array.prototype.slice;
    }

    function onPolymerReadyForIntro() {
      // make sure we have a ceci-app available
      var ceciApp = document.querySelector("ceci-app");
      if(!ceciApp) {
        return setTimeout(onPolymerReadyForIntro, 250);
      }
      var intro = new Intro();
      intro.start();
    }

    if (Utils.getQueryStringVariable('tutorial')) {
      if (window.Polymer && Polymer.whenPolymerReady) {
        Polymer.whenPolymerReady(onPolymerReadyForIntro);
      } else {
        window.addEventListener("polymer-ready", onPolymerReadyForIntro);
      }
    }
  }
);
