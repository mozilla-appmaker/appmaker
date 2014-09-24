/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// TODO: Don't depend on TogetherJS attachment to the global object,
// explicitly require it.
var TogetherJS = global.TogetherJS;

module.exports = {
  init: function (userState) {
    TogetherJS.on('ready', function () {
      userState.collaborating = true;
      TogetherJS.send({type: 'connected'});
    });

    TogetherJS.hub.on('connected', function (e) {
      TogetherJS.send({type: 'sync', app: document.querySelector('ceci-app').innerHTML});
    });

    TogetherJS.hub.on('sync', function (e) {
      document.querySelector('ceci-app').innerHTML = e.app;
    });

    TogetherJS.on('close', function () {
      userState.collaborating = false;
    });
  }
};
