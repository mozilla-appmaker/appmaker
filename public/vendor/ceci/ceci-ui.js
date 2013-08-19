define(["ceci"], function(Ceci) {

  var colorBlock = document.createElement("div");
  colorBlock.setAttribute("class", "channel-visualisation");
  colorBlock.innerHTML = "<div class='broadcast-channels'></div>"+
                         "<div class='subscription-channels'></div>";
  var channelBlock = document.createElement("div");
  channelBlock.setAttribute("class", "channel");

  var setChannelIndicator = function(element, type, channel, listener) {
    // do we need to add the visualisation block?
    if(!element.querySelector(".channel-visualisation")) {
      element.appendChild(colorBlock.cloneNode(true));
    }
    // get the selector for the element whose color we need to change
    var sel = "." + type + "-channels",
        lsel = sel + " .channel" + (listener ? '.' + listener : ''),
        cblock;

    if(!element.querySelector(lsel)) {
      cblock = channelBlock.cloneNode(true);
      if(listener) {
        cblock.classList.add(listener);
      }
      element.querySelector(sel).appendChild(cblock);
    }
    // set relevant channel color, or remove if disabled
    var channelElement = element.querySelector(lsel);
    if(channel === Ceci._emptyChannel) {
      channelElement.parentNode.removeChild(channelElement);
    } else {
      channelElement.style.color = channel;
    }
  };

  var CeciUI = function(element, def) {
    var elementAttributes = {},
        editableAttributes = [];

    var bindAttributeChanging = function(target, attrName, fallthrough) {
      // value tracking as "real" value
      var v = false,
          get = function() { return v; },
          set = function(v) {
            target.setAttribute(attrName, v);
          };
      Object.defineProperty(target, attrName, { get: get, set: set });

      // feedback and mutation observing based on HTML attribute
      var handler = function(mutations) {
            mutations.forEach(function(mutation) {
              v = target.getAttribute(attrName);
              fallthrough.call(target, v);
            });
          },
          observer = new MutationObserver(handler),
          config = { attributes: true, attributeFilter: [attrName] };
      observer.observe(target, config);
    };

    if (def.editable) {
      Object.keys(def.editable).forEach(function (key) {
        var props = def.editable[key];
        bindAttributeChanging(element, key, props.edit);
        editableAttributes.push(key);
        eak = {};
        Object.keys(props).forEach(function(pkey) {
          if (pkey === "edit") return;
          eak[pkey] = props[pkey];
        })
        elementAttributes[key] = eak;
      });
    }

    element.getEditableAttributes = function() {
      return editableAttributes;
    };

    element.getAttributeDefinition = function(attrName) {
      return elementAttributes[attrName];
    };

    element.onBroadcastChannelChanged = function(channel) {
      setChannelIndicator(element, 'broadcast', channel);
    };

    element.onSubscriptionChannelChanged = function(channel, listener) {
      setChannelIndicator(element, 'subscription', channel, listener);
    };
  }

  // register ourselves with Ceci
  Ceci.reserveKeyword("editable");
  Ceci.registerCeciPlugin("constructor", CeciUI);

  // return this plugin, for good measure
  return CeciUI;
});
