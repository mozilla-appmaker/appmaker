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
      var name = window.prompt("What do you want to call this app?");
      var html = document.querySelector('ceci-app').innerHTML;
      if(name){
        $.ajax('/api/save_app', {
          data: {
            html: html,
            name: name
          },
          type: 'post',
          success: function (data) {
            console.log("saved app successfully");
            try {
              document.querySelector('user-state').refreshUserState();
            } catch (e) {
              console.log(e);
            }
          },
          error: function (data) {
            alert('Error while saving app: ' + JSON.stringify(data));
            console.error('Error while saving app:', data);
          }
        });
      } else {
        console.log("Please name your app.");
      }
    });

    function openApp(appName){
      console.log("loading an app called", appName);
    }
  }
);
