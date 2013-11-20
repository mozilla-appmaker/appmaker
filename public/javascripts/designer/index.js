/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(
  [
    "localized", "inflector", "designer/utils", "ceci/ceci-designer", "designer/component-tray",

    // Unreferenced:
    "designer/channels",
    "designer/editable",
    "designer/keyboard",
    "jquery-ui",
  ],
  function(localized, Inflector, Utils, ceci_designer, component_tray) {
    "use strict";

    component_tray.addComponents(ceci_designer.getRegisteredComponents());

    // just in case this happens after require is ready
    window.addEventListener('WebComponentsReady', function(e) {
      component_tray.addComponents(ceci_designer.getRegisteredComponents());
    }, false);
  }
);
