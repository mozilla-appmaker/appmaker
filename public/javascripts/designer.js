/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
define(["jquery", "angular", "ceci", "jquery-ui"], function($, ng, Ceci) {
  // TODO: Fix this, we're essentially working around require.js.
  // This is gross and shouldn't happen, it's 

      var colors = ['#358CCE', '#ff7b00', '#b4e319', '#e3197b']
      var i = 0;
      Components.scan()
      Components.tags.forEach(function (tag, e) {
        var bordercolor = colors[i];
        var thumb = $('<div class="clearfix inlib"><div class="thumb" style="border-color:'+ bordercolor +'" value="' + tag + '">' + tag + '</div></div>');
        $('.library-list').append(thumb);
        i++;
      });

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
          var component = $('<' + $(ui.helper).attr('value') + '></' + $(ui.helper).attr('value') + '>');
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

      $(document).on('click', '.output', function () {
        $('.output-options').addClass('flex');
        $('.tooltip').hide();
      });

      $('#open-library').click(function () {
        $('.library').addClass('flex');
        $('.tooltip').hide();
      })

      $('.close-modal').click(function () {
        $('.output-options').removeClass('flex');
        $('.library').removeClass('flex');
      });

      $('.btn-done').click(function () {
        $('.output-options').removeClass('flex');
        $('.library').removeClass('flex');
      });

      $('.inlib').click(function () {
        var clone = $(this).clone()
          .prepend('<div class="input"></div>')
          .append('<div class="output"></div>')
          .removeClass('inlib')
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
