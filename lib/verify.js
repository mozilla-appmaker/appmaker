/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var fs = require('fs');
var jsdom = require('jsdom');

function cleanTag (tree) {
  cleanAttributes(tree);
}

function cleanAttributes (tree, acceptableAttribtues) {
  var attributesToRemove = [];

  for (var i = 0, l = tree.attributes.length; i < l; ++i) {
    var name = tree.attributes[i].name;
    if ( (acceptableAttribtues && acceptableAttribtues.indexOf(name) === -1)
      || ( name !== 'on' && 
         ( name.indexOf('on') === 0 || name.indexOf('On') === 0 || name.indexOf('oN') === 0
        || name.indexOf('ON') === 0) ) ) {
      attributesToRemove.push(name);
    }
  }
  while (attributesToRemove.length > 0) {
    tree.removeAttribute(attributesToRemove.shift());
  }  
}

function cleanContentSubTree (tree) {
  var output = '';
  var childOutput = '';
  if (tree._nodeName.indexOf('app-') === 0) {
    for (var i = 0, l = tree._childNodes.length; i < l; ++i) {
      childOutput += cleanContentSubTree(tree._childNodes[i]);
    }
    output += '<' + tree._nodeName + createAttributeString(tree) + '>' + childOutput + '</' + tree._nodeName + '>';
  }
  else if (tree._nodeName === '#text') {
    output += tree._nodeValue.replace(/[^\s]/g, '');
  }
  return output;
}

function checkTag (tree, tagName, attributes) {
  if (!tree || tree._nodeName !== tagName) {
    throw 'Invalid tag.';  
  }

  var attr;
  attributes = attributes || [];
  Object.keys(attributes).forEach(function (name) {
    var expectedValue = attributes[name];
    var inputAttribute = tree.attributes[name];

    if (name === 'id') {
      if (expectedValue !== inputAttribute.value) {
        throw 'Attribute "' + 'id' + '" does not match: ' + attributes[name];
      }
    }
    else {
      if (inputAttribute.value.indexOf(expectedValue) === -1) {
        throw 'Attribute "' + name + '" does not match: ' + expectedValue + ', ' + inputAttribute.value;
      }
    }
  });
}

function siftThroughChildren (childNodes, childFunction) {
  var childrenToRemove = [];
  Array.prototype.forEach.call(childNodes, function (child) {
    if (child._nodeName === '#text') {
      child._nodeValue.replace(/[^\s]/g, '');
    }
    else {
      if (!childFunction(child)) {
        childrenToRemove.push(child);
      }
    }
  });
  while (childrenToRemove.length > 0) {
    var child = childrenToRemove.shift();
    child.parentNode.removeChild(child);
  }
}

function filterApp (tree) {
  checkTag(tree, 'div', { id: 'flathead-app' });
  cleanTag(tree);

  if (tree._childNodes) {
    siftThroughChildren(tree._childNodes, filterCard);
  }
  else {
    throw "No children!";
  }

  return tree;
}

function filterCard (tree) {
  checkTag(tree, 'div', { class: 'ceci-card' });
  cleanTag(tree);

  var childClasses = ['fixed-top', 'phone-canvas', 'fixed-bottom'];
  if (tree._childNodes) {
    siftThroughChildren(tree._childNodes, function (child) {
      return filterSection(child, childClasses.shift());
    });
    return true;
  }
  else {
    throw "No children!";
  }
}

function filterSection (tree, name) {
  checkTag(tree, 'div', { class: name });
  cleanTag(tree);

  if (tree._childNodes) {
    siftThroughChildren(tree._childNodes, filterComponent);
  }
  return true;
}

function filterSubscription (tree) {
  cleanAttributes(tree, ['on', 'for']);
  siftThroughChildren(tree._childNodes, function (child) {
    cleanAttributes(child, ['color']);
  });
  return true;
}

function filterComponent (tree) {
  if (tree._nodeName.indexOf('app-') === 0) {
    if (tree._childNodes) {
      siftThroughChildren(tree._childNodes, filterComponent);
      return true;
    }
  }
  else if (['broadcast', 'listen'].indexOf(tree._nodeName) > -1) {
    return filterSubscription(tree);
  }

  return false;
}

module.exports = {
  filter: function (html, callback) {
    html = html.replace(/<script>[\s.]*<\/script>/g, '');

    jsdom.env(html, {
      done: function (errors, window) {
        var inputDocument = window.document;
        var inputNode = inputDocument.firstChild;
        var output = null;

        var appDiv = inputNode.firstChild.firstChild;

        try {
          output = filterApp(appDiv).outerHTML;
        }
        catch (e) {
          console.error(e);
          throw e;
        }

        callback(output);
      }
    });
  } 
};