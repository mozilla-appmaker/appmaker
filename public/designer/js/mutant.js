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

    function selectElement(element){

      if (element.classList.contains("selected")) {
        return;
      }

      unselectElements();

      element.classList.add('selected');

      element.onready(function() {
        Editable.displayAttributes(element);
      });

    }

    function unselectElements(){
      var selectedElement = document.querySelector(".brick.selected");
      if (selectedElement){
        selectedElement.classList.remove('selected');
      }
    }

    function setupElement(element) {
      if (!element) {
        return;
      }
      element.addEventListener('mousedown', function (e) {
        selectElement(element);
      });
      if (element.classList.contains("selected")) {
        element.onready(function() {
          Editable.displayAttributes(element);
        });
      }
    }

    // For a special case in Chrome where elements are already in the DOM
    // and don't fire CeciElementAdded

    function onPolymerReady() {
      var cards = document.querySelectorAll('ceci-card');
      Array.prototype.forEach.call(cards, function (card) {
        Array.prototype.forEach.call(card.childNodes, function (child) {
          if (child.localName.indexOf('ceci-') === 0) {
            setupElement(child);
          }
        });
      });
    }

    if (window.Polymer && Polymer.whenPolymerReady) {
      Polymer.whenPolymerReady(onPolymerReady);
    } else {
      window.addEventListener("polymer-ready", onPolymerReady);
    }

    // Add click handler to new elements
    window.addEventListener('CeciElementAdded', function(e){
      setupElement(e.detail);
    }, false);

    window.addEventListener('CeciElementsSorted', function (e) {
      var element = e.detail;
      if (!element) {
        return;
      }
      element.onready(function() {
        Editable.displayAttributes(element);
      });
    });

    return {
      selectElement: selectElement
    };
  }
);

