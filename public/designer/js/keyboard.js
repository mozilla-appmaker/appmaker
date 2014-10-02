/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// TODO: I'm a little uncomfortable with this file being required
// exclusively for it's side effects -- beyond just feeling wrong to me,
// testing is harder. If reasonable, we should export a function that
// takes an element and attaches the event handler.

var $ = require('vendor/jquery');

require('domready')(function () {
  $(window).keydown(function(e) {
    switch (e.keyCode){
     case 8: // Backspace
      // Disable backspace if the target ends at the window
      if ($(e.target).is('body')) {
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
});
