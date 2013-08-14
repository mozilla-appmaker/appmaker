/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(["jquery", "angular", "ceci", "ceci-ui", "jquery-ui"], function($, ng, Ceci) {
  // TODO: Fix this, we're essentially working around require.js.
  // This is gross and shouldn't happen, it's

  var selection = [];
  var defaultChannel = "#358CCE"; /* matches what's in style.css */
  var defaultChannelName = "blue";
  var tagids = {};
  var genId = function(tag) {
    // generate a unique id that increments per tag ('moz-button-1', 'moz-button-2', etc.)
    if (! tagids[tag]) {
      tagids[tag] = 0;
    }
    return tag + '-' + String(++tagids[tag]);
  }

  var zindex = 100;
  var moveToFront = function (elt) {
    elt.css('z-index', ++zindex);
  }

  Ceci.load(function(components) {
    Object.keys(components).forEach(function (tag) {
      var thumb = $('<div class="clearfix draggable" name="' + tag + '" value="' + tag + '"><div class="thumb" value="' + tag + '">' + tag.replace('app-', '') + '</div></div>');
      $('.library-list').append(thumb);
      thumb.draggable({
        appendTo: ".phone-canvas",
        helper: "clone",
        addClass: "clone"
      })
    });
  });

  function Channel(name, title, hex) {
    this.name = name;
    this.title = title;
    this.hex = hex;
  }

  var radio = [
        new Channel('blue', 'Blue Moon', '#358CCE'),
        new Channel('red', 'Red Baloon', '#e81e1e'),
        new Channel('pink', 'Pink Heart', '#e3197b'),
        new Channel('purple', 'Purple Horseshoe', '#9f27cf'),
        new Channel('green', 'Green Clover', '#71b806'),
        new Channel('yellow', 'Yellow Pot of Gold', '#e8d71e'),
        new Channel('orange', 'Orange Star', '#ff7b00'),
      ];

  // generate the radio channel list (colored clickable boxes) and append to the page
  var listChannels = function () {
    var rdata, i = 0;
    for (var i; i < radio.length; i++) {
      rdata = radio[i];
      $('.broadcast-options, .listen-options').append('<div class="color" value="'+ rdata.hex +'" name="'+ rdata.name +'" title="'+ rdata.title +'" style="background-color: '+ rdata.hex +'"></div>')
    }
  }

  // get a Channel object given a channel name
  var getChannelByChannelName = function(channelName) {
    var i,
       len = radio.length,
       rdata;
    for (i = 0; i<len; i++) {
      rdata = radio[i];
      if(rdata.name === channelName) {
        return rdata;
      }
    }
    return false;
  }

  // empty the list of currently selected elements on the page
  var clearSelection = function() {
      var element;
      selection.forEach(function(id) {
        element = $("#"+id);
        $(document).off("click", ".color", element.onSelectFunction);
      });
      selection = [];
      $(".selected").removeClass("selected");
      $(".inspector").addClass('hidden');
      disableReorder();
  }

  // jQuery-UI property for reordering items in the designer
  var sortable;
  var enableReorder = function() {
    $(".phone-canvas").disableSelection();
    sortable = $(".phone-canvas").sortable({
      placeholder: "ui-state-highlight"
    });
  }
  var disableReorder = function() {
    sortable = false;
    return $(".phone-canvas").sortable("disable");
  }

  // indicates the design vs. play mode for the app we're building
  var mode;

  // FIXME: 'modes' might become obsolete
  var buildMode = function() {
    $(".play").removeClass("on");
    $(".build").addClass("on");
    mode = 'build';
    enableReorder();
    $(".tray").css('visibility', 'visible');
    $(".log").hide();
    $(".cards").show();
  }

  // FIXME: 'modes' might become obsolete
  var playMode = function() {
    $(".play").addClass("on");
    $(".build").removeClass("on");
    $(".tray").css('visibility', 'hidden');
    $(".cards").hide();
    $(".log").show();
    mode = 'play';
    clearSelection();
    disableReorder();
  }

  listChannels();
  enableReorder();
  disableReorder();
  clearSelection();
  buildMode();

  $(document).on('click', '.play', function() {
    playMode();
  });

  $(document).on('click', '.build', function() {
    buildMode();
  });

  $(document).on('click', '.container', function (evt) {
    if ($(evt.target).hasClass('container')) {
      clearSelection();
    }
  });

  $(document).on('keydown', function(event) {
    if (event.which == 27) { // escape
      // escape hides all modal dialogs
      $('.color-modal').removeClass('flex');
      // and clears the selection non-destructively
      clearSelection();
    } else if (event.which == 8) { // delete
      // delete removes the currently selected components and resets the selection
      if (selection) {
        // TODO: add in support for multiple element selections
        var selectedComponent = $("#" + selection[0]);
        // FIXME: this needs to be built into Ceci so that elements can clean up after themselves
        if(selectedComponent.unlisten) {
            // clean up all outstanding event listeners this element has
            selectedComponent.unlisten();
        }
        // remove element from the page
        selectedComponent.remove();
        clearSelection();
      }
    } else if (event.which == 9) { // tab
      // mode toggling
      if (mode == "play") { buildMode(); }
      else { playMode(); }
      // also prevent the event from being interpreted by anything else
      event.preventDefault();
    }
  });

  var displayBroadcastChannel = function (channelName) {
    var rdata = getChannelByChannelName(channelName);
    if(!rdata) {
        rdata = getChannelByChannelName(defaultChannelName);
    }
    $('.inspector .broadcast-channel')
        .text(rdata.title)
        .css({'color': rdata.hex, 'border-color': rdata.hex});
  }

  var displayListenChannel = function (channelName) {
    var rdata = getChannelByChannelName(channelName);
    if(!rdata) {
        rdata = getChannelByChannelName(defaultChannelName);
    }
    $('.inspector .listen-channel').text(rdata.title)
    .css({'color': rdata.hex, 'border-color': rdata.hex});
  }

  var selectComponent = function(comp) {
    clearSelection();
    moveToFront(comp);
    var element = comp[0];
    var compId = element.id
    selection = [compId];
    comp.addClass("selected");

    //Set current component channel
    console.log(element.subscriptions);
    var currentListen = element.subscriptions[0].channel;
    displayListenChannel(currentListen);

    console.log(element.broadcastChannel);
    var currentBroadcast = element.broadcastChannel;
    displayBroadcastChannel(currentBroadcast);

/********************** TEST CODE *******************/
    //Changes component channel
    var onSelectFunction = function () {
      var comp = $(this);
      var channel = {
          hex: comp.attr('value'),
          name: comp.attr('name'),
          title: comp.attr('title')
      };
      // change broadcast "color"
      if (comp.parent().hasClass('broadcast-options')) {
        element.setBroadcastChannel(channel.name);
        displayBroadcastChannel(channel.name);
      }
      // change listening "color"
      else {
        // TODO: make channels per-function
        //element.subscriptionListeners.forEach(function(listener) {
        //  element.setSubscription(channel.name, listener);
        //});
        element.setSubscription(channel.name, element.subscriptionListeners[0]);
        displayListenChannel(channel.name)
      }
    };
    $(document).on('click', '.color', onSelectFunction);

    // give the element the function we just added, so we
    // can unbind it when the element gets unselected.
    element.onSelectFunction = onSelectFunction;

    var componentname = element.tagName.toLowerCase();
    $(".inspector .name").text(componentname);
    $(".inspector").removeClass('hidden');
/****************** END TEST CODE *******************/

/*  **** COMMENTED OFF BECAUSE WE THINK IT MIGHT BE DEAD CODE ****
    // show its channels in the inspector
    var broadcasts = $('template#' + componentname).attr('broadcasts') !== undefined
    var listens = $('template#' + componentname).attr('ondblclick') !== undefined
    if (broadcasts) {
      var broadcastChannel = comp.attr('broadcast-to')
      if (!broadcastChannel) {
        broadcastChannel = defaultChannel;
        comp.attr('broadcast-to', broadcastChannel)
      }
      $("#outputBlock").show();
      $("#outputChannel").children().css({'color': broadcastChannel})
    } else {
      $("#outputBlock").hide();
    }
    if (listens) {
      var listenChannel = comp.attr('listen-to')
      if (!listenChannel) {
        listenChannel = defaultChannel;
        comp.attr('listen-to', listenChannel)
      }
      $("#inputBlock").show();
      $("#inputChannel").children().css({'color': listenChannel})
    } else {
      $("#inputBlock").hide();
    }
*/
  }

  //logs messages
  $(document).on('broadcast', function (event, message) {
    var log = $('.log .inner p').append('<div>' + message + '</div>');
    var scroll = $(".scroll")[0];
    scroll.scrollTop = scroll.scrollHeight;
  });

  // drag and drop behavior
  $('.phone-canvas').droppable({
    accept: '.draggable',
    drop: function (event, ui) {
      var helper = $(ui.helper);
      var componentname = helper.attr('value');
      var componentId = genId(helper.attr('name'));
      var component = $('<' + componentname + '></' + componentname + '>');
      component.attr('id', componentId)
      component.on('mousedown', function(evt) {
        if (mode == 'play') {
          $(evt.target).addClass('active'); // to replace :active which is otherwise impossible to intercept
        } else {
          selectComponent($(evt.currentTarget));
        }
      });
      component.on('mouseleave', function(evt) {
        if (mode == 'play') {
          $(evt.target).removeClass('active'); // to replace :active which is otherwise impossible to intercept
        }
      });
      component.on('mouseup', function(evt) {
        if (mode == 'play') {
          $(evt.target).removeClass('active'); // to replace :active which is otherwise impossible to intercept
        }
        if (mode == 'build') {
          event.stopPropagation();
          event.preventDefault();
        }
      });
      $(this).append(component);

      // convert from webcomponent markup to "real" html markup,
      // with all the functions and properties bound, and channel
      // listening set up.
      Ceci.convertElement(component[0]);

      selectComponent(component);

/*  **** COMMENTED OFF BECAUSE WE THINK IT MIGHT BE DEAD CODE ****
      $('.thumb[name='+componentId+']').not(ui.helper).draggable( "disable" ).removeClass('draggable');
*/
    }
  });

});
