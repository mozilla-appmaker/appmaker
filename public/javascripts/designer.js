/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
define(["jquery", "angular", "ceci", "jquery-ui"], function($, ng, Ceci) {
  // TODO: Fix this, we're essentially working around require.js.
  // This is gross and shouldn't happen, it's 

 
  var colors = ['#358CCE', '#e81e1e', '#e3197b', '#27cfcf', '#e8d71e', '#ff7b00', '#71b806'];

  var inputcolors = ['#358CCE'];

  var listColors = function () {
    var i = 0;
    for (var i; i < colors.length; i++) {
    $('.color-options').append('<div class="color" value="'+ colors[i] +'" style="background-color: '+ colors[i] +'"></div>')
    $('.input-channels').append('<div class="input-color" value="'+ colors[i] +'" style="background-color: '+ colors[i] +'"></div>')
    }
  }

  listColors(); 

  var componentselected;

  $(document).on('click', '.output', function () {
    $('.output-options').addClass('flex');
    $('.tooltip').hide();

    // Stores selected thumb
    componentselected = $(this).prev('.thumb')
  });

  $(document).on('click', '.input', function () {
    $('.input-options').addClass('flex');
    $('.tooltip').hide();

    // Stores selected thumb
    componentselected = $(this).next('.thumb')
  })

  $(document).on('click', '.color', function () {
    var channel = $(this).attr('value');
    inputcolors.push(channel)
    $(componentselected).next().children().css({'color': channel})
    // Adds new attribute broadcast-to to selected thumb
    componentselected.attr('broadcast-to', channel)
    if ($(componentselected.attr('value')).length > 0) {
      $(componentselected.attr('value')).attr('broadcast-to', channel)
    }
    $('.output-options').removeClass('flex');
  })

  $(document).on('click', '.input-color', function () {
    var channel = $(this).attr('value');
    console.log(componentselected)
    $(componentselected).prev().children().css({'color': channel})
    // Adds new attribute broadcast-to to selected thumb
    componentselected.attr('listen-to', channel)
    if ($(componentselected.attr('value')).length > 0) {
      $(componentselected.attr('value')).attr('listen-to', channel)
    }
    $('.input-options').removeClass('flex');
  })

  var listComponents = function () {
    var i = 0;
    Components.scan()
    Components.tags.forEach(function (tag, e) {
      var thumb = $('<div class="clearfix inlib" value="' + tag + '"><div class="thumb" value="' + tag + '">' + tag.replace('moz-', '') + '</div></div>');
      $('.library-list').append(thumb);
      i++;
    });
  }

  listComponents();

  //logs messages
  $(document).on('broadcast', function (event, message) {
    $('.log .inner p').append('<div>' + message + '</div>')
    console.log(message)
  })

      $( ".draggable" ).draggable({
        appendTo: ".phone-canvas",
        helper: "clone",
        addClass: "clone",
        snap: true,
        snapTolerance: 5
      });

      $('.phone-canvas').droppable({
        accept: '.draggable',
        drop: function (event, ui) {
          var componentname = $(ui.helper).attr('value')
          var component = $('<' + componentname + '></' + componentname + '>');
          var broadcasts = $('template#' + componentname).attr('broadcasts') !== undefined
          var listens = $('template#' + componentname).attr('ondblclick') !== undefined
          if (broadcasts) {
            var broadcastChannel = $(ui.helper).attr('broadcast-to')
            component.attr('broadcast-to', broadcastChannel)
          }
          if (listens) {
            console.log('yes')
            var listenChannel = $(ui.helper).attr('listen-to')
            component.attr('listen-to', listenChannel)
          }
          $(this).append(component);
          Components.replace()
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

      $('#open-library').click(function () {
        $('.library').addClass('flex');
        $('.tooltip').hide();
      })

      $('.close-modal').click(function () {
        $('.output-options').removeClass('flex');
        $('.input-options').removeClass('flex');
        $('.library').removeClass('flex');
      });

      $('.btn-done').click(function () {
        $('.output-options').removeClass('flex');
        $('.library').removeClass('flex');
      });

      $('.inlib').click(function () {
        var clone = $(this).clone()
        var tagName = $(this).attr('value')
        var broadcasts = $('template#' + tagName).attr('broadcasts') !== undefined
        var listens = $('template#' + tagName).attr('ondblclick') !== undefined
        console.log('%s broadcasts: %s', tagName, broadcasts)
        console.log('%s listens: %s', tagName, listens)

        if (broadcasts) {
          clone.prepend('<div class="holder"></div>')
          clone.append('<div class="output"><span class="icon-feed"></div>')
        }

        if (listens) {
          clone.prepend('<div class="input"><span class="icon-headphones"></span></div>')
          clone.append('<div class="holder"></div>')
        }

        clone.removeClass('inlib')
        clone.find('.thumb').draggable({
          appendTo: ".phone-canvas",
          helper: "clone",
          addClass: "clone",
          snap: true,
          snapTolerance: 5
        })
          .addClass('draggable');
        $('.tray').append(clone);
      });

});
