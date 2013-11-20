/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([], function() {
  "use strict";

  var BUILT_IN_COMPONENTS = [
    "polymer-element",
    "ceci-app",
    "ceci-broadcast",
    "ceci-card",
    "ceci-element",
    "ceci-element-base",
    "ceci-listen"
  ];

  // Because of the way requirejs works, this is a singleton.
  var CeciDesigner = {
    // It's expected that the channel object being sent has a .id to uniquely identify it.
    addChannels: function(channels){
      var self = this;
      Array.prototype.forEach.call(channels, function(channel) {
        self.addChannel(channel);
      });
    },
    addChannel: function(channel){
      if (typeof channel !== 'object' || !("id" in channel)){
        throw new TypeError("Channel \"id\" missing.");
      }
      this.channels[channel.id] = channel;
      return this;
    },
    forEachChannel: function(fn){
      for (var x in this.channels){
        fn(this.channels[x]);
      }
      return this;
    },
    getRegisteredComponents: function(){
      var components = [];
      for (var tagName in window.CustomElements.registry){
        if (BUILT_IN_COMPONENTS.indexOf(tagName) === -1){
          components.push(window.CustomElements.registry[tagName]);
        }
      }
      return components;
    },
    forEachComponent: function(fn){
      var components = this.getRegisteredComponents();
      for (var x in components){
        fn(components[x].name, components[x]);
      }
      return this;
    }
  };

  CeciDesigner.channels = {};

  return CeciDesigner
});
