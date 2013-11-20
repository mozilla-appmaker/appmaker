/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(
  ["/ceci/ceci-designer.js"],
  function(Ceci) {
    "use strict";

    Ceci.addChannels([
      {id: 'blue',   name: 'Blue Moon',          hex: '#358CCE'},
      {id: 'red',    name: 'Red Baloon',         hex: '#e81e1e'},
      {id: 'pink',   name: 'Pink Heart',         hex: '#e3197b'},
      {id: 'purple', name: 'Purple Horseshoe',   hex: '#9f27cf'},
      {id: 'green',  name: 'Green Clover',       hex: '#71b806'},
      {id: 'yellow', name: 'Yellow Pot of Gold', hex: '#e8d71e'},
      {id: 'orange', name: 'Orange Star',        hex: '#ff7b00'},
      {id: null,     name: 'Disabled',           hex: '#444'},
    ]);

  }
);
