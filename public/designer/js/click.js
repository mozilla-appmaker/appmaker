/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// TODO: don't rely on side-effects, convert to function that gets
// exported so we can test this jam.

var $ = require('vendor/jquery');
var CustomEvent = require('vendor/customevent');

$(window).click(function(e){
  this.dispatchEvent(new CustomEvent('designerClick', {
    bubbles: true,
    detail: e.target
  }));
});
