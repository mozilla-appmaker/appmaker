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
      "basic": {
        "description": L10n.get("Start with simple bricks useful for almost every app."),
        "bricks": [
          "ceci-button",
          "ceci-counter",
          "ceci-image",
          "ceci-header",
          "ceci-textbox",
          "ceci-metronome"
        ]
      },
      "utility": {
        "description": L10n.get("Add more advanced utilities for your app."),
        "bricks": [
          "ceci-button",
          "ceci-button-with-confirmation",
          "ceci-double-button",
          "ceci-header",
          "ceci-image",
          "ceci-metronome",
          "ceci-spacer",
          "ceci-textbox",
          "ceci-text-input",
        ]
      },
      "connection": {
        "description": L10n.get("Create complex data-driven connections between bricks."),
        "bricks": [
          "ceci-transformer",
          "ceci-channel-gate",
          "ceci-alternating-gate",
          "ceci-splitter",
          "ceci-combiner",
          "ceci-bool"
        ]
      },
      "audio": {
        "description": L10n.get("Record and play sounds, listen to music, and more."),
        "bricks": [
          "ceci-audio",
          "ceci-cowbell",
          "ceci-snaredrum",
          "ceci-kickdrum",
          "ceci-metronome",
          "ceci-microphone-button",
          "ceci-sequencer"
        ]
      },
      "number": {
        "description": L10n.get("Count objects and manipulate numbers."),
        "bricks": [
          "ceci-counter",
          "ceci-daily-counter",
          "ceci-random"
        ]
      },
      "media": {
        "description": L10n.get("Draw, take pictures, and chart progress with these more interactive bricks."),
        "bricks": [
          "ceci-chart",
          "ceci-component-canvas",
          "ceci-camera-button",
          "ceci-notebook",
          "ceci-pad-grid",
          "ceci-todo-list"
        ]
      },
      "fun": {
        "description": L10n.get("Your app needs more cowbell."),
        "bricks": [
          "ceci-fireworks",
          "ceci-hot-potato",
          "ceci-jazzhands",
          "ceci-metronome",
          "ceci-cowbell",
          "ceci-snaredrum",
          "ceci-kickdrum",
        ]
      },
      "chat": {
        "description": L10n.get("Chat with friends using text and images."),
        "bricks": [
          "ceci-chat-window",
          "ceci-meatspaces-messages",
          "ceci-meatspaces-input"
        ]
      }
    }

    var categoryNames = [];

    for (var key in categories) {
      if (categories.hasOwnProperty(key)) {
        categoryNames.push(key);
      }
    }

    var DesignerTray = {
      buildItem : function(name){
        var item = document.createElement('designer-component-tray-item');
        var ceciDefinition = CeciDesigner.getCeciDefinitionScript(name);

        var label = ceciDefinition.name || Util.prettyName(name);
        item.setAttribute('name', name);
        item.setAttribute('thumbnail', resolvePath(name, ceciDefinition.thumbnail));
        item.setAttribute('label', label);
        item.setAttribute('description', L10n.get(name + "/description") || ceciDefinition.description || label);
        item.setAttribute('author', ceciDefinition.author);
        item.setAttribute('updatedat', ceciDefinition.updatedAt);

        var bricktags = ceciDefinition.tags;

        for(var k = 0; k < bricktags.length; k++){
          var tag = bricktags[k];
          if(tags.indexOf(tag) === -1) {
            tags.push(tag);
          }
        }

        item.addEventListener('ComponentAddRequested', function (e) {
          var card = document.querySelector('ceci-card[visible]');
          if (card) {
            var newElement = document.createElement(name);
            // wait until Polymer has prepared the element completely
            newElement.async(function() {
              card.appendChild(newElement);

              // Apply defaults here explicitly so that element doesn't
              // have to figure out whether or not it's new when it's
              // attached to the DOM.
              newElement.applyDefaults();
              analytics.event("Added Component", {label: name});
            });
          }
        }, false);
        item.label = L10n.get(name) || item.label;
        return item;
      },
      addComponentWithName: function(name) {
        if(!DesignerTray.isKnownComponent(name)) {
          var added = false;
          // See if it goes in any categories
          for(var i = 0; i < categoryNames.length; i++){
            var category = categoryNames[i].toLowerCase();

            var components = categories[category].bricks || [];
            for(var j = 0; j < components.length; j++){
              if(name === components[j]){
                var item = DesignerTray.buildItem(name);
                DesignerTray.showCategory(category);
                if (category === "basic") {
                  DesignerTray.filterCategory("basic");
                }
                document.querySelector(".category-container." + category).appendChild(item);
                added = true;
              }
            }
          }
          //Means it wasn't in any categories
          if(!added){
            var item = DesignerTray.buildItem(name);
            DesignerTray.showCategory("other");
            document.querySelector(".category-container.other").appendChild(item);
          }
          knownComponents.push(name);
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
      showCategory : function(category){
        var container = document.querySelector('.' + category.toLowerCase());
        var tag = document.querySelector('.brick-category a[data-category="'+ category.toLowerCase() + '"]');
        container.classList.remove("hidden");
        tag.classList.remove("hidden");
      },
      hideCategory : function(category){
        var container = document.querySelector('.' + category.toLowerCase());
        var tag = document.querySelector('.brick-category a[data-category="'+ category.toLowerCase() + '"]');
        container.classList.add("hidden");
        tag.classList.add("hidden");
        if (tag.classList.contains("selected-category")) {
          this.filterCategory("all");
        }
      },
      buildCategory : function(category){
        var categoryContainer = document.querySelector("[data-category="+category.toLowerCase()+"]");

        //Check if this category container exists already
        if(!categoryContainer) {
          var that = this;

          if(category !== "all") {
            //Build Category Container
            var container = document.createElement("div");
            container.classList.add("hidden");
            var title = document.createElement("h2");

            title.textContent = L10n.get(category.charAt(0).toUpperCase() + category.slice(1) + " Bricks");

            container.appendChild(title);

            if (categories[category]) {
              var description = document.createElement('div');
              description.classList.add('category-description');
              description.textContent = L10n.get(categories[category].description);
              container.appendChild(description);
            }

            container.classList.add("category-container");
            container.classList.add(category.toLowerCase());
            document.querySelector("#components").appendChild(container);
          }

          //Build tag
          var tagContainer = document.querySelector(".brick-category");
          var option = document.createElement("a");

          if(category === "all") {
            option.textContent = L10n.get("All Bricks");
          } else {
            option.classList.add("hidden");
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
          }

          option.setAttribute("data-category",category.toLowerCase());
          tagContainer.appendChild(option);

          option.addEventListener("click",function(e){
            document.querySelector('.component-search').value = "";
            doSearch();
            that.filterCategory(e.target.getAttribute("data-category"));
          });
        }
      },
      addComponentsFromRegistry: function() {
        DesignerTray.buildCategory("all");
        for (var i = 0; i < categoryNames.length; i++) {
          DesignerTray.buildCategory(categoryNames[i]);
        }
        DesignerTray.buildCategory("other");
        DesignerTray.filterCategory("all");
        CeciDesigner.forEachComponent(this.addComponentWithName);
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
        if(category === "all"){
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
          var parentNode = item.parentNode;
          parentNode.removeChild(item);
          if (parentNode.childNodes.length === 1) {
            var category = parentNode.className.replace("category-container", "").trim();
            this.hideCategory(category);
          }
        }
      }
    };

    function doSearch(searchValue) {
      var categoryContainers = document.querySelectorAll(".category-container");
      searchValue = searchValue || "";
      var componentsContainer = document.querySelector('#components');
      if (searchValue.length > 0) {
        DesignerTray.filterCategory("all");
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
          if(el.querySelectorAll("designer-component-tray-item:not(.hide)").length === 0) {
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
    }

    window.addEventListener("polymer-ready", function () {
      DesignerTray.addComponentsFromRegistry();
      var searchBox = document.querySelector('.component-search');
      searchBox.addEventListener('keyup', function() {
        doSearch(searchBox.value.trim().toLowerCase());
      });
    });

    return DesignerTray;
  }
);
