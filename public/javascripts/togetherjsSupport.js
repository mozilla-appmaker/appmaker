/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(
  ["togetherjs"],
  function(TogetherJS) {
    "use strict";
    // This enables alt-T alt-T to turn on TowTruck:
    TogetherJS.config("enableShortcut", true);
  }
);
