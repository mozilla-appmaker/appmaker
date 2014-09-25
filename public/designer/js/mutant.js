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

// TODO: while this module does export something, it also has a lot of
// side effects. It is best practice for a module to not have any side
// effects when being required.

var Editable = require('./editable');
var CustomEvent = require('vendor/customevent');

// TODO: maybe explicitly require this instead of depending on global scope.
var Polymer = global.Polymer;

//When we show a new card, check to see if there was a selected element on it previously
//and select it if there was.
window.addEventListener('cardShown', function(){
  unselectElements();
  var lastSelected = document.querySelector("ceci-card[visible=true] .last-selected-on-page");
  if(lastSelected){
    selectElement(lastSelected);
  }
});

//If a click happens on the blank app space or on the gray canvas, we deselect all components.
window.addEventListener('designerClick', function(e){
  if(e.detail.classList.contains("container") || e.detail.classList.contains("phone-inner") || e.detail.classList.contains("phone-bottom") || e.detail.tagName === "CECI-APP" ){
    unselectElements();
  }
});

function selectElement(element){
  if (element.classList.contains("selected")) {
    window.dispatchEvent(new CustomEvent("change-tray-tab", { detail: { tab: "customize"}}));
    return;
  }
  unselectElements();
  element.classList.add('selected');

  //Change the last-selected on this page
  var thisCard = document.querySelector("ceci-card[visible=true]");
  var lastSelected = document.querySelector("ceci-card[visible=true] .last-selected-on-page");
  if(lastSelected){
    lastSelected.classList.remove("last-selected-on-page");
  }

  element.classList.add('last-selected-on-page');

  element.onready(function() {
    Editable.displayAttributes(element);
  });
}

function unselectElements(){
  Editable.clearAttributes();
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
    element.classList.remove("selected");
    selectElement(element);
  }
}

// For a special case in Chrome where elements are already in the DOM
// and don't fire CeciElementAdded

function onPolymerReady() {
  var ceciElements = document.querySelectorAll('ceci-card > *').array();
  ceciElements.forEach(function (e) {
    if (e.localName.indexOf('ceci-') === 0) {
      setupElement(e);
    }
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
});

window.addEventListener('CeciElementSelected', function(e){
  selectElement(e.detail);
});

window.addEventListener('CeciAppDOMReady', function(e){
  var brick = e.detail.querySelector(".selected.brick");
  if (!!brick) {
    brick.classList.remove("selected");
    selectElement(brick);
  }
});

window.addEventListener('CeciElementsSorted', function (e){
  var element = e.detail;
  if (!element) {
    return;
  }
  element.onready(function() {
    Editable.displayAttributes(element);
  });
});

module.exports = {
  selectElement: selectElement
};
