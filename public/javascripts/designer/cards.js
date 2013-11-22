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
    $('.cards').on("click", ".delete-card",function(event){
      event.stopPropagation();
      var tab = $(this).closest(".card");
      var index = tab.index();
      if (window.confirm("Delete this Page?")) {
         tab.remove();
         app.removeCard(index);
       }
       adjustCardNames();
     });

    function addCardTab (card) {
      var newthumb = $('<div class="card"><span class="card-name"></span><a title="Delete this card" href="#" class="delete-card"></a></div>');
      newthumb.click(function(e) {
        if (e.toElement.className === "delete-card") return;
        card.show();
      });
      $(".card-list").append(newthumb);
      card.show();
      adjustCardNames();
    }

    // Adjusts card tab names after delete / add actions.
    function adjustCardNames(){
      var i = 1;
      cardList.find(".card").each(function(){
        $(this).find(".card-name").text("Page " + i);
        i++;
      });
    }

    function checkAppForExistingCards () {
      var cards = app.querySelectorAll('ceci-card');
      Array.prototype.forEach.call(cards, addCardTab);
    }

    // Add a card tab when app notifies that a card was added to the app.
    app.addEventListener('cardAdded', function (e) {
      addCardTab(e.detail);
    }, false);

    // Do it now, but also wait for "ready" event, in case we're too early.
    app.addEventListener('ready', checkAppForExistingCards, false);
    checkAppForExistingCards();
  }
);
