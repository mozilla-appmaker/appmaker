define(function() {

  var getChannel = function(name) {
    return "flathead:" + name;
  }

  var Ceci = function (element, def) {

    var reserved = ['init', 'listeners', 'defaultListener'];

    Object.keys(def).filter(function (item) {
      return reserved.indexOf(item) === -1;
    }).forEach(function (key) {
      var entry = def[key];
      if (typeof entry === 'function') {
        element[key] = entry;
      }
    });

    Object.keys(def.listeners).forEach(function (key) {
      var entry = def.listeners[key];
      var entryType = typeof entry;

      if (entryType === 'function') {
        element[key] = entry;
      }
      else {
        throw "Listener \"" + key + "\" is not a function.";
      }
    });

    element.emit = function (data) {
      var customEvent = document.createEvent('CustomEvent');
      customEvent.initCustomEvent(getChannel(element.broadcastChannel), {bubbles: true});
      customEvent.data = data;
      element.dispatchEvent(customEvent);
      console.log(element.id + " -> " + element.broadcastChannel);
    };

    element.init = function() {
      if (def.init) {
        def.init.call(element);
      }
    };
  }

  Ceci.reserved = ['init', 'listeners', 'defaultListener', 'initParams'];
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

  function getSubscriptions(element) {
    var subscriptions = element.getElementsByTagName('listen');
    subscriptions = Array.prototype.slice.call(subscriptions);

    if(subscriptions.length===0) {
      // TODO: add the default;
      return [];
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
  };

  Ceci.convertElement = function (element) {
    var def = Ceci._components[element.localName];
    // data channels this element needs to hook into
    element.broadcastChannel = getBroadcastChannel(element);
    element.subscriptions = getSubscriptions(element);

    // real content
    element._innerHTML = element.innerHTML;
    element._innerText = element.innerText;
    if (def.template){
      element.innerHTML = def.template.innerHTML;
    }

    def.contructor.call(element, def.initParams | {});

    element.subscriptions.forEach(function (subscription) {

      console.log(
        "Adding event listener for",
        element.id + '.' + subscription.listener + '(<data>)',
        "on",
        subscription.channel
      );
      document.addEventListener(getChannel(subscription.channel), function(e) {
        if(e.target !== element) {
          console.log(element.id + " <- " + subscription.channel);
          element[subscription.listener](e.data, subscription.channel);
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

  Runner = function (callback) {
    function scrape () {
      var elements = document.querySelectorAll('element');
      elements = Array.prototype.slice.call(elements);
      elements.forEach(Ceci.processComponent);
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
            scrape();
            if (callback){
              callback();
            }
          }
        };
        xhr.send(null);
      });
    }
    else {
      scrape();
    }
  };

  return Runner;
});
