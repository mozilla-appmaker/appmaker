/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(
  ["jquery"],function($) {
    "use strict";
    var app = document.querySelector("ceci-app");

    var cardList = $(".card-list");

    $('.add-card').click(function(){
      document.querySelector("ceci-app").addCard();
    });

    // Show a card
    app.addEventListener('cardShown', function(data){
      cardList.find(".card").removeClass("selected");
      var card = data.detail;
      var cardIndex = $(card).index() + 1;
      var cardTab = cardList.find(".card:nth-child("+cardIndex+")");
      cardTab.addClass("selected");
    });

    // Delete a card
    $('.cards').on("click", ".delete-card",function(){
      var tab = $(this).closest(".card");
      var index = tab.index();
      if (window.confirm("Delete this Page?")) {
         tab.remove();
         app.removeCard(index);
       }
       adjustCardNames();
     });

    // Add a card
    app.addEventListener('cardAdded', function(data){
      var card = data.detail;
      var newthumb = $('<div class="card"><span class="card-name"></span><a title="Delete this card" href="#" class="delete-card"></a></div>');
      newthumb.click(function() {
        card.show();
      });
      $(".card-list").append(newthumb);
      card.show();
      adjustCardNames();
    });

    // Adjusts card tab names after delete / add actions.
    function adjustCardNames(){
      var i = 1;
      cardList.find(".card").each(function(){
        $(this).find(".card-name").text("Page " + i);
        i++;
      });
    }

  }
);
