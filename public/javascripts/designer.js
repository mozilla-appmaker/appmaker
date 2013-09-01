/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(
  ["jquery", "ceci", "ceci-app", "inflector", "jquery-ui"],
  function($, Ceci, App, Inflector) {
    "use strict";

    var selection = [];

    var zIndex = 100;
    function moveToFront(element) {
      element.css('z-index', ++zIndex);
    }

    Ceci.onCardChange(function (card) {
      var thumbId = "card-thumb-" + card.id.match(/(\d+)$/)[0];
      $(".card").removeClass('selected');
      $("#" + thumbId).addClass('selected');
    });

    var app = new Ceci.App({
      container: $('#flathead-app')[0],
      onComponentAdded: function (component) {
        component = $(component);

        component.on('mousedown', function(evt) {
          selectComponent($(evt.currentTarget));
        });

        selectComponent(component);
      },
      onload: function (components) {
        // create first card as a default card
        createCard();

        Object.keys(components).sort().forEach(function (name) {
          var component = components[name];

          var thumb = $('<div class="clearfix draggable" name="' + name + '" value="' + name + '"><div class="thumb" value="' + name + '">' + name.replace('app-', '') + '</div><div class="info-btn hidden"></div></div>');
          $('.library-list').append(thumb);
          thumb.draggable({
            connectToSortable: ".drophere",
            helper: "clone",
            appendTo: document.body,
            start: function(event, ui){
              var clone = ui.helper;
              $(clone).find(".thumb").addClass("im-flying");
              clone.find('.info-btn').remove();
            },
            addClass: "clone"
          });
          if (component.description) {
            var componentDescription = component.description.innerHTML;
            thumb.attr('description', componentDescription);
          } else {
            thumb.attr('description', 'No description');
          }
        });

        $('.library-list').removeClass("library-loading");

        if (window.location.search.length > 0) {
          var match = window.location.search.match(/[?&]template=(\w+)/);
          if (match[1]) {
            $.getJSON('/templates/' + match[1] + '.json', function (data) {
              if (data && data.cards) {
                data.cards.forEach(function (card, cardIndex) {
                  var cardElement = document.querySelector('.ceci-card');
                  if (cardIndex > 0) {
                    cardElement = createCard();
                  }

                  function placeElementsInContainer (elements, container) {
                    elements.forEach(function (desc) {
                      var componentElement = document.createElement(desc.tagname);
                      componentElement.setAttribute('id', desc.id);


                      desc.attributes.forEach(function (attr) {
                        componentElement.setAttribute(attr.name, attr.value);
                      });

                      if (desc.broadcast !== 'false') {
                        var broadcastElement = document.createElement('broadcast');
                        broadcastElement.setAttribute('on', desc.broadcast);
                        componentElement.appendChild(broadcastElement);
                      }

                      desc.listen.forEach(function (listen) {
                        var listenElement = document.createElement('listen');
                        listenElement.setAttribute('on', listen.channel);
                        listenElement.setAttribute('for', listen.listener);
                        componentElement.appendChild(listenElement);
                      });

                      container.appendChild(componentElement);

                      $(componentElement).draggable({
                        handle: 'handle'
                      });

                      Ceci.convertElement(componentElement, function(){
                        app.componentAddedCallback(componentElement);
                      });
                    });
                  }

                  placeElementsInContainer(card.top, cardElement.querySelector('.fixed-top'));
                  placeElementsInContainer(card.canvas, cardElement.querySelector('.phone-canvas'));
                  placeElementsInContainer(card.bottom, cardElement.querySelector('.fixed-bottom'));
                });
              }
            });
          }
        }
      }
    });
    window._app = app;

    $(document).on('mouseenter', '.draggable', function () {
      $(this).children('.info-btn').show();
    }).on('mouseleave', '.draggable', function () {
      $(this).children('.info-btn').hide();
    });

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
      $(".editables-section").hide();
      $(".phone-container .selected").removeClass("selected");
      $(".inspector").addClass('hidden');
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

    $(document).on("mousedown",'.delete-btn',function () {
      var elements = selection.slice();
        clearSelection();
        elements.forEach(function(element) {
          element.removeSafely();
        });
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

      switch(definition.type) {
        case "text": return (function() {
                        // TODO: This would be a fine place for angular
                        var e = $("<div><label>" +
                          definition.title +
                          "</label><input type=\"text\" value=\"" +
                          value +
                          "\"></input></div>"
                        );

                        e.on("change", function(evt) {
                          element.setAttribute(attributeName, evt.target.value);
                        });
                        return e[0];
                      });
        case "number": return (function() {
                        // TODO: This would be a fine place for angular
                        var e = $(
                          "<div><label>" +
                          definition.title +
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
                          definition.title +
                          "</label><input type=\"checkbox\" " +
                          (value == "true" ? " checked=\"true\" " : "") + "\" value=\"" +
                          value + "\" /></div>"
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

      var attributeList = $(element).find(".editable-attributes");

      attributeList.html("");

      var attributes = element.getEditableAttributes();

      attributes.forEach(function(attribute) {
        var definition = element.getAttributeDefinition(attribute);
        var uiElement = getAttributeUIElement(element, attribute, definition);
        attributeList.append(uiElement);
      });

      var editables = $(element).find(".editable-section");
      editables.append(attributeList);
    };

    //Toggle customize
    $(document).on("mousedown",".customize-btn",function () {
      var section = $(this).parent().find('.editables-section').toggle();
      section.css("top",-1 * section.outerHeight() -2);
    });

    //Toggle the log
    $('.log-toggle').click(function () {
      if ($(this).hasClass('selected-button')) {
        $('.log').hide();
        $(this).removeClass('selected-button');
      } else {
        $('.log').show();
        $(this).addClass('selected-button');
      }
    });

    //Generate or remove the channel menu
    $(document).on('mouseleave','.channel-visualisation',function(){
      $(this).find(".channel-menu").remove();
    });


    $(document).on('mouseover','.channel-visualisation',function(){

      // $(this).toggleClass("open-toggle");
      var channelType;

      if($(this)[0].tagName == "LISTEN"){
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
        channels.each(function(key, channel){
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
        menu.addClass("menu-in");
        menu.css("margin-top",-1 * menu.outerHeight()/2 -1);
      }
    });

    //Channel Menu Label Click
    $(document).on("click",".channel-menu label", function(){
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
    $(document).on("click",".channel-option .color",function(){

      var thisChannel = $(this).closest(".channel-option");
      var color = $(this).attr("color");
      $(this).closest(".channel-option").removeClass("disabled-subscription");

      if(color == "false"){
        $(this).closest(".channel-option").addClass("disabled-subscription");
      }
      var title = thisChannel.attr("title");
      thisChannel.find(".chosen-color").attr("color",color);
      thisChannel.find("label").show();
      // $(this).closest(".channel-visualisation").find(".channel-menu-toggle").removeClass("open-toggle");
      // $(this).closest(".channel-menu").remove();
      $(this).parent().hide();
    });

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
        setTimeout(function(){
            displayAttributes(comp[0]);
        },0);
      }

      var element = comp[0];
      var compId = element.id;

      comp.addClass("selected");

      moveToFront(comp);


      //Changes component channel
      var onColorSelectFunction = function () {

        var comp = $(this);

        console.log(element);

        var channel = {
          hex: comp.attr('value'),
          name: comp.attr('name'),
          title: comp.attr('title')
        };

        // change broadcast "color"
        if (comp.parents().hasClass('broadcast-menu')) {
          element.setBroadcastChannel(channel.name);
          displayBroadcastChannel(channel.name);
        }

        // change listening "color"
        else {
          var attribute = comp.closest(".subscription-option").attr("title");
          if(attribute) {
            element.setSubscription(channel.name, attribute);
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
      $(".editables-section .name").text(componentName);
      $(".inspector").removeClass('hidden');
    };


    // logs messages
    $(document).on('broadcast', function (event, message) {
      var log = $('.log .inner p').append('<div>' + message + '</div>');
      var scroll = $(".scroll")[0];
      scroll.scrollTop = scroll.scrollHeight;
    });

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

    // this options object makes components drag/droppable when passed
    // to the jQueryUI "sortable" function.
    var sortableOptions = {
      accept: '.draggable',
      distance : 10,
      connectWith: ".drophere",
      placeholder: "ui-state-highlight",
      start : function() { $(".phone-container").addClass("dragging"); },
      stop : function() { $(".phone-container").removeClass("dragging"); },
      receive: function (event, ui) {
        if (ui.helper) {
          var helper = $(ui.helper);

          app.addComponent(helper.attr('value'), function(component){
            component = $(component);

            setTimeout(function(){
              component.append($('<div class="customize-btn"></div>'));
              component.append($('<div class="handle"></div>'));
              component.append($('<div class="editables-section"><div class="editable-attributes"></div><div class="delete-btn"></div></div>'));
            },0);

            var dropTarget = $(".drophere").find(".draggable");
            dropTarget.replaceWith(component);

            component.draggable({
              handle: 'handle'
            });
          });
        }
      }
    };

    $('.drophere').sortable(sortableOptions);

    var createCard = function() {
      var card = Ceci.createCard();
      $('.drophere', card).sortable(sortableOptions);
      $('#flathead-app').append(card);

      // create card thumbnail
      var cardNumber = $(".card").length + 1;
      var newthumb = $('<div class="card">' + cardNumber + '</div>');
      newthumb.attr('id', "card-thumb-" + cardNumber);
      newthumb.click(function() {
        card.showCard();
      });
      $(".cards").append(newthumb);

      card.showCard();

      return card;
    };

    $(".btn-add").click(createCard);


    $('.publish').click(function(){
      var manifest = app.serialize();

      $.ajax('/publish', {
        data: { manifest: manifest },
        type: 'post',
        success: function (data) {
          $('.publish-url').html(data.install);
          $('.publish-url').attr('href', data.install);
          $('.modal-publish-link').html(data.install);
          $('.modal-publish-link').attr('href', data.install);
          console.log('From publisher: ', data);
        },
        error: function (data) {
          console.error('Error while publishing content:');
          console.error(data);
        }
      });
    });

    //Publish modal
    $('.publish').click(function () {
      $('.modal-wrapper').addClass('flex');
    });

    $('.return-btn').click(function () {
      $('.modal-wrapper').removeClass('flex');
    });

    // AMD module return
    return {
      Ceci: Ceci,
      App: Ceci.App
    };
  }
);
