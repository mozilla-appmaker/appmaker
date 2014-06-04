/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(
  ["jquery"],
  function($) {
    "use strict";

    $(window).keydown(function(e) {
      switch (e.keyCode){
        case 8: // Backspace
          // Disable backspace if we're not in an input or textarea
          // Where else could we be editing?
          if (!$(e.target).is("input, textarea")) {
            e.preventDefault();
            console.log('Backspace disabled in keyboard.js');
          }
      }

      // Meta key shortcuts:
      if (e.metaKey) {
        switch (e.keyCode){
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
