/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(
  ["designer/utils", "ceci/ceci-designer"],
  function(Util, Ceci) {
    "use strict";

    var knownComponents = [];


    window.addEventListener('WebComponentsReady', function(e) {
      Ceci.forEachComponent(function(name, component){
        var item = document.createElement('designer-component-tray-item');
        var meta = component.prototype.ceci;

        if (typeof meta === 'undefined'){
          throw new TypeError("Ceci component, \"" + name + "\" is lacking ceci definitions. Likely it shouldn't be returned from ceci-designer.");
        }

        item.setAttribute('name', name);
        item.setAttribute('label', Util.prettyName(name));

        item.setAttribute(meta.description);
        item.setAttribute(meta.author);
        item.setAttribute(meta.updatedAt);

        document.getElementById('components').appendChild(item);
      });
    });
  }
);


