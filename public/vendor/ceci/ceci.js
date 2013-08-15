define(["ceci"], function(Ceci) {

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
    }

    element.getAttributeDefinition = function (attrName) {
      return elementAttributes[attrName];
    }
  }

  // register ourselves with Ceci
  Ceci.reserveKeyword("editable");
  Ceci.registerCeciPlugin("constructor", CeciUI);

  // return this plugin, for good measure
  return CeciUI;
});
