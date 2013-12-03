/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.

This handles...
- Saving, publishing, loading apps for a logged in user.
*/

define(
  ["jquery"],function($) {
    "use strict";

    $('.new').click(function() {
      // clearSelection();
      var log = document.querySelector("design-log");
      log.clear();
      var app = document.querySelector("ceci-app");
      var parent = app.parentNode;
      parent.removeChild(app);
      parent.appendChild(document.createElement('ceci-app'));
    });

    $('.save').click(function() {
      console.log("SAVING");
      var name = window.prompt("What do you want to call this app?");
      var html = document.querySelector('ceci-app').innerHTML;
      $.ajax('/api/save_app', {
        data: {
          html: html,
          name: name
        },
        type: 'post',
        success: function (data) {
          alert('success');
        },
        error: function (data) {
          alert(String(data));
          console.error('Error while saving app:');
          console.error(data);
        }
      });
    });

    function openApp(appName){
      console.log("loading an app called", appName);
    }
  }
);
