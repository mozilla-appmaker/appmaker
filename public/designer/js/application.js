/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(["jquery"], function($) {
    return {
      loadAppByName: function(name) {
        $.ajax('/api/app', {
          data: {
            name: name
          },
          type: 'get',
          success: function (data) {
            var app = document.querySelector('ceci-app');
            app.innerHTML = data.html;
          },
          error: function (data) {
            alert('Error while loading app: ' + data);
            console.error('Error while loading app:');
            console.error(data);
          }
        });
      },
      deleteAppByName: function(name, callback){
        $.ajax('/api/delete_app', {
          data: {
            name: name
          },
          type: 'delete',
          success: function (data) {
            callback();
          },
          error: function (data) {
            console.log("Something went wrong!");
            console.error("Error while deleting app: " + data);
          }
        });
      }

    };
  }
);
