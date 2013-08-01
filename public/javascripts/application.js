/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


$(document).ready( function () {
	Ceci.commencer(loadComponents)
})


var loadComponents = function () {
	var colors = ['#358CCE', '#ff7b00', '#b4e319', '#e3197b']
	var i = 0;
	_.each(Ceci._components, function (value, tag) {
		var bordercolor = colors[i]
		var thumb = $('<div class="row clearfix inlib"><div class="thumb" style="border-color:'+ bordercolor +'" value="' + tag + '">' + tag + '</div></div>')
		$('.library-list').append(thumb)
		i++ 
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
	    var component = $('<' + $(ui.helper).attr('value') + '></' + $(ui.helper).attr('value') + '>')
	    $(this).append(component)
	    Ceci.faire(component[0])
	  }
	})

	$('.output').mouseover(function () {
		var offset = $(this).offset()
		var posleft = offset.left + 40 + 'px'
		$('#tooltip-output').css({'top': offset.top, 'left': posleft})
		$('#tooltip-output').show()
	}).mouseout(function () {
		$('#tooltip-output').hide()
	})

	$('.input').mouseover(function () {
		var offset = $(this).offset()
		var posleft = offset.left + 40 + 'px'
		$('#tooltip-input').css({'top': offset.top, 'left': posleft})
		$('#tooltip-input').show()
	}).mouseout(function () {
		$('#tooltip-input').hide()
	})

	$('.output').click(function () {
    	$('.output-options').addClass('flex')
    	$('.tooltip').hide()
	})

	$('#open-library').click(function () {
    	$('.library').addClass('flex')
    	$('.tooltip').hide()
	})

	$('.close-modal').click(function () {
    	$('.output-options').removeClass('flex');
    	$('.library').removeClass('flex');
    })

    $('.inlib').click(function () {
    	var clone = $(this).clone()
    	clone.prepend('<div class="input"></div>')
    	     .append('<div class="output"></div>')
    		 .removeClass('inlib')
      	clone.find('.thumb').draggable({
	  		appendTo: ".phone-canvas",
	  		helper: "clone",
	  		addClass: "clone",
	  		snap: true,
	  		snapTolerance: 5
		}).addClass('draggable') 
    	$('.tray').append(clone)
    })

}