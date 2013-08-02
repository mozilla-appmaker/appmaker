define(function(){
  var Ceci = function (element, def) {

    Object.keys(def).filter(function (item) { return reserved.indexOf(item) === -1; }).forEach(function (key) {
      var entry = def[key];
      if (typeof entry === 'function') {
        element[key] = entry;
      }
    });

    Object.keys(def.editable).forEach(function (key) {
      var entry = def.editable[key];
      var entryType = typeof entry;
      var scopedEntry = '_' + key;

      if (entryType === 'function') {
        Object.defineProperty(element, key, {
          set: function (val) {
            element[scopedEntry] = val;
            entry.call(element, val);
          },
          get: function () {
            return element[scopedEntry];
          }
        });
      }
      else if (entryType === 'object') {
        Object.defineProperty(element, key, {
          set: entry.set,
          get: entry.get
        });
      }
    });

    element.emit = function (type, data) {
      var customEvent = document.createEvent('CustomEvent');
      customEvent.initCustomEvent('app-' + type, false, false, data);
      element.dispatchEvent(customEvent);
    };

    element.avast = function (to, my, be) {
      var avastElement = document.createElement('avast');
      avastElement.setAttribute('to', to);
      avastElement.setAttribute('my', my);
      avastElement.setAttribute('be', be);
      parseAvastElement(avastElement);
    };

    element.init = function() {
      if (def.init) {
        def.init.call(element);
      }
    };
  }
  
  Ceci.reserved = ['init', 'editable'];

  Ceci.parseAvastElement = function (avastElement) {
      var toElement = document.querySelector(avastElement.getAttribute('to'));
      var myType = avastElement.getAttribute('my');
      var beType = avastElement.getAttribute('be');
      if (toElement) {
        element.addEventListener('app-' + myType, function (e) {
          toElement[beType] = e.data || e.detail;
        }, false);
      }
    };

  Ceci._components = {};

  Ceci.faire = function (element) {
    var def = Ceci._components[element.localName];

    var avastElements = element.querySelectorAll('avast');

    element._innerHTML = element.innerHTML;
    element._innerText = element.innerText;

    if (def.template){
      element.innerHTML = def.template.innerHTML;
    }

    def.contructor.call(element);

    Array.prototype.forEach.call(avastElements, function (avastElement) {
      element.avast( avastElement.getAttribute('to'),
                             avastElement.getAttribute('my'),
                             avastElement.getAttribute('be'));
    });

    element.init();
  };

  Ceci.avoir = function (element) {
    var name = element.getAttribute('name');
    var template = element.querySelector('template');
    var script = element.querySelector('script[type="text/ceci"]');
    var contructor = new Function(script.innerHTML);

    Ceci._components[name] = {
      template: template,
      contructor: contructor,
    };

    var existingElements = document.querySelectorAll(name);
    Array.prototype.forEach.call(existingElements, function (existingElement) {
      Ceci.faire(existingElement);
    });
  };

  Ceci.commencer = function (callback) {
    function scrape () {
      Array.prototype.slice.call(document.querySelectorAll('element')).forEach(Ceci.avoir);
    }

    var ceciScripts = document.querySelectorAll('script[data-ceci-components]');

    if (ceciScripts.length) {
      var scriptsLeft = ceciScripts.length;
      Array.prototype.forEach.call(ceciScripts, function (ceciScript) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', ceciScript.getAttribute('data-ceci-components') ,true);
        xhr.onload = function (e) {
          var fragment = document.createElement('div');
          fragment.innerHTML = xhr.response;
          if (document.body.firstChild) {
            document.body.insertBefore(fragment, document.body.firstChild);
          }
          else {
            document.body.appendChild(fragment); 
          }
          if (--scriptsLeft === 0) {
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
  
  return Ceci
});
