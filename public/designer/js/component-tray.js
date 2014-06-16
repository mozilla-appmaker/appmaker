/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(
  ["designer/utils", "ceci/ceci-designer", "l10n", "analytics"],
  function(Util, CeciDesigner, L10n, analytics) {
    "use strict";

    var resolvePath = function(tag, url) {
      return document.createElement(tag).resolvePath(url);
    };

    var knownComponents = [];

    var DesignerTray = {
      addComponentWithName: function(name) {
        var componentTrayContainer = document.getElementById('components');

        // Avoid adding components that are already in the tray
        if(knownComponents.indexOf(name) > -1) return;

        var item = document.createElement('designer-component-tray-item');
        var ceciDefinition = CeciDesigner.getCeciDefinitionScript(name);

        item.setAttribute('name', name);
        item.setAttribute('thumbnail', resolvePath(name, ceciDefinition.thumbnail));
        item.setAttribute('label', ceciDefinition.name || Util.prettyName(name));
        item.setAttribute('description', L10n.get(name + "/description") || ceciDefinition.description);
        item.setAttribute('author', ceciDefinition.author);
        item.setAttribute('updatedat', ceciDefinition.updatedAt);

        item.addEventListener('click', function (e) {
          var card = document.querySelector('ceci-card[visible]');

          if (card) {
            var newElement = document.createElement(name);

            // wait until Polymer has prepared the element completely
            newElement.async(function() {
              newElement.applyDefaults();
              card.appendChild(newElement);
              analytics.event("Added Component", {label: name});
            });
          }
        }, false);

        knownComponents.push(name);
        componentTrayContainer.appendChild(item);
        item.label = L10n.get(name) || item.label;
      },
      sortComponents: function () {
        var container = document.querySelector('#components');
        var components = container.querySelectorAll('designer-component-tray-item').array();

        components = components.sort(function (a, b) {
          if (a.label > b.label) return 1;
          if (a.label < b.label) return -1;
          return 0;
        });

        components.forEach(function (c) {
          container.appendChild(c);
        });
      },
      addComponentsFromRegistry: function() {
        CeciDesigner.forEachComponent(this.addComponentWithName);
        DesignerTray.sortComponents();
      },
      isKnownComponent: function(name) {
        return knownComponents.indexOf(name) > -1;
      },
      forgetComponent: function(name) {
        var pos = knownComponents.indexOf(name);
        if (pos > -1) {
          knownComponents.splice(pos, 1);
          var componentTrayContainer = document.getElementById('components');
          var item = componentTrayContainer.querySelector("[name='" + name + "']");
          item.parentNode.removeChild(item);
        }
      }
    };

    window.addEventListener("polymer-ready", function () {
      DesignerTray.addComponentsFromRegistry();

      var searchBox = document.querySelector('.component-search');
      searchBox.addEventListener('keyup', function (e) {
        var searchValue = searchBox.value.trim().toLowerCase();
        var componentsContainer = document.querySelector('#components');

        if (searchValue.length > 0) {
          CeciDesigner.forEachComponent(function (componentTag) {
            var menuElement = componentsContainer.querySelector('designer-component-tray-item[name="' + componentTag + '"]');

            if (window.CeciDefinitions[componentTag] && menuElement) {
              var tags = window.CeciDefinitions[componentTag].tags || [];
              var found = false;

              var stringsToSearch = typeof tags === 'string' ? [tags] : tags;
              stringsToSearch.push(componentTag.toLowerCase());
              window.CeciDefinitions[componentTag].name && stringsToSearch.push(window.CeciDefinitions[componentTag].name.toLowerCase());
              window.CeciDefinitions[componentTag].description && stringsToSearch.push(window.CeciDefinitions[componentTag].description.toLowerCase());

              stringsToSearch.forEach(function (string) {
                found = found || string.toLowerCase().indexOf(searchValue) > -1;
              });

              if (!found) {
                menuElement.classList.add('hide');
              }
              else {
                menuElement.classList.remove('hide');
              }
            }
          });
        }
        else {
          Array.prototype.forEach.call(componentsContainer.querySelectorAll('designer-component-tray-item'), function (e) {
            e.classList.remove('hide');
          });
        }
      });
    });

    return DesignerTray;
  }
);


