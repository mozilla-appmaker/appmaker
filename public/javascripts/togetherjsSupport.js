/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(
  ["togetherjs", "jquery"],
  function(TogetherJS, $) {
    "use strict";
    // This enables alt-T alt-T to turn on TowTruck:
    TogetherJS.config("enableShortcut", true);
    var receivedHtml = null;

    TogetherJS.hub.on("resync", function (msg) {
      if (! msg.sameUrl) {
        return;
      }
      receivedHtml = msg.html;
      $("#appmaker-app").html(msg.html);
    });

    TogetherJS.hub.on("togetherjs.hello", function (msg) {
      TogetherJS.send({
        type: "resync",
        html: $("#appmaker-app").html()
      });
    });
  },
  function(err){
    console.log("Error loading TogetherJS. Likely a network disconnect.");
  }
);
