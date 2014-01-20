/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(
  ["designer/utils", "ceci/ceci-designer", "l10n"],
  function(Util, Ceci, L10n) {
    "use strict";

    var knownComponents = [];
    var DesignerTray = {
      addComponentWithName: function(name, component) {
        var componentTrayContainer = document.getElementById('components');
        var urlComponent = window.CustomElements.registry[name].prototype.resolvePath('locale/' + L10n.getCurrentLang() + '.json');
        L10n.ready({url: urlComponent});

        // Avoid adding components that are already in the tray
        if (componentTrayContainer.querySelector('designer-component-tray-item[name="' + name + '"]')) return;

        var item = document.createElement('designer-component-tray-item');
        var meta;

        // This part is ugly. Reach into CustomElements and pull out a <template>.
        var ceciDefinitionScript = Ceci.getCeciDefinitionScript(name);

        try {
          meta = JSON.parse(ceciDefinitionScript.innerHTML);
        }
        catch (e) {
          throw new TypeError("Ceci component, \"" + name + "\" is either lacking ceci definitions or has a JSON error. Likely it shouldn't be returned from ceci-designer.");
        }

        item.setAttribute('name', name);
        item.setAttribute('thumbnail', window.CustomElements.registry[name].prototype.resolvePath(meta.thumbnail));

        item.setAttribute('label', meta.name || Util.prettyName(name));

        item.setAttribute('description', meta.description);
        item.setAttribute('author', meta.author);
        item.setAttribute('updatedat', meta.updatedAt);

        item.addEventListener('click', function (e) {
          var card = document.querySelector('ceci-card[visible]');

          if (card) {
            var newElement = document.createElement(name);
            card.appendChild(newElement);
          }
        }, false);

        componentTrayContainer.appendChild(item);
        item.label = L10n.get(name) || item.label;
      },
      addComponentsFromRegistry: function() {
        Ceci.forEachComponent(function (name, component) {
          DesignerTray.addComponentWithName(name, component);
        });
      }
    }

    // Load elements that might exist already, but also wait for WebComponentsReady in case
    // we load this module early.
    window.addEventListener('WebComponentsReady', DesignerTray.addComponentsFromRegistry, false);
    DesignerTray.addComponentsFromRegistry();
    return DesignerTray;
  }
);


