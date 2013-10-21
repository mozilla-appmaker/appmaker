/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(
  ["jquery", "ceci-app", "inflector", "ceci-ui", "jquery-ui", "togetherjsSupport"],
  function($, Ceci, Inflector) {
    "use strict";

    function Channel(name, title, hex) {
      // make sure the name is a string
      this.name = String(name);
      this.title = title;
      this.hex = hex;
    }

    var channels = [
      new Channel('blue', 'Blue Moon', '#358CCE'),
      new Channel('red', 'Red Baloon', '#e81e1e'),
      new Channel('pink', 'Pink Heart', '#e3197b'),
      new Channel('purple', 'Purple Horseshoe', '#9f27cf'),
      new Channel('green', 'Green Clover', '#71b806'),
      new Channel('yellow', 'Yellow Pot of Gold', '#e8d71e'),
      new Channel('orange', 'Orange Star', '#ff7b00'),
      new Channel(Ceci.emptyChannel, 'Disabled', '#444')
    ];

    var selection = [];

    var app;

    var remixUrl = document.querySelector('#appmaker-remix-url').value;

    function init () {
      app = new Ceci.App({
        defaultChannels: channels.map(function (c) { return c.name; }),
        container: $('#flathead-app')[0],
        onComponentAdded: function (component) {
          component = $(component);

          var dropTarget = $(".drophere").find(".draggable");
          dropTarget.replaceWith(component);

          component.addClass("component");
          component.draggable({
            handle: 'handle'
          });

          component.on('mousedown', function(evt) {
            selectComponent($(evt.currentTarget));
          });

          component.append($('<div class="handle"></div>'));

          selectComponent(component);
        },
        onload: function (components) {
          this.sortComponents();
          Ceci.registerCeciPlugin("onChange", function(){
            if (saveTimer) {
              clearTimeout(saveTimer);
            }
            saveTimer = setTimeout(saveApp, 500);
          });
          document.addEventListener("onselectionchanged", app.sortComponents);
          $('.library-list').removeClass("library-loading");
          $('.drophere').sortable(sortableOptions);
          $('.garbage-bin').droppable({
            tolerance : "touch",
            over : function( event, ui ) {
              $(this).addClass("garbage-open");
              $(".ui-state-highlight").hide();
            },
            out : function( event, ui ) {
              $(this).removeClass("garbage-open");
              $(".ui-state-highlight").show();
            },
            drop : function( event, ui ) {
              var elements = selection.slice();
              clearSelection();
              elements.forEach(function(element) {
                element.removeSafely();
              });
            }
          });
        },
        onCardChange: function (card) {
          var thumbId = "card-thumb-" + card.id.match(/(\d+)$/)[0];
          $(".card").removeClass('selected');
          $("#" + thumbId).addClass('selected');
        },
        onCardAdded: function (card) {
          Array.prototype.forEach.call(card.children, function (element) {
            element.classList.add('drophere');
          });

          // create card thumbnail
          var cardNumber = $(".card").length + 1;
          var newthumb = $('<div class="card">Page ' + cardNumber + '<a title="Delete this card" href="#" class="delete-card"></a></div>');
          newthumb.attr('id', "card-thumb-" + cardNumber);
          newthumb.click(function() {
            card.show();
          });
          $(".card-list").append(newthumb);
          $('.drophere').sortable(sortableOptions);
          card.show();
        }
      });

      app.sortComponents = function() {
        var components = Ceci._components;
        var sortedComponentNames = Object.keys(components);
        sortedComponentNames.sort();
        var componentList = $('#components');
        componentList.html('');
        var fullList = $('.library-list');
        fullList.html('');
        fullList.append('<div class="suggested-components heading">Suggested</div>');
        var suggestionCount = 0;

        var suggestions = [];
        var suggestors =  [];
        var friends = [];
        var component;
        var i,j;
        for (i=0; i < selection.length; i++) {
          suggestors.push(selection[i].localName);
        }
        for (i=0; i < suggestors.length; i++) {
          component = suggestors[i];
          friends = components[component].friends;
          if (friends) {
            for (j=0; j<friends.length; j++) {
              suggestions.push(friends[j]);
            }
          }
        }
        var card = Ceci.currentCard;
        for (i=0; i < card.elements.length; i++) {
          component = card.elements[i];
          friends = component.friends;
          if (friends) {
            for (j=0; j<friends.length; j++) {
              suggestions.push(friends[j]);
            }
          }
        }
        /* these are what we suggest with a blank app */
        // suggestions.push('app-fireworks');
        // suggestions.push('app-button');
        var alreadyMadeSuggestions = {};
        var suggestion;
        for (i = 0; i < Math.min(10, suggestions.length); i++) {
          suggestion = suggestions[i];
          if (suggestion in alreadyMadeSuggestions) continue;
          addThumb(components[suggestion], suggestion, fullList);
          alreadyMadeSuggestions[suggestion] = true;
        }
        fullList.append('<div class="lb"></div>');
        sortedComponentNames.forEach(function (name) {
          addComponentCard(components[name], name, componentList);
          //addThumb(components[name], name, fullList);
        });
      };
    }

    Ceci.registerCeciPlugin('onElementRemoved', function(element){
      $(document).off("click", ".color-ui .color", element.onColorSelectFunction);
    });

    // Make sure there wasn't something planeted in the app container already (e.g. remix)
    if ($('#flathead-app').find('.ceci-card > div').find('*').length === 0 ) {
      if (window.location.search.length > 0) {
          var match;

          if ((match = window.location.search.match(/[?&]template=([\w-_\.]+)/)) && match[1]) {
            $.get('/templates/' + match[1] + '.html',
              function (data) {
                var tmpContainer = document.createElement('div');
                tmpContainer.innerHTML = data;
                $('#flathead-app').html(tmpContainer.querySelector('#flathead-app').innerHTML);
                init();
              }).fail(function () {
                init();
              });
          }
          else if ((match = window.location.search.match(/[?&]remix=([\w-_\.]+)/)) && match[1]) {
            $.get(remixUrl.replace('{remixName}', match[1]) + 'index.html',
              function (data) {
                var tmpContainer = document.createElement('div');
                tmpContainer.innerHTML = data;
                if (tmpContainer.querySelector('#flathead-app')) {
                  $('#flathead-app').html(tmpContainer.querySelector('#flathead-app').innerHTML);
                }
                init();
              }).fail(function () {
                init();
              });
          }
          else {
            init();
          }
      }
      else if (localStorage.draft){
        $('#flathead-app').html(localStorage.draft);
        init();
      }
      else {
        init();
      }
    }
    else {
      init();
    }

    var saveTimer = null;

    function convertHex(hex,opacity){
      hex = hex.replace('#','');
      if (hex.length == 3) {
        hex = hex[0]+hex[0] + hex[1]+hex[1]+hex[2]+hex[2];
      }
      var r = parseInt(hex.substring(0,2), 16);
      var g = parseInt(hex.substring(2,4), 16);
      var b = parseInt(hex.substring(4,6), 16);

      var result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
      return result;
    }

    // these options object makes components drag/droppable when passed
    // to the jQueryUI "sortable" function.
    var sortableOptions = {
      accept: '.draggable',
      distance : 10,
      tolerance : "pointer",
      connectWith: ".drophere",
      placeholder: "ui-state-highlight",
      handle : ".handle",
      start : function(event,ui) {
        if(!$(ui.helper[0].firstChild).hasClass("preview-icon")){
          var top = ui.originalPosition.top;
          $(".phone-container").addClass("dragging");
          $(".garbage-bin").show();
          $(".garbage-bin").css("top", parseInt(top, 10));
        }
      },
      stop : function(event, ui) {
        $(".phone-container").removeClass("dragging");
        $(".garbage-bin").hide();
        ui.item.removeAttr("style");
      },
      receive: function (event, ui) {
        if (ui.helper) {
          var helper = $(ui.helper);
          app.addComponent(helper.attr('value'));
        }
      },
      update: function (event, ui){
        Ceci.fireChangeEvent();
      }
    };

    //Open components modal
    $('.find-components').click(function () {
      $('#component-discovery-modal').removeClass('hidden');
      $(".component-search").focus();
    });

    $('.done').click(function () {
      $('#component-discovery-modal').addClass('hidden');
    });

    //Add components to phone
    $(document).on('click', '.add-component', function () {
      $('#component-discovery-modal').addClass('hidden');
      var comp = $(this).attr('name');
      var component = document.createElement(comp);

      Ceci.convertElement(component, function () {
        $('.ceci-card:visible .phone-canvas').append(component);
        component = $(component);
        var dropTarget = $(".drophere").find(".draggable");
        dropTarget.replaceWith(component);
        component.addClass("component");
        component.draggable({
          handle: 'handle'
        });
        component.on('mousedown', function(evt) {
          selectComponent($(evt.currentTarget));
        });
        component.append($('<div class="handle"></div>'));
        selectComponent(component);
      }, true);
    });

    function addComponentCard(component, name, list) {
      var componentDescription;
      if (component.description) {
        componentDescription = component.description.innerHTML;
      } else {
        componentDescription = "No description available";
      }
      var card = $('<div class="component-card"></div>');
      var descriptionColumn = $('<div class="component-description"><h1>' + name.replace('app-', '') + '</h1><h6>'+ componentDescription +'</h6></div>');

      var preview = $('<div class="component-preview"><div class="image-wrapper">' + component.thumbnail.innerHTML + '</div><div name='+name+' class="add-component add-component-overlay"><div class="add-tooltip">Click to Add</div></div></div>');

      var friendList = $('<div class="friends"><h3>Friends</h3></div>');
      if (component.friends.length > 0) {
        for (var i = 0; i < component.friends.length; i++) {
          friendList.append($('<a>'+ component.friends[i] +'</a>'));
        }
      } else {
        friendList.append($('<div>No Friends<div>'));
      }

      var author = $('<div class="author"><h5>By: Joe Thomas | Last edited 8/12/13</h5></div>');
      var tags = $('<div class="tags clearfix"><div class="tag">Animation</div></div>');
      var moreInfo = $('<div class="more-info"></div>');
      var showMore = $('<a class="show-more" href="#">More Info</a>');

      moreInfo.append(friendList);
      moreInfo.append(tags);
      moreInfo.append(author);
      card.append(preview);

      descriptionColumn.append(moreInfo);

      card.append(descriptionColumn);
      card.append(showMore);

      list.append(card);
    }

    function addThumb(component, name, list) {
      var previewContent;
      var preview = component.thumbnail;
      if(! preview){
        previewContent = '<div class="missing-image">?</div>';
      } else {
        previewContent = preview.innerHTML;
      }
      var thumb = $('<div class="preview"><div class="flipper"><div class="front"><div class="preview-icon">'+ previewContent +'</div><div class="thumb" value="' + name + '">' + name.replace('app-', '') + '</div></div><div class="back"><div class="draggable" name="' + name + '" value="' + name + '"><div class="preview-icon">'+ previewContent +'</div><div class="thumb" value="' + name + '">' + name.replace('app-', '') + '</div><div class="component-instruction">Drag Me</div></div></div></div></div>');
      list.append(thumb);
      $('.draggable').draggable({
        connectToSortable: ".drophere",
        helper: "clone",
        appendTo: document.body,
        start: function(event, ui){
          var clone = ui.helper;
          $(clone).removeClass("back");
        },
        addClass: "clone"
      });

      if (component && component.description) {
        var componentDescription = component.description.innerHTML;
        thumb.attr('description', componentDescription);
      } else {
        thumb.attr('description', 'No description');
      }
    }

    var saveApp = function(){
      localStorage.draft = app.serialize();
      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var seconds = now.getSeconds();
      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;
      now = hours + ':' + minutes + ":" + seconds;
      $('.note').show();
      $('#time').text(now);
      console.log('Draft saved:', now);
    };

    $('.add-card').click(function(){
      app.addCard();
    });

    $('.cards').on("click",".delete-card",function(){
      window.confirm("Delete this Page?");
    });

    $('#duplicate-card').click(function(){
      app.duplicateCard(Ceci.currentCard).show();
    });

    $(document).on('mouseenter', '.draggable', function () {
      $(this).children('.info-btn').show();
    }).on('mouseleave', '.draggable', function () {
      $(this).children('.info-btn').hide();
    });

    //TODO: Angular this up
    // generate the channels list (colored clickable boxes) and append to the page
    function getChannelStrip(forAttribute) {
      var strip = $('<div class="colorstrip" id="strip-' + forAttribute + '"></div>');
      for (var i in channels) {
        var rdata = channels[i];
        strip.append(
          $('<div class="colorChoice '+ rdata.name +'" value="'+ rdata.hex +'" name="'+ rdata.name +'" title="'+ rdata.title +'" style="background-color: '+ rdata.hex +'"></div>')
        );
      }
      return strip;
    }

    // get a Channel object given a channel name
    function getChannelByChannelName(channelName) {
      for (var i in channels) {
        if(channels[i].name === channelName) {
          return channels[i];
        }
      }
      return false;
    }

    // empty the list of currently selected elements on the page
    var clearSelection = function() {
      selection = [];
      $(".editable-section").hide();
      $(".phone-container .selected").removeClass("selected");
      $(".inspector").addClass('hidden');
      var event = new Event('onselectionchanged');
      document.dispatchEvent(event);
    };

    var disableReorder = function() {
      $(".phone-canvas,.fixed-top,.fixed-bottom").sortable("disable");
    };

    clearSelection();

    $(document).on('click', '.container', function (evt) {
      if ($(evt.target).hasClass('container')) {
      clearSelection();
      }
    });

    // document-level key handling
    $(document).unbind('keydown').bind('keydown', function(event) {
      var keys = {
        esc: 27,
        del: 46,
        backspace: 8
      };

      switch (event.which) {
        case (keys.esc):
          // escape hides all modal dialogs
          $('.color-modal').removeClass('flex');
          // and clears the selection non-destructively
          clearSelection();
          break;

        // delete removes all selected items.
        case (keys.del):
          var elements = selection.slice();
          clearSelection();
          elements.forEach(function(element) {
            element.removeSafely();
          });
          break;

        case (keys.backspace):
          // Cancel "back" navigation
          if (event.target.tagName.toLowerCase() === 'body'){
            event.preventDefault();
          }
      }
    });

    var displayBroadcastChannel = function () {
      var bo = $(".broadcast-options");
      bo.html("");
      var strip = getChannelStrip("broadcast");
      bo.append(strip);
    };

    var getPotentialListeners = function(element) {
      return element.subscriptionListeners.map(function(listener) {
        var subscription;
        element.subscriptions.forEach(function(s) {
          if(s.listener === listener) {
            subscription = s;
          }
        });
        if(!subscription) {
          subscription = {
            channel: Ceci.emptyChannel,
            listener: listener
          };
        }
        return subscription;
      });
    };

    var displayListenChannel = function (attribute) {
      var lo = $(".listen-options");
      lo.html("");
      var strip = getChannelStrip(attribute);
      lo.append(strip);
    };

    var getAttributeUIElement = function(element, attributeName, definition) {
      var value = element.getAttribute(attributeName);
      value = value !== null ? value : '';

      var title = Inflector.titleize(Inflector.underscore(attributeName));

      switch(definition.type) {
      case "multiple": return (function() {
                      var options = JSON.parse(value);
                      var e = $("<div>" +
                        "<label>"+title + "</label>" +
                        "<div class=\"option-list\"></div>" +
                        "</div>"
                      );

                      for (var key in options) {
                        e.find(".option-list").append("<input type=\"text\" value=\"" +options[key]+"\" />");
                      }

                      var add = $("<a class=\"add\" href=\"#\">Add Another</a>");
                      e.append(add);

                      e.on("click",".add", function(){
                        e.find(".option-list").append("<input type=\"text\" value=\"\" />");
                      });

                      e.on("keyup", function(evt) {
                        var options = [];
                        e.find("input").each(function(){
                          options.push($(this).val());
                        });
                        element.setAttribute(attributeName, JSON.stringify(options));
                      });
                      return e[0];
                    });
        case "select": return (function() {
                      var e = $("<div><label>" +
                        title +
                        "</label><select type=\"text\" value=\"" +
                        value +
                        "\"> "+
                        "</select></div>"
                      );
                      $(definition.options).each(function(i,k){
                        var option = document.createElement("option");
                        $(option).attr("value",k);
                        $(option).text(k);
                        e.find("select").append(option);
                      });
                      e.find("select").val(value);
                      e.on("change", function(evt) {
                        element.setAttribute(attributeName, evt.target.value);
                      });
                      return e[0];
                    });
        case "text": return (function() {
                        // TODO: This would be a fine place for angular
                        var e = $("<div><label>" +
                          title +
                          "</label><input type=\"text\" value=\"" +
                          value +
                          "\"></input></div>"
                        );
                        e.on("keyup", function(evt) {
                          element.setAttribute(attributeName, evt.target.value);
                        });
                        return e[0];
                      });
        case "number": return (function() {
                        // TODO: This would be a fine place for angular
                        var e = $(
                          "<div><label>" +
                          title +
                          "</label><input type=\"number\" min=\"" +
                          definition.min +
                          "\" max=\"" +
                          definition.max +
                          "\" value=\"" +
                          value + "\" /></div>"
                        );
                        e.on("change", function(evt) {
                          element.setAttribute(attributeName, evt.target.value);
                        });
                        return e[0];
                      });
        case "boolean": return (function() {
                        // TODO: This would be a fine place for angular
                        var e = $(
                          "<div><label>" +
                          "<input type=\"checkbox\" " +
                          (value == "true" ? " checked=\"true\" " : "") + "\" value=\"" +
                          value + "\" />" + title + " </div>"
                        );
                        e.on("change", function(evt) {
                          evt.target.value = evt.target.value == "true" ? "false" : "true";
                          element.setAttribute(attributeName, evt.target.value == "true" ? true : false);
                        });
                        return e[0];
                      });

      }
      return $("<span>"+definition.type+" not implemented yet</span>");
    };

    var displayAttributes = function(element) {

      var attributeList = $(".editable-attributes");

      attributeList.html("");

      var attributes = element.getEditableAttributes();

      attributes.forEach(function(attribute) {
        var definition = element.getAttributeDefinition(attribute);
        var uiElement = getAttributeUIElement(element, attribute, definition);
        attributeList.append(uiElement);
      });

      var editables = $(".editable-section");
      editables.show();
    };

    //Toggle customize
    $(document).on("mousedown",".customize-btn",function () {
      var section = $(this).closest(".selected").find('.editables-section').toggle();
      section.css("top",-1 * section.outerHeight() -2);
    });

    //Toggle the log
    $('.log-toggle').click(function () {
      if ($(this).hasClass('selected-button')) {
        $('.log-wrapper').removeClass('expanded');
        $('.container').removeClass('log-expanded');
        $(this).removeClass('selected-button');
      }
      else {
        $('.log-wrapper').addClass('expanded');
        $('.container').addClass('log-expanded');
        $(this).addClass('selected-button');
      }
    });

    //Generate or remove the channel menu
    $(document).on('mouseleave','.channel-visualisation',function(){
      $(this).find(".channel-menu").remove();
      $(this).closest(".component").removeClass("menu-open");
    });

    $('ul.tabs').each(function(){
      var $active, $content, $links = $(this).find('a');

      // If the location.hash matches one of the links, use that as the active tab.
      // If no match is found, use the first link as the initial active tab.
      $active = $($links.filter('[href="'+location.hash+'"]')[0] || $links[0]);
      $active.addClass('active-tab');
      $content = $($active.attr('href'));

      // Hide the remaining content
      $links.not($active).each(function () {
        $($(this).attr('href')).hide();
      });

      $(this).on('click', 'a', function(e){
        // Make the old tab inactive.
        $active.removeClass('active-tab');
        $content.hide();
        $active = $(this);
        $content = $($(this).attr('href'));
        $active.addClass('active-tab');
        $content.show();

        e.preventDefault();
      });
    });


    $(document).on('mouseover','.channel-visualisation',function(){
      var channelType;

      if ($(this)[0].classList.contains('subscription-channels')) {
        channelType = "subscription";
      } else {
        channelType = "broadcast";
      }

      //If there is no menu
      if($(this).find(".channel-menu").length === 0 && $(this).find(".channel").length > 0) {
        var menu = $(".channel-menu-template").clone();
        menu.removeClass("channel-menu-template");
        menu.addClass(channelType + "-menu");

        var channels = $(this).find(".channel");

        //Build out the Subscription Channels
        channels.each(function (key, channel) {
          var subItem = menu.find(".channel-template").clone();
          subItem.removeClass("channel-template");
          var title = $(channel).attr("title");
          var color = $(channel).attr("color");
          subItem.attr("title",title);
          subItem.find(".chosen-color").attr("color",color);
          subItem.find(".color[color="+color+"]").addClass("ui-chosen-color");
          subItem.find(".channel-name").text(Inflector.titleize(Inflector.underscore(title)));
          menu.append(subItem);
        });

        menu.find(".channel-template").remove();

        $(this).append(menu);
        $(this).closest(".component").addClass("menu-open");

        menu.addClass("menu-in");
        menu.css("margin-top",-1 * menu.outerHeight()/2 -1);
      }
    });

    //Channel Menu Label Click
    $(document).on("click", ".channel-menu label", function(){
      var menu = $(this).closest(".channel-menu");
      var color = $(this).find(".chosen-color").attr("color");
      var colorList = $(this).closest(".channel-option").find(".color-ui");
      menu.find("label").show();
      menu.find(".color-ui").hide();
      $(this).hide();
      colorList.find(".color").removeClass("ui-chosen-color");
      colorList.find(".color[color="+color+"]").addClass("ui-chosen-color");
      colorList.show();
    });

    //Subscription Menu Color Click
    $(document).on("click", ".channel-option .color", function(){

      var thisChannel = $(this).closest(".channel-option");
      var color = $(this).attr("color");
      $(this).closest(".channel-option").removeClass("disabled-subscription");

      if(color == "false"){
        $(this).closest(".channel-option").addClass("disabled-subscription");
      }
      var title = thisChannel.attr("title");
      thisChannel.find(".chosen-color").attr("color",color);
      thisChannel.find("label").show();
      $(this).parent().hide();
    });
    function clearLog() {
      document.querySelector('.log .scroll').innerHTML = '';
      Ceci.log("New app, clean log.");
    }
    document.addEventListener('log', function(event) {
      try {
        var scroll = $('.log .scroll');
        var eltthum;
        if (event.detail.speaker) {
          eltthum = $("<a class='speaker' elementid='" + event.detail.speaker.id + "'>" + event.detail.speaker.localName.replace('app-', '') + "</a>");
          eltthum.on('click', function(elt) {
            var eltid = elt.currentTarget.getAttribute('elementid');
            var newelt = $("#" + eltid)[0];
            Ceci.elementWantsAttention(newelt);
            selectComponent($(newelt));
          });
        }
        var line = $('<li></li>');
        var channelthumb;
        if (event.detail.channel) {
          var channel = getChannelByChannelName(event.detail.channel);
          channelthumb = $("<span class='channel'></span>");
          channelthumb.css('backgroundColor', convertHex(channel.hex, 70));
        } else {
          channelthumb = $("<span class='channel'>&nbsp;</span>");
          channelthumb.css('backgroundColor', "#31353C");
        }
        line.append(channelthumb);
        var payload = $("<div class='payload new'/>");
        if (eltthum) payload.append(eltthum);
        payload.append(" <span class='message'>" + event.detail.message + "</span>");
        line.append(payload);
        scroll.append(line);
        payload.focus(); // needed for bg animation
        payload.removeClass('new');
        if (event.detail.severity == Ceci.LOG_WTF) {
          line.addClass('severity').addClass('wtf');
        }
        scroll[0].scrollTop = scroll[0].scrollHeight;
      } catch (e) {
        console.log(e);
        console.log(e.message);
      }
    });
    Ceci.log("AppMaker designer is ready.", "");

    var selectComponent = function(comp) {

      if(comp.find(".channel-menu").length === 0){
        $(".channel-menu:not('.channel-menu-template')").remove();
      }

      if(comp.find(".channel-chooser").length === 0){
        $(".channel-chooser").appendTo("body").hide();
      }

      //Clear out the listener since we're adding it again later
      //I'm not sure why we can't do this once somewhere
      selection.forEach(function(element) {
        $(document).off("click", ".color-ui .color", element.onColorSelectFunction);
      });

      if(comp[0] != selection[0]){
        clearSelection();
        selection.push(comp[0]);
        var event = new Event('onselectionchanged');
        document.dispatchEvent(event);
        setTimeout(function(){
          displayAttributes(comp[0]);
        },0);
      }

      var element = comp[0];
      var compId = element.id;

      comp.addClass("selected");

      //Changes component channel
      var onColorSelectFunction = function () {
        var attribute;

        var comp = $(this);

        var channel = {
          hex: comp.attr('value'),
          name: comp.attr('name'),
          title: comp.attr('title'),
          value: comp.attr('data-channel')
        };

        // change broadcast "color"
        if (comp.parents().hasClass('broadcast-menu')) {
          attribute = comp.closest(".subscription-option").attr("title");
          if (attribute) {
            element.setBroadcast(channel.value, attribute);
            displayBroadcastChannel(channel.name);
          }
        }

        // change listening "color"
        else {
          attribute = comp.closest(".subscription-option").attr("title");
          if (attribute) {
            element.setSubscription(channel.value, attribute);
            displayListenChannel(attribute);
          }

        }
      };

      // listen for color UI clicks

      $(document).on('click', '.color-ui .color', onColorSelectFunction);

      // give the element the function we just added, so we
      // can unbind it when the element gets unselected.
      element.onColorSelectFunction = onColorSelectFunction;

      var componentName = element.tagName.toLowerCase();
      $(".editable-section .name").text(componentName);

      //add mailbox info to right column
      /*
      $('.mailboxes').html('');

      for (var i=0; i < element.subscriptions.length; i++) {
        var channelProperty = element.subscriptions[i].listener;
        var mailboxColor = element.subscriptions[i].channel;
        var mailbox = $('<div class="mail"></div>').html(channelProperty).addClass(mailboxColor);
        $('.mailboxes').append(mailbox);
      }

      //add outgoing mail info to right column
      $('.outgoing-mail').html('');
      var mailColor = element.broadcastChannel;
      var outgoingMail = $('<div class="mail">Mail</div>').addClass(mailColor);
      $('.outgoing-mail').append(outgoingMail);*/
    };

    //shows component description
    var showComponentDescription = function (xPos, yPos, component, compDescription) {
      var componentDescription = $('<div class="component-description"></div>');
      componentDescription.css({top: yPos, left: xPos});
      componentDescription.text(compDescription);
      $(document.body).append(componentDescription);
    };

    $(document).on('mouseenter', '.info-btn', function () {
      var yPos = $(this).offset().top - 9 + 'px';
      var xPos = $(this).offset().left + 40 + 'px';
      var component = $(this).parents('.draggable').attr('value');
      var compDescription = $(this).parents('.draggable').attr('description');
      showComponentDescription(xPos, yPos, component, compDescription);
    }).on('mouseleave', '.info-btn', function () {
      $('.component-description').remove();
    });


    $('.new').click(function(){
      $('.card').remove();
      clearSelection();
      app.clear();
      clearLog();
    });

    var escapeHandler = function(e) {
      if (e.keyCode === 27) {
        $('.modal-wrapper').removeClass('flex');
        document.removeEventListener('keydown', escapeHandler, false);
      }
    };

    $('.publish').click(function(){
      var portableAppTree = app.getPortableAppTree();

      $.ajax('/publish', {
        data: {
          html: portableAppTree.outerHTML
        },
        type: 'post',
        success: function (data) {
          $(".publishdialog .failure").hide();
          $(".publishdialog .spinner").hide();
          $('.publish-url').html(data.install);
          $('.publish-url').attr('href', data.install);
          $('.modal-publish-link').html(data.install);
          $('.modal-publish-link').attr('href', data.install);
          $(".publishdialog .success").show();
          document.addEventListener('keydown', escapeHandler, false);
        },
        error: function (data) {
          $(".publishdialog .spinner").hide();
          $(".publishdialog .success").hide();
          if (data.responseJSON) {
            $(".failure .message").html(data.responseJSON.error.message);
          }
          else {
            $(".failure .message").html('Unexpected server error');
          }
          console.error('Error while publishing content:');
          console.error(data);
          $(".publishdialog .failure").show();
          document.addEventListener('keydown', escapeHandler, false);
        }
      });
    });

    //Publish modal
    $('.publish').click(function () {
      $(".publishdialog .failure").hide();
      $(".publishdialog .success").hide();
      $(".publishdialog .spinner").show();
      $('.modal-wrapper').addClass('flex');
    });

    $(".trey-tabs").on("click","a",function(){
      var tab = $(this).attr("tab");
      changeEditableTab(tab);
      return false;
    });

    $('.remix-button').click(function(){
      toggleRemixMode("on");
      return false;
    });

    $('.remix-header a').click(function(){
      toggleRemixMode("off");
      return false;
    });

    $('.return-btn').click(function () {
      $('.modal-wrapper').removeClass('flex');
      document.removeEventListener('keydown', escapeHandler, false);
    });

    $(".right-column").on("click",".expand-handle",function(){
      toggleColumns();
    });

    function toggleColumns(){
      $(".page-wrapper").toggleClass("tray-hidden");
      $(".tray").toggleClass("hidden");
      $(".right-column").toggleClass("expanded");
    }

    function changeEditableTab(tab) {
      $(".trey-tabs").find("a").removeClass("selected-tab");
      $(".trey-tabs [tab='"+tab+"']").addClass("selected-tab");
      $(".tab-sections .section").hide();
      $(".tab-sections .section-" + tab).show();
      $(".tab-sections .section-" + tab + " textarea").focus();
      if(tab == "view-source"){
        expandColumn();
      } else {
        if($(".right-column").not(".remix-mode").length == 1){
          contractColumn();
        }
      }
    }

    $(document).ready(function(){
      switchSourceView("HTML");
      changeEditableTab("customize");
      $(".modal").on("click",".component-card .show-more",function(){
        $(this).hide();
        $(this).closest(".component-card").find(".more-info").slideToggle();
      });
      $(".component-search").on("keydown",function(){
        setTimeout(function(){
          filterComponents($(".component-search").val());
        },100);
      });
    });

    function filterComponents(search){
      var components = $(".modal .component-card");
      components.each(function(){
        var name = $(this).find("h1").text();
        if(name.indexOf(search) == -1){
          $(this).hide();
        } else {
          $(this).show();
        }
      });
    }

    // View source menu
    $(".view-source-menu").on("click","a",function(){
      var sourceType = $(this).attr("source");
      switchSourceView(sourceType);
    });

    function switchSourceView(view) {
      $(".view-source-menu a").removeClass("selected");
      $(".view-source-menu a[source='" + view + "']").addClass("selected");
      $(".view-source-items .source-type").hide();
      $(".view-source-items [source='" + view + "']").show();
    }

    $(".view-source-items textarea").on("keyup",function(){
      $(".right-column").addClass("remix-mode");
      $(".remix-helper").hide();
      expandColumn();
    });

    $(".remix-ui a.finish-remix, .remix-ui a.cancel-remix").on("click",function(){
      $(".right-column").removeClass("remix-mode");
      changeEditableTab("customize");
      contractColumn();
    });

    $(".dismiss-note").on("click",function(){
      $(this).parent().fadeOut();
    });

    function contractColumn(){
      $(".page-wrapper").removeClass("tray-hidden");
      $(".tray").removeClass("hidden");
      $(".right-column").removeClass("expanded");
    }

    function expandColumn(){
      $(".page-wrapper").addClass("tray-hidden");
      $(".tray").addClass("hidden");
      $(".right-column").addClass("expanded");
    }

    // AMD module return
    return {
      Ceci: Ceci,
      App: Ceci.App
    };
  }
);
