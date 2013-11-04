/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(
  ["jquery", "persona"],
  function($) {
    "use strict";

    var buttons = {
      login: $(".persona .login"),
      logout: $(".persona .logout"),
      account: $(".persona .account")
    };

    navigator.id.watch({
      onlogin: function(assertion) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/persona/verify", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.addEventListener("loadend", function(e) {
          var data = JSON.parse(this.responseText);
          if (data && data.status === "okay") {
            console.log("You have been logged in as: " + data.email);
            buttons.login.hide();
            buttons.logout.show();
            buttons.account.find('span').text(data.email);
            buttons.account.show();
          }
        }, false);

        xhr.send(JSON.stringify({
          assertion: assertion
        }));
      },
      onlogout: function() {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/persona/logout", true);
        xhr.addEventListener("loadend", function(e) {
          console.log("You have been logged out");
          buttons.login.show();
          buttons.logout.hide();
          buttons.account.find('span').text('');
          buttons.account.hide();
        });
        xhr.send();
      }
    });

    $(function(){
      buttons.login.click(function() {
        navigator.id.request();
      });

      buttons.logout.click(function() {
        navigator.id.logout();
      });
    });
  }
);
