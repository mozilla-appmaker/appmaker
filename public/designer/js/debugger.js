/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// TODO: this file is required just for side effects which is not
// ideal. Should export function/group of functions to make testable.

var lastHash = null;
var debugging = false;
var debugPrefix = 'debug=';

var script;

var nativeConsoleFunctions = {
  log: console.log,
  debug: console.debug,
  warn: console.warn,
  info: console.info,
  dir: console.dir,
  error: console.error,
  echo: console.echo
};

var nativeConsole = console;

function startDebugging(hash) {
  script = document.createElement('script');
  script.src = 'http://jsconsole.com/remote.js?' + hash;
  script.onload = function (e) {

    // Split console output across remote && local.
    // Local first so that remote can safely explode when objects are too complex.
    Object.keys(nativeConsoleFunctions).forEach(function (k){
      var newConsoleFunction = console[k];
      console[k] = function () {
        nativeConsoleFunctions[k].apply(nativeConsole, arguments);
        try {
          newConsoleFunction.apply(console, arguments);
        }
        catch (e) {
          nativeConsoleFunctions.error.call(nativeConsole, 'REMOTE CONSOLE ERROR: Failed to send data. Too complex.');
          newConsoleFunction.call(console, 'CONSOLE ERROR: Failed to send data. Too complex.');
        }
      };
    });
  };
  document.head.appendChild(script);
}

function removeDebugger() {
  if (script) {
    document.head.removeChild(script);
    Object.keys(nativeConsoleFunctions).forEach(function (k){
      console[k] = nativeConsoleFunctions[k];
    });
    script = null;
  }
}

setInterval(function () {
  var hash = window.location.hash.substring(1);
  if (hash !== lastHash) {
    if (debugging) {
      removeDebugger();
    }
    if (hash.indexOf(debugPrefix) === 0) {
      startDebugging(hash.substring(debugPrefix.length));
    }
  }
  lastHash = hash;
}, 50);
