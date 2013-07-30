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
		var thumb = $('<div class="row clearfix"><div class="input"></div><div class="draggable" style="border-color:'+ bordercolor +'" value="' + tag + '">' + tag + '</div><div class="output"></div></div>')
		$('.tray').append(thumb)
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
		$('.tooltip').css({'top': offset.top, 'left': posleft})
		$('.tooltip').show()
	}).mouseout(function () {
		$('.tooltip').hide()
	})

	$('.output').click(function () {
    	$('.modal-wrapper').addClass('flex')
    	$('.tooltip').hide()
	})

	$('.close-modal').click(function () {
    	$('.modal-wrapper').removeClass('flex');
    })

}