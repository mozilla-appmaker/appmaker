/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(
  ["jquery"],
  function($) {
    "use strict";

    $(window).keydown(function(e) {
      // Meta key shortcuts:
      if (e.metaKey) {
        switch(e.keyCode){
          case 186: // meta + ;
            $('input.component-search').val('').focus();
            break;
          case 191: // meta + / (shortcut help)
            $('input.component-search').val('').focus();
            break;
        }
      }
    });
  }
);

