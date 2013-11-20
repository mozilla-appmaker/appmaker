/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(
  ["/ceci/ceci-designer.js", "jquery", "designer/utils"],
  function(Ceci, $, Util) {
    "use strict";

    // TODO: refactor this into a component
    function addComponentToTray(componentDefinition, name, list) {
      var thumbnail = componentDefinition.thumbnail || '';
      var friends = componentDefinition.friends || [];
      var description = componentDefinition.description || 'No description available';

      var card = $('<div class="add-component component-card" name="'+name+'"><div class="add-tooltip">+</div></div>');
      var tagList = componentDefinition.tags;

      card.data("tags",tagList);
      card.attr("show",true);

      var descriptionColumn = $('<div class="component-description"><h1>' + Util.prettyName(name) + '</h1><h6>'+ description +'</h6></div>');
      var preview = $('<div class="component-preview"><div class="image-wrapper">' + thumbnail + '</div><div class="add-component-overlay"></div></div>');

      var friendList = $('<div class="friends"><h3>Friends</h3></div>');

      if (friends.length > 0) {
        friends.forEach(function (friend) {
          friendList.append($('<a>'+ friend +'</a>'));
        });
      } else {
        friendList.append($('<div>No Friends<div>'));
      }

      var author = $('<div class="author"><h5>By: Joe Thomas | Last edited 8/12/13</h5></div>');
      var tags = $('<div class="tags clearfix"><div class="tag">Animation</div></div>');
      var moreInfo = $('<div class="more-info"></div>');
      var showMore = $('<a class="show-more" href="#">More Info</a>');

      moreInfo.append(friendList);
      moreInfo.append(tags);
      moreInfo.append(author);
      card.append(preview);

      descriptionColumn.append(moreInfo);

      card.append(descriptionColumn);
      card.append(showMore);

      list.append(card);
    }

    Ceci.forEachComponent(function(name, component){
      addComponentToTray(component.prototype.ceci, name, $('#components'));
    });
  }
);


