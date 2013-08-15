define(function() {

  var getChannel = function(name) {
    return "flathead:" + name;
  }

  var Ceci = function (element, def) {

    Object.keys(def).filter(function (item) {
      return Ceci._reserved.indexOf(item) === -1;
    }).forEach(function (key) {
      var entry = def[key];
      if (typeof entry === 'function') {
        element[key] = entry;
      }
    });

    var defaultListener = def.defaultListener;
    if (!defaultListener) {
      defaultListener = Object.keys(def.listeners)[0];
    }
    element.defaultListener = defaultListener;

    element.subscriptionListeners = [];

    Object.keys(def.listeners).forEach(function (key) {
      var entry = def.listeners[key];
      var entryType = typeof entry;

      if (entryType === 'function') {
        element[key] = entry;
        element.subscriptionListeners.push(key);
      }
      else {
        throw "Listener \"" + key + "\" is not a function.";
      }
    });

    element.emit = function (data) {
      var e = new CustomEvent(getChannel(element.broadcastChannel), {bubbles: true, detail: data});
      element.dispatchEvent(e);
      // console.log(element.id + " -> " + element.broadcastChannel);
    };

    element.init = function() {
      if (def.init) {
        def.init.call(element);
      }
    };

    Ceci._plugins.constructor.forEach(function(plugin) {
      plugin(element, def);
    });
  }

  Ceci._reserved = ['init', 'listeners', 'defaultListener'];

  Ceci.reserveKeyword = function(keyword) {
    Ceci._reserved.push(keyword);
  }

  Ceci._plugins = {
    constructor: []
  }

  Ceci.registerCeciPlugin = function(eventName, plugin) {
    Ceci._plugins[eventName].push(plugin);
  }

  Ceci.defaultChannel = "blue";

  Ceci._components = {};

  function getBroadcastChannel(element) {
    var broadcast = element.getElementsByTagName('broadcast')[0];
    if (broadcast){
      var channel = broadcast.getAttribute("on");
      if (channel) {
        return channel;
      }
    }
    return Ceci.defaultChannel;
  }

  function getSubscriptions(element, original) {
    var subscriptions = original.getElementsByTagName('listen');
    subscriptions = Array.prototype.slice.call(subscriptions);

    if(subscriptions.length === 0) {
      return [{
        listener: element.defaultListener,
        channel: Ceci.defaultChannel
      }];
    }

    subscriptions = subscriptions.map(function (e) {
      var channel = e.getAttribute("on");
      var listener = e.getAttribute("for");

      return {
        listener: listener,
        channel: (channel ? channel : Ceci.defaultChannel)
      };
    });

    return subscriptions;
  }

  function setupBroadcastLogic(element, original) {
    // get <broadcast> rules from the original declaration
    element.broadcastChannel = getBroadcastChannel(original);
    // set property on actual on-page element
    element.setBroadcastChannel = function(channel) {
      element.broadcastChannel = channel;
    }
  }

  function setupSubscriptionLogic(element, original) {
    // get <listen> rules from the original declaration
    element.subscriptions = getSubscriptions(element, original);
    // set properties on actual on-page element
    element.setSubscription = function(channel, listener) {
      var append = true;
      element.subscriptions.forEach(function(s) {
        if(s.listener === listener) {
          s.channel = channel;
          append = false;
        }
      });
      if(append) {
        element.subscriptions.push({
          listener: listener,
          channel: channel
        });
      }
    };
    element.removeSubscription = function(channel, listener) {
      e.subscriptions = e.subscriptions.filter(function(s) {
        return !(s.channel === channel && s.listener === listener);
      })
    };
  }

  Ceci.convertElement = function (element) {
    var def = Ceci._components[element.localName],
        original = element.cloneNode(true);

    // real content
    element._innerHTML = element.innerHTML;
    element._innerText = element.innerText;
    if (def.template){
      element.innerHTML = def.template.innerHTML;
    }

    def.contructor.call(element, def.initParams | {});

    // channel logic
    setupBroadcastLogic(element, original);
    setupSubscriptionLogic(element, original);

    element.subscriptions.forEach(function (subscription) {
      console.log(
        "Adding event listener for",
        element.id + '.' + subscription.listener + '(<data>)',
        "on",
        subscription.channel
      );
      document.addEventListener(getChannel(subscription.channel), function(e) {
        if(e.target !== element) {
          // console.log(element.id + " <- " + subscription.channel);
          element[subscription.listener](e.detail, subscription.channel);
        }
        return true;
      })
    });

    element.init();
  };

  Ceci.processComponent = function (element) {
    var name = element.getAttribute('name');
    var template = element.querySelector('template');
    var script = element.querySelector('script[type="text/ceci"]');

    try{
      var generator = new Function("Ceci", "return function() {" + script.innerHTML+ "}");
    }
    catch(e){
      if (e.name === 'SyntaxError') {
        e.message += " in definition of component \"" + name + "\".";
        throw e;
      }
      else {
        throw e;
      }
    }
    var contructor = generator(Ceci);

    Ceci._components[name] = {
      template: template,
      contructor: contructor
    };

    var existingElements = document.querySelectorAll(name);
    Array.prototype.forEach.call(existingElements, function (existingElement) {
      Ceci.convertElement(existingElement);
    });
  };

  Ceci.load = function (callback) {
    function scrape (callback) {
      var elements = document.querySelectorAll('element');
      elements = Array.prototype.slice.call(elements);
      elements.forEach(Ceci.processComponent);
      if (callback){
        callback(Ceci._components);
      }
    }

    var ceciLinks = document.querySelectorAll('link[rel=component][type="text/ceci"]');

    if (ceciLinks.length) {
      var linksLeft = ceciLinks.length;
      Array.prototype.forEach.call(ceciLinks, function (componentLink) {
        var xhr = new XMLHttpRequest(),
            docURL = componentLink.getAttribute('href');
        xhr.open('GET', docURL ,true);
        xhr.onload = function (e) {
          var fragment = document.createElement('div');
          fragment.innerHTML = xhr.response;
          if (document.body.firstChild) {
            document.body.insertBefore(fragment, document.body.firstChild);
          }
          else {
            document.body.appendChild(fragment);
          }
          if (--linksLeft === 0) {
            scrape(callback);
          }
        };
        xhr.send(null);
      });
    }
    else {
      scrape(callback);
    }
  };

  return Ceci;
});
