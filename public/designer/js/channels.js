/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// TODO: This file is required for its side-effects and doesn't export
// anything. We should be exporting a function instead so we can test
// this functionality.

var analytics = require('webmaker-analytics');

// internal map for tracking the connection graph for an app
var maps = {
  listen: {},
  broadcast: {}
};

/**
 * generic FindLoop wrapper.
 */
function findDirectionalLoop(channel, original, direction, seen) {
  var tracker = (direction === "forward" ? maps.listen : maps.broadcast),
      fn = (direction === "forward" ? "getActiveBroadcasts" : "getActiveListeners");
  function FindLoop(channel) {
    if(!channel) return false;
    var paths = tracker[channel] || [],
        next = [], node, i, j;
    for(i=paths.length-1; i>=0; i--) {
      node = paths[i];
      if(node === original) { seen.push(node); return true; }
      next = node[fn]();
      for(j=next.length-1; j>=0; j--) {
        node = next[j];
        if (FindLoop(node.on)) { seen.push(node._element); return true; }
      }
    }
    return false;
  }
  return FindLoop(channel);
}

/**
 * User tells E to listen on channel X
 *
 * FindLoop(X) :=
 * . for all broadcasters B for X:
 *   . if B eq E => loop found
 *   . else:
 *     . for each B:
 *       . for all listeners L with channel L.Y on B:
 *         . FindLoop(L.Y)
 */
function findListeningLoop(channel, original) {
  var seen = [];
  findDirectionalLoop(channel, original, "reverse", seen);
  return (seen.length === 0 ? false : seen);
}

/**
 * User tells E to broadcast on channel X
 *
     * FindLoop(X) :=
     * . for all listeners L for X:
     *   . if L eq E => loop found
     *   . else:
     *     . for each L:
     *       . for all broadcasts B with channel B.Y on L:
     *         . FindLoop(B.Y)
     */
function findBroadcastingLoop(channel, original) {
  var seen = [];
  findDirectionalLoop(channel, original, "forward", seen);
  return (seen.length === 0 ? false : seen.reverse());
}

/** Funnel to use the correct FindLoop algorithm
 *
 */
function findLoop(type, channel, element) {
  if (type === "listen") {
    return findListeningLoop(channel, element);
  }
  else if (type === "broadcast") {
    return findBroadcastingLoop(channel, element);
  }
  return false;
}

/**
 * When the "new app" button is pressed, we must make sure to clear the
 * channel mappings, because they're no longer applicable.
 */
window.addEventListener("resetcards", function clearMap(evt) {
  maps = {
    listen: {},
    broadcast: {}
  };
});

/**
 * Remove an element's listen and broadcast records when it leaves the DOM
 */
document.addEventListener("CeciElementRemoved", function forgetElement(evt) {
  var element = evt.detail, map, pos;
  Object.keys(maps).forEach(function(type) {
    map = maps[type];
    Object.keys(map).forEach(function(channel) {
      pos = map[channel].indexOf(element);
      if(pos > -1) {
        map[channel].splice(pos, 1);
      }
    });
  });
});

/**
 * Chronicle an element/channel binding when a channel update occurs
 */
window.addEventListener("CeciChannelUpdated", function buildConnectionGraph(evt) {
  var element = evt.target,
      data = evt.detail.detail,
      name = data.name,
      type = data.type,
      channel = data.channel,
      original = data.original,
      map = maps[type];

  if (!map[channel]) map[channel] = [];
  if (original) {
    var pos = map[original].indexOf(element);
    map[original].splice(pos,1);
  }
  if(channel) {
    var loop = findLoop(type, channel, element);
    if (loop) {
      console.warn("Warning: possible loop established. Element chain:", loop);
      if(analytics) {
        analytics.event("App with data loop");
      }
    }
    map[channel].push(element);
  }
});
