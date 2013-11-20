/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(
  ["jquery", "designer/utils"],
  function($, Util) {
    "use strict";

    var knownComponents = [];

    return {
      addComponents: function (components) {
        components.forEach(function (component) {
          if (knownComponents.indexOf(component.tag) === -1) {
            knownComponents.push(component.tag);

            var item = document.createElement('designer-component-tray-item');
            var meta = component.prototype.ceci;

            if (typeof meta === 'undefined'){
              throw new TypeError("Ceci component, \"" + tagName + "\" is lacking ceci definitions. Likely it shouldn't be returned from ceci-designer.");
            }

            item.setAttribute('name', component.tag);
            item.setAttribute('label', Util.prettyName(component.tag));

            item.setAttribute(meta.description);
            item.setAttribute(meta.author);
            item.setAttribute(meta.updatedAt);

            document.getElementById('components').appendChild(item);
          }
        });
      }
    };

  }
);


