/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
define(["jquery", "angular", "ceci", "jquery-ui"], function($, ng, Ceci) {
  // TODO: Fix this, we're essentially working around require.js.
  // This is gross and shouldn't happen, it's 

  var listComponents = function () {
    var i = 0;
    Components.scan()
    Components.tags.forEach(function (tag, e) {
      var thumb = $('<div class="clearfix inlib" value="' + tag + '"><div class="thumb" value="' + tag + '">' + tag.replace('moz-', '') + '</div></div>');
      $('.library-list').append(thumb);
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

  listComponents();
  listColors(); 

  $(document).on('click', '.output, .input', function () {
    $('.selected').removeClass('selected')
    $('.color-modal').addClass('flex');
    $('.tooltip').hide();
    $(this).addClass('selected');
  });

  $(document).on('click', '.color', function () {
    var channel = $(this).attr('value');
    $('.selected').children().css({'color': channel})
    var id = $('.selected').attr('belongsTo');
    var isInput = $('.selected').hasClass('input')
    if (isInput) {
      $('.thumb[name='+id+'], #'+id).attr('listen-to', channel)
    }else {
      $('.thumb[name='+id+'], #'+id).attr('broadcast-to', channel)
    }
    $('.output-options').removeClass('flex');
    $('.color-modal').removeClass('flex');
    $('.library').removeClass('flex');
  })

  $(document).on('keydown', function(event) {
    if (event.which == 27) {
      $('.color-modal').removeClass('flex');
    }
  })

  //logs messages
  $(document).on('broadcast', function (event, message) {
    $('.log .inner p').append('<div>' + message + '</div>')
    console.log(message)
  })

      $('.phone-canvas').droppable({
        accept: '.draggable',
        drop: function (event, ui) {
          var componentname = $(ui.helper).attr('value')
          var componentId = $(ui.helper).attr('name')
          var component = $('<' + componentname + '></' + componentname + '>');
          component.attr('id', componentId)
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

      $('#open-library').click(function () {
        $('.library').addClass('flex');
        $('.tooltip').hide();
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
        var broadcasts = $('template#' + tagName).attr('broadcasts') !== undefined
        var listens = $('template#' + tagName).attr('ondblclick') !== undefined
        console.log('%s broadcasts: %s', tagName, broadcasts)
        console.log('%s listens: %s', tagName, listens)
        var id = 'component' + new Date().getTime()
        if (broadcasts) {
          clone.prepend('<div class="holder"></div>')
          clone.append('<div class="output" belongsTo="'+id+'"><span class="icon-feed"></div>')
        }

        if (listens) {
          clone.prepend('<div class="input" belongsTo="'+id+'"><span class="icon-headphones"></span></div>')
          clone.append('<div class="holder"></div>')
        }

        clone.removeClass('inlib')
        clone.find('.thumb').draggable({
          appendTo: ".phone-canvas",
          helper: "clone",
          addClass: "clone"
        })
        .attr('name', id)
          .addClass('draggable');
        $('.tray').append(clone);
      });

});
