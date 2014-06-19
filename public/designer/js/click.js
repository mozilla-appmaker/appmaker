/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(
  ["jquery"],
  function($) {
    "use strict";
    $(window).click(function(e){
      this.dispatchEvent(new CustomEvent('designerClick', {bubbles: true, detail: e.target}));
    });
  }
);
