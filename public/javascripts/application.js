/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


$(document).ready( function () {
	Ceci.commencer(loadComponents)

})


var loadComponents = function () {
	_.each(Ceci._components, function (value, tag) {
	console.log(value)
	var thumb = $('<div class="row clearfix"><div class="input"></div><div class="draggable" value="' + tag + '">' + tag + '</div><div class="output"></div></div>')
	$('.tray').append(thumb)  
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
}