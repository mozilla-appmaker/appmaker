/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(
  ["designer/utils", "ceci/ceci-designer"],
  function(Util, Ceci) {
    "use strict";

    window.searchInObject = function (term, object, path, usedObjects) {
      path = path || '';
      usedObjects = usedObjects || [];
      try {
        Object.keys(object).forEach(function (key) {
          var subTree = object[key];
          if (typeof subTree === 'object') {
            if (usedObjects.indexOf(subTree) === -1) {
              usedObjects.push(subTree);
              searchInObject(term, subTree, path + '/' + key, usedObjects);
            }
          }
          else if (typeof subTree === 'string') {
            if (subTree.indexOf(term) > -1) {
              console.log('Found @ ' + path + '/' + key);
            }
          }
        });
      }
      catch (e) {
      }
    };

    window.unwrapObject = function (object, usedObjects) {
      var output = '{';
      usedObjects = usedObjects || [];
      try {
        Object.keys(object).forEach(function (key) {
          var subTree = object[key];
          if (typeof subTree === 'object') {
            if (usedObjects.indexOf(subTree) === -1) {
              usedObjects.push(subTree);
              output += key + ': ' + unwrapObject(subTree, usedObjects) + ',';
            }
          }
          else {
            output +=  key + ': ' + (typeof subTree === 'string' ? '"' + subTree + '"' : subTree) + ',';
          }
        });
      }
      catch (e) {
      }
      output += '}';
      return output;
    };

    var knownComponents = [];

    function addComponentsFromRegistry () {
      var trayComponentContainer = document.getElementById('components');

      Ceci.forEachComponent(function (name, component) {

        // Avoid adding components that are already in the tray
        if (trayComponentContainer.querySelector('designer-component-tray-item[name="' + name + '"]')) return;

        var item = document.createElement('designer-component-tray-item');
        var meta;

        // This part is ugly. Reach into CustomElements and pull out a <template>.

        var ceciDefinitionScript = Ceci.getCeciDefinitionScript(name);

        try {
          meta = JSON.parse(ceciDefinitionScript.innerHTML);
        }
        catch (e) {
          throw new TypeError("Ceci component, \"" + name + "\" is lacking ceci definitions. Likely it shouldn't be returned from ceci-designer.");
        }

        item.setAttribute('name', name);
        item.setAttribute('thumbnail', meta.thumbnail);
        item.setAttribute('label', Util.prettyName(name));

        item.setAttribute('description', meta.description);
        item.setAttribute('author', meta.author);
        item.setAttribute('updatedat', meta.updatedAt);

        item.addEventListener('click', function (e) {
          var card = document.querySelector('ceci-card[visible]');

          if (card) {
            var newElement = document.createElement(name);
            card.appendChild(newElement);
            window.dispatchEvent(new CustomEvent(
              'CeciElementAdded',
              {
                bubbles: true,
                detail: newElement
              }
            ));
          }
        }, false);

        trayComponentContainer.appendChild(item);
      });
    }

    // Load elements that might exist already, but also wait for WebComponentsReady in case
    // we load this module early.
    window.addEventListener('WebComponentsReady', addComponentsFromRegistry, false);
    addComponentsFromRegistry();
  }
);


