/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * Here we handle all ceci-app/** dom manipulations by the user.
 * Actions include:
 *
 *  [x] Selecting a component
 *  [x] Highlights the component
 *  [x] Tells editables to load the component
 *  [ ] Duplicating a Component
 *  [ ] Sorting components within an app
 *  [ ] Deleting a Component
 *  [ ] Moving component to another card
 *
 */

define(
  ["designer/editable"],
  function(Editable) {
    "use strict";

    var selectedElement = null;

    function selectElement(element){
      if (selectedElement){
        selectedElement.classList.remove('selected');
      }
      selectedElement = element;
      element.classList.add('selected');
      Editable.displayAttributes(element);
    }

    // Add click handler to new elements
    window.addEventListener('CeciElementAdded', function(e){
      var element = e.detail;

      element.addEventListener('click', function(e){
        selectElement(element);
      });

      selectElement(element);
    }, false);

    window.addEventListener('CeciElementsSorted', function (e) {
      selectElement(e.detail);
    });

    window.addEventListener('SelectElement', function (e) {
      selectElement(e.detail);
    });

    return {
      selectElement: selectElement
    };
  }
);

