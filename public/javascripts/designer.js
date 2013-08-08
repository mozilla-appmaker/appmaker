/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
define(["jquery", "angular", "ceci", "jquery-ui"], function($, ng, Ceci) {
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


  var listComponents = function () {
    var i = 0;
    Components.scan()
    Components.tags.forEach(function (tag, e) {
      var thumb = $('<div class="clearfix inlib draggable" name="' + tag + '" value="' + tag + '"><div class="thumb" value="' + tag + '">' + tag.replace('moz-', '') + '</div></div>');
      $('.library-list').append(thumb);
      thumb.draggable({
        appendTo: ".phone-canvas",
        helper: "clone",
        addClass: "clone"
      })
      i++;
    });
  }

  var listColors = function () {
    var colors = ['#358CCE', '#e81e1e', '#e3197b', '#27cfcf', '#e8d71e', '#ff7b00', '#71b806'];
    var i = 0;
    for (var i; i < colors.length; i++) {
    $('.color-options').append('<div class="color" value="'+ colors[i] +'" style="background-color: '+ colors[i] +'"></div>')
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
  }

  var playMode = function() {
    $(".play").addClass("on");
    $(".build").removeClass("on");
    mode = 'play';
    clearSelection();
    disableReorder();
  }

  listComponents();
  listColors(); 
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

  $(document).on('click', '.output, .input', function () {
    $('.inputoroutput').removeClass('inputoroutput')
    $('.color-modal').addClass('flex');
    $('.tooltip').hide();
    $(this).addClass('inputoroutput');
  });

  $(document).on('click', '.container', function (evt) {
    if ($(evt.target).hasClass('container'))
      clearSelection();
  });

  $(document).on('click', '.color', function () {
    var channel = $(this).attr('value');
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
    $('.output-options').removeClass('flex');
    $('.color-modal').removeClass('flex');
  })


  $(document).on('keydown', function(event) {
    if (event.which == 27) {
      // escape hides all modal dialogs
      $('.color-modal').removeClass('flex');
      // and clears the selection non-destructively
      clearSelection();
    } else if (event.which == 8) {
      // delete removes the currently selected components and resets the selection
      if (selection) {
        // XXX currently only deals with one-item selection.
        var selectedComponent = $("#" + selection[0]);
        // XXX this doesn't actually remove it completely? e.g. metronome keeps on ticking.
        selectedComponent.remove();
        clearSelection();
      }
    }
  })

  //logs messages
  $(document).on('broadcast', function (event, message) {
    var log = $('.log .inner p').append('<div>' + message + '</div>');
    var scroll = $(".scroll")[0];
    scroll.scrollTop = scroll.scrollHeight;
  })

      $('.phone-canvas').droppable({
        accept: '.draggable',
        drop: function (event, ui) {
          var componentname = $(ui.helper).attr('value');
          var componentId = genId($(ui.helper).attr('name'));
          var component = $('<' + componentname + '></' + componentname + '>');
          component.attr('id', componentId)
          component.on('mousedown', function(evt) {
            if (mode == 'play') { 
              component.children('button').addClass('active'); // to replace :active which is otherwise impossible to intercept
            } else {
              clearSelection();
              var comp = $(evt.currentTarget);
              moveToFront(comp);
              var compId = evt.currentTarget.id
              selection = [compId];
              // select it
              comp.addClass("selected");

              // show its channels in the inspector
              var componentname = comp[0].tagName.toLowerCase();
              var broadcasts = $('template#' + componentname).attr('broadcasts') !== undefined
              var listens = $('template#' + componentname).attr('ondblclick') !== undefined
              $(".inspector .name").text(componentname);
              if (broadcasts) {
                var broadcastChannel = component.attr('broadcast-to')
                if (!broadcastChannel) {
                  broadcastChannel = defaultChannel;
                  component.attr('broadcast-to', broadcastChannel)
                }
                $("#outputBlock").show();
                $("#outputChannel").children().css({'color': broadcastChannel})
              } else {
                $("#outputBlock").hide();
              }
              if (listens) {
                var listenChannel = component.attr('listen-to')
                if (!listenChannel) {
                  listenChannel = defaultChannel;
                  component.attr('listen-to', listenChannel)
                }
                $("#inputBlock").show();
                $("#inputChannel").children().css({'color': listenChannel})
              } else {
                $("#inputBlock").hide();
              }
              $(".inspector").removeClass('hidden');
            }
          });
          component.on('mouseup', function(evt) {
            if (mode == 'play') {
              component.children('button').removeClass('active'); // to replace :active which is otherwise impossible to intercept
            } else {
              event.stopPropagation();
              event.preventDefault();
            }
          });
          $(this).append(component);
          Components.replace(); // ???
          $('.thumb[name='+componentId+']').not(ui.helper).draggable( "disable" ).removeClass('draggable');
        }
      });

      $(document).on('mouseover', '.output', function () {
        var offset = $(this).offset();
        var posleft = offset.left + 40 + 'px';
        $('#tooltip-output').css({'top': offset.top, 'left': posleft});
        $('#tooltip-output').show();
      }).on('mouseout', '.output', function () {
        $('#tooltip-output').hide();
      });

      $(document).on('mouseover', '.input', function () {
        var offset = $(this).offset();
        var posleft = offset.left + 40 + 'px';
        $('#tooltip-input').css({'top': offset.top, 'left': posleft});
        $('#tooltip-input').show();
      }).on('mouseout', '.input', function () {
        $('#tooltip-input').hide();
      })

      $('.close-modal').click(function () {
        $('.color-modal').removeClass('flex');
        $('.library').removeClass('flex');
      });

      $('.btn-done').click(function () {
        $('.output-options').removeClass('flex');
        $('.library').removeClass('flex');
      });


      $('.inlib').click(function () {
        var clone = $(this).clone()
        var tagName = $(this).attr('value')
        var id = 'component' + new Date().getTime()

        clone.removeClass('inlib')
        clone.find('.thumb').draggable({
          appendTo: ".phone-canvas",
          helper: "clone",
          addClass: "clone"
        })
        .attr('name', id)
          .addClass('draggable');
      });

});
