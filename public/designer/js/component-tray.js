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
        "description": L10n.get("Simple bricks useful for almost every app."),
        "bricks": [
          "ceci-button",
          "ceci-counter",
          "ceci-image",
          "ceci-spacer",
          "ceci-header",
          "ceci-textbox",
          "ceci-menu",
          "ceci-metronome"
        ]
      },
      "utility": {
        "description": L10n.get("Add more advanced utilities to your app."),
        "bricks": [
          "ceci-button-with-confirmation",
          "ceci-double-button",
          "ceci-dataarray",
          "ceci-list",
          "ceci-todo-list",
          "ceci-text-input",
          "ceci-timer",
          "ceci-stopwatch",
          "ceci-page-navigation"
        ]
      },
      "connection": {
        "description": L10n.get("Create complex connections between bricks."),
        "bricks": [
          "ceci-transformer",
          "ceci-channel-gate",
          "ceci-alternating-gate",
          "ceci-splitter",
          "ceci-combiner",
          "ceci-bool",
          "ceci-boolean-gate"
        ]
      },
      "number": {
        "description": L10n.get("Count and manipulate numbers."),
        "bricks": [
          "ceci-counter",
          "ceci-daily-counter",
          "ceci-random",
          "ceci-chart"
        ]
      },
      "media": {
        "description": L10n.get("Draw, take pictures, and chart progress with these more interactive bricks."),
        "bricks": [
          "ceci-component-canvas",
          "ceci-camera-button",
          "ceci-notebook",
          "ceci-image",
          "ceci-microphone-button",
          "ceci-popcorn-component",
          "ceci-media",
	  "ceci-voice-recognition"
        ]
      },
      "fun": {
        "description": L10n.get("Add a little whimsy to your app."),
        "bricks": [
          "ceci-audio",
          "ceci-cowbell",
          "ceci-snaredrum",
          "ceci-kickdrum",
          "ceci-metronome",
          "ceci-sequencer",
          "ceci-fireworks",
          "ceci-pad-grid",
          "ceci-hot-potato",
          "ceci-jazzhands",
          "ceci-game-controller"
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

        var app = document.querySelector('ceci-app');

        if(!app) {
          window.addEventListener("CeciAppCreated", function(e) {
            app = e.detail.source;
          });
        }

        item.addEventListener('ComponentAddRequested', function(e) {
          app.addComponentToCard(name);
          analytics.event("Added Component", {label: name});
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

          //If it's not in any categories and we're in devmode, let's show it!
          if(!added && DesignerTray.devmode == true){
            var item = DesignerTray.buildItem(name);
            DesignerTray.showCategory("other");
            document.querySelector(".category-container.other").appendChild(item);
          }
          knownComponents.push(name);
        }

      },
      sortComponents: function () {
        // Sorts components in each category container
        var containers = document.querySelectorAll('.category-container'),
            container,
            labelSort = function (a, b) {
              if (a.label > b.label) return 1;
              if (a.label < b.label) return -1;
              return 0;
            },
            reappend = function (c) {
              container.appendChild(c);
            },
            i;
        for(i = 0; i < containers.length; i++) {
          container = containers[i];
          container.querySelectorAll('designer-component-tray-item')
                   .array()
                   .sort(labelSort)
                   .forEach(reappend);
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
        var categoryLinks = document.querySelectorAll(".brick-category a").array();

        categoryLinks.forEach(function(el, i){
          el.classList.remove("selected-category");
        });

        document.querySelector(".brick-category a[data-category="+category+"]").classList.add("selected-category");
        document.querySelector("#components").setAttribute("data-category",category);

        var categoryEls = document.querySelectorAll(".category-container").array();
        if(category === "all"){
          categoryEls.forEach(function(el, i){
            el.style.display = "";
          });
        } else {
          categoryEls.forEach(function(el, i){
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
      var categoryContainers = document.querySelectorAll(".category-container").array();
      searchValue = searchValue || "";
      var componentsContainer = document.querySelector('#components');
      if (searchValue.length > 0) {
        DesignerTray.filterCategory("all");
        CeciDesigner.forEachComponent(function (componentTag) {
          var menuElements = componentsContainer.querySelectorAll('designer-component-tray-item[name="' + componentTag + '"]').array();

          if (window.CeciDefinitions[componentTag] && menuElements.length) {
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
              menuElements.forEach(function(e) { e.classList.add('hide'); });
            }
            else {
              menuElements.forEach(function(e) { e.classList.remove('hide'); });
            }
          }
        });

        categoryContainers.forEach(function(el, i){
          if(el.querySelectorAll("designer-component-tray-item:not(.hide)").length === 0) {
            el.classList.add("no-results");
          } else {
            el.classList.remove("no-results");
          }
        });

      }
      else {
        categoryContainers.forEach(function(el, i){
          el.classList.remove("no-results");
        });
        Array.prototype.forEach.call(componentsContainer.querySelectorAll('designer-component-tray-item'), function (e) {
          e.classList.remove('hide');
        });
      }
    }

    function onPolymerReady() {
      DesignerTray.devmode = document.querySelector("#components-wrapper").classList.contains("development");
      DesignerTray.addComponentsFromRegistry();
      var searchBox = document.querySelector('.component-search');
      searchBox.addEventListener('input', function() {
        doSearch(searchBox.value.trim().toLowerCase());
      });
    }
    if (window.Polymer && Polymer.whenPolymerReady) {
      Polymer.whenPolymerReady(onPolymerReady);
    } else {
      window.addEventListener("polymer-ready", onPolymerReady);
    }

    return DesignerTray;
  }
);
