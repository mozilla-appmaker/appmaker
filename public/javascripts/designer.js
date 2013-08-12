/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
define(["jquery", "angular", "ceci", "ceci-ui", "jquery-ui"], function($, ng, Ceci) {
  // TODO: Fix this, we're essentially working around require.js.
  // This is gross and shouldn't happen, it's 

  var selection = [];
  var defaultChannel = "#358CCE"; /* matches what's in style.css */
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

  function Channel(name, hex) {
    this.name = name;
    this.hex = hex;
  }

  var listChannels = function () {
    var radio = new Array()
    radio[0] = new Channel('Blue Moon', '#358CCE')
    radio[1] = new Channel('Red Baloon', '#e81e1e')
    radio[2] = new Channel('Pink Heart', '#e3197b')
    radio[3] = new Channel('Purple Horseshoe', '#9f27cf')
    radio[4] = new Channel('Green Clover', '#71b806')
    radio[5] = new Channel('Yellow Pot of Gold', '#e8d71e')
    radio[6] = new Channel('Orange Star', '#ff7b00')
    //var colors = ['#358CCE', '#e81e1e', '#e3197b', '#27cfcf', '#e8d71e', '#ff7b00', '#71b806'];
    var i = 0;
    for (var i; i < radio.length; i++) {
    $('.channel-options').append('<div class="color" value="'+ radio[i].hex +'" name="'+ radio[i].name +'" style="background-color: '+ radio[i].hex +'"></div>')
    }
  }


  var clearSelection = function() {
      selection = [];
      $(".selected").removeClass("selected");
      $(".inspector").addClass('hidden');
      disableReorder();
  }

  var sortable;
  var enableReorder = function() {
    $(".phone-canvas").disableSelection();
    sortable = $(".phone-canvas").sortable({
      placeholder: "ui-state-highlight"
    });
  }

  var disableReorder = function() {
    return; // XXX
    $(".phone-canvas").sortable("disable");
  }

  var mode;

  var buildMode = function() {
    $(".play").removeClass("on");
    $(".build").addClass("on");
    mode = 'build';
    enableReorder();
    $(".tray").css('visibility', 'visible');
    $(".log").hide();
    $(".cards").show();
    disableComponents($(".phone-canvas").find("*"));
  }

  var disableComponents = function(elts) {
    $.each(elts, function(i,elt) {
      elt.onclick_ = elt.onclick;
    });
    elts.removeAttr('onclick');
  }

  var enableComponents = function(elts) {
    $.each(elts, function(i,elt) {
      if (elt.onclick_) {
        elt.onclick = elt.onclick_;
      }
    });
    elts.removeAttr('onclick_');
  }

  var playMode = function() {
    $(".play").addClass("on");
    $(".build").removeClass("on");
    $(".tray").css('visibility', 'hidden');
    $(".cards").hide();
    $(".log").show();
    mode = 'play';
    clearSelection();
    disableReorder();
    enableComponents($(".phone-canvas").find("*"));
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
    if ($(evt.target).hasClass('container'))
      clearSelection();
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
        // XXX currently only deals with one-item selection.
        var selectedComponent = $("#" + selection[0]);
        // XXX this doesn't actually remove it completely? e.g. metronome keeps on ticking.
        selectedComponent.remove();
        clearSelection();
      }
    } else if (event.which == 9) { // tab
      if (mode == "play") { buildMode(); } 
      else { playMode(); }
      event.preventDefault();
    }
  });

  var selectComponent = function(comp) {
    clearSelection();
    moveToFront(comp);
    var currentChannel = comp[0].broadcastChannel
    var compId = comp.id
    selection = [compId];
    comp.addClass("selected");

    //Change component channel
    $(document).on('click', '.color', function () {
      var channel = $(this).attr('value');
      var name = $(this).attr('name');
      $('.inspector .selected-channel').css({'color': channel, 'border-color': channel})
      $('.inspector .selected-channel').text(name)
      var selectedComponent = $("#" + selection[0])
      var channelpicker = $(".inputoroutput");
      channelpicker.children().css({'color': channel})
      // var id = $('.selected').attr('belongsTo');
      var isInput = $('.inputoroutput').hasClass('input')
      if (isInput) {
        selectedComponent.attr('listen-to', channel)
      }else {
        selectedComponent.attr('broadcast-to', channel)
      }
    });

    // show its channels in the inspector
    var componentname = comp[0].tagName.toLowerCase();
    var broadcasts = $('template#' + componentname).attr('broadcasts') !== undefined
    var listens = $('template#' + componentname).attr('ondblclick') !== undefined
    $(".inspector .name").text(componentname);
    $('.inspector .selected-channel').text(currentChannel)
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
    $(".inspector").removeClass('hidden');
  }

  //logs messages
  $(document).on('broadcast', function (event, message) {
    var log = $('.log .inner p').append('<div>' + message + '</div>');
    var scroll = $(".scroll")[0];
    scroll.scrollTop = scroll.scrollHeight;
  });

  $('.phone-canvas').droppable({
    accept: '.draggable',
    drop: function (event, ui) {
      var componentname = $(ui.helper).attr('value');
      var componentId = genId($(ui.helper).attr('name'));
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
      Ceci.convertElement(component[0]);

      if (mode == "build") {
        disableComponents(component.find());
      }
      selectComponent(component);
      $('.thumb[name='+componentId+']').not(ui.helper).draggable( "disable" ).removeClass('draggable');
    }
  });

});
