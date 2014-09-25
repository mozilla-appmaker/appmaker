/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// TODO: not a fan of doing this but having a god object with all of the
// dependent modules attached to it makes it easier to deal with polymer
// components that are using require.

var Designer = {
  Analytics: require('webmaker-analytics'),
  Application: require('./application'),
  CeciDesigner: require('../../ceci/ceci-designer'),
  Channels: require('./channels'),
  Click: require('./click'),
  Debugger: require('./debugger'),
  Editable: require('./editable'),
  Inflection: require('inflection'),
  jQuery: require('jquery'),
  Keyboard: require('./keyboard'),
  L10n: require('vendor/l10n'),
  Modes: require('./modes'),
  Mutant: require('./mutant'),
  UserState: require('./userstate'),
  Utils: require('./utils'),
};

// making things easier for devs of all walks of life
if(!NodeList.prototype.array) {
  NodeList.prototype.array = Array.prototype.slice;
}

// TODO: fix tutorial/intro. It is using a special type of "text" require that
// I don't know how to deal with right now

// function onPolymerReadyForIntro() {
//   // make sure we have a ceci-app available
//   var ceciApp = document.querySelector("ceci-app");
//   if(!ceciApp) {
//     return setTimeout(onPolymerReadyForIntro, 250);
//   }
//   var intro = new Intro();
//   intro.start();
// }

// if (Designer.Utils.getQueryStringVariable('tutorial')) {
//   if (window.Polymer && Polymer.whenPolymerReady) {
//     Polymer.whenPolymerReady(onPolymerReadyForIntro);
//   } else {
//     window.addEventListener("polymer-ready", onPolymerReadyForIntro);
//   }
// }

global.Designer = Designer;
