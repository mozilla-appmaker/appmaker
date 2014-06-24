/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(
  ["designer/utils", "ceci/ceci-designer", "l10n", "analytics"],
  function(Util, CeciDesigner, L10n, analytics) {
    "use strict";

    var resolvePath = function(tag, url) {
      try {
        return document.createElement(tag).resolvePath(url);
      }
      catch (e) {
        console.error('resolvePath failed for component ' + tag + '.');
        return url;
      }
    };

    var knownComponents = [];
    var tags = [];

    var categories = {
      "basic" : [
         "ceci-button",
         "ceci-counter",
         "ceci-image",
         "ceci-header",
         "ceci-metronome"
      ],
      "layout" : [
        "ceci-button",
        "ceci-button-with-confirmation",
        "ceci-double-button",
        "ceci-header",
        "ceci-image",
        "ceci-spacer",
        "ceci-textbox"
      ],
      "connectors" : [
        "ceci-transformer",
        "ceci-channel-gate",
        "ceci-alternating-gate",
        "ceci-splitter",
        "ceci-combiner"
      ],
      "audio" : [
        "ceci-audio",
        "ceci-cowbell",
        "ceci-snaredrum",
        "ceci-kickdrum",
        "ceci-metronome",
        "ceci-microphone-button",
        "ceci-sequencer"
      ],
      "logic" : [
        "ceci-bool",
        "ceci-counter",
        "ceci-daily-counter",
        "ceci-random"
      ],
      "media" : [
        "ceci-chart",
        "ceci-component-canvas",
        "ceci-camera-button",
        "ceci-chat-window",
        "ceci-fireworks",
        "ceci-hot-potato",
        "ceci-jazzhands",
        "ceci-meatspaces-messages",
        "ceci-meatspaces-input",
        "ceci-notebook",
        "ceci-pad-grid",
        "ceci-text-input",
        "ceci-todo-list"
      ]
    }

    categories.names = [];

    for (var key in categories) {
      if (categories.hasOwnProperty(key)) {
        categories.names.push(key);
      }
    }

    var DesignerTray = {
      buildItem : function(name){
        var item = document.createElement('designer-component-tray-item');
        var ceciDefinition = CeciDesigner.getCeciDefinitionScript(name);

        item.setAttribute('name', name);
        item.setAttribute('thumbnail', resolvePath(name, ceciDefinition.thumbnail));
        item.setAttribute('label', ceciDefinition.name || Util.prettyName(name));
        item.setAttribute('description', L10n.get(name + "/description") || ceciDefinition.description);
        item.setAttribute('author', ceciDefinition.author);
        item.setAttribute('updatedat', ceciDefinition.updatedAt);

        var bricktags = ceciDefinition.tags;

        for(var k = 0; k < bricktags.length; k++){
          var tag = bricktags[k];
          if(tags.indexOf(tag) == -1) {
            tags.push(tag);
          }
        }

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
        item.label = L10n.get(name) || item.label;
        return item;
      },
      addComponentWithName: function(name) {
        var added = false;
        for(var i = 0; i < categories.names.length; i++){
          var category = categories.names[i];
          var components = categories[category.toLowerCase()] || [];
          for(var j = 0; j < components.length; j++){
            if(name == components[j]){
              var item = DesignerTray.buildItem(name)
              var containerCount = document.querySelectorAll(".category-container." + category.toLowerCase()).length;
              if(containerCount == 0) {
                DesignerTray.buildCategory(category.toLowerCase());
              }
              document.querySelector(".category-container." + category.toLowerCase()).appendChild(item);
              added = true;
            }
          }
        }
        if(!added){
          var item = DesignerTray.buildItem(name)
          var containerCount = document.querySelectorAll(".category-container.other").length;
          if(containerCount == 0) {
            DesignerTray.buildCategory("other");
          }
          document.querySelector(".category-container.other").appendChild(item);
        }
      },
      sortComponents: function (container) {
        // Sorts components in each category container
        var containers = document.querySelectorAll('.category-container');
        for(var i = 0; i < containers.length; i++){
          var container = containers[i];
          var components = container.querySelectorAll('designer-component-tray-item').array();
          components = components.sort(function (a, b) {
            if (a.label > b.label) return 1;
            if (a.label < b.label) return -1;
            return 0;
          });
          components.forEach(function (c) {
            container.appendChild(c);
          });
        }
      },
      buildCategory : function(category){
        var that = this;

        if(category != "all") {
          //Build Category Container
          var container = document.createElement("div");
          var title = document.createElement("h2");
          title.innerHTML = category.charAt(0).toUpperCase() + category.slice(1) + " Bricks";
          container.appendChild(title);
          container.classList.add("category-container");
          container.classList.add(category.toLowerCase());
          document.querySelector("#components").appendChild(container);
        }

        //Build tag
        var tagContainer = document.querySelector(".brick-category");
        var option = document.createElement("a");
        if(category == "all") {
          option.innerHTML = "All Bricks"
        } else {
          option.innerHTML = category.charAt(0).toUpperCase() + category.slice(1);
        }

        option.setAttribute("data-category",category.toLowerCase());
        tagContainer.appendChild(option);

        option.addEventListener("click",function(e){
          that.filterCategory(e.target.getAttribute("data-category"));
        });
      },
      addComponentsFromRegistry: function() {
        DesignerTray.buildCategory("all");
        CeciDesigner.forEachComponent(this.addComponentWithName);
        DesignerTray.filterCategory("basic");
        DesignerTray.sortComponents();
      },
      filterCategory : function(category){
        var categoryLinks = document.querySelectorAll(".brick-category a");
        Array.prototype.forEach.call(categoryLinks, function(el, i){
          el.classList.remove("selected-category");
        });

        document.querySelector(".brick-category a[data-category="+category+"]").classList.add("selected-category");
        document.querySelector("#components").setAttribute("data-category",category);

        var categoryEls = document.querySelectorAll(".category-container");
        if(category == "all"){
          Array.prototype.forEach.call(categoryEls, function(el, i){
            el.style.display = "";
          });
        } else {
          Array.prototype.forEach.call(categoryEls, function(el, i){
            el.style.display = "none";
          });
          document.querySelector(".category-container." + category).style.display = "";
        }
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
      var categoryContainers = document.querySelectorAll(".category-container");
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

          Array.prototype.forEach.call(categoryContainers, function(el, i){
            if(el.querySelectorAll("designer-component-tray-item:not(.hide)").length == 0) {
              el.classList.add("no-results");
            } else {
              el.classList.remove("no-results");
            }
          });

        }
        else {
          Array.prototype.forEach.call(categoryContainers, function(el, i){
            el.classList.remove("no-results");
          });
          Array.prototype.forEach.call(componentsContainer.querySelectorAll('designer-component-tray-item'), function (e) {
            e.classList.remove('hide');
          });
        }
      });
    });

    return DesignerTray;
  }
);
