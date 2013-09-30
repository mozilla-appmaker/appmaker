/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var fs = require('fs');
var jsdom = require('jsdom');

// from http://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
var voidTags = 'area, base, br, col, embed, hr, img, input, keygen, link, menuitem, meta, param, source, track, wbr'.split(', ');

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

function createAttributeString (tree) {
  var output = '';
  if (tree._attributes.length) {
    Object.keys(tree._attributes._nodes).forEach(function (name) {
      if (name !== 'style' && name.indexOf('on') !== 0 && name.indexOf('On') !== 0) {
        output += ' ' + name + '="' +  tree._attributes._nodes[name]._nodeValue + '"';
      }
    });
  }
  if (tree._style) {
    output += ' style="' + tree._style + '"';
  }
  return output;
}

function generateOpenTag (tree, childData) {
  var output = '';
  output += '<' + tree._nodeName;
  output += createAttributeString(tree);
  output += '>';
  return output;
}

function generateCloseTag (tree, childData) {
  var output = '';
  if (!!childData || voidTags.indexOf(tree._nodeName) === -1) {
    output += '</' + tree._nodeName + '>';
  }
  return output;
}

function checkTag (tree, tagName, attributes) {
  if (!tree || tree._nodeName !== tagName) {
    throw 'Invalid tag.';  
  }
  Object.keys(attributes).forEach(function (attr) {
    if (attr === 'id') {
      if (attributes[attr] !== tree._attributes._nodes[attr]._nodeValue) {
        throw 'Attribute "' + attr + '" does not match: ' + attributes[attr];
      }
    }
    else {
      if (tree._attributes._nodes[attr]._nodeValue.indexOf(attributes[attr]) === -1) {
        throw 'Attribute "' + attr + '" does not match: ' + attributes[attr] + ', ' + tree._attributes._nodes[attr]._nodeValue;
      }
    }
  });
}

function siftThroughChildren (childNodes, childFunction) {
  var output = '';
  Array.prototype.forEach.call(childNodes, function (child) {
    if (child._nodeName === '#text') {
      output += child._nodeValue.replace(/[^\s]/g, '');
    }
    else {
      output += childFunction(child);
    }
  });
  return output;
}

function filterApp (tree) {
  checkTag(tree, 'div', { id: 'flathead-app' });
  var output = generateOpenTag(tree);
  var childOutput = '';

  if (tree._childNodes) {
    childOutput += siftThroughChildren(tree._childNodes, filterCard);
  }
  else {
    throw "No children!";
  }

  return output + childOutput + generateCloseTag(tree);
}

function filterCard (tree) {
  checkTag(tree, 'div', { class: 'ceci-card' });
  var output = generateOpenTag(tree);
  var childOutput = '';
  var childClasses = ['fixed-top', 'phone-canvas', 'fixed-bottom'];
  if (tree._childNodes) {
    childOutput += siftThroughChildren(tree._childNodes, function (child) {
      return filterSection(child, childClasses.shift());
    });
  }
  else {
    throw "No children!";
  }
  return output + childOutput + generateCloseTag(tree);
}

function filterSection (tree, name) {
  checkTag(tree, 'div', { class: name });
  var output = generateOpenTag(tree);
  var childOutput = '';
  if (tree._childNodes) {
    childOutput += siftThroughChildren(tree._childNodes, filterComponent);
  }
  return output + childOutput + generateCloseTag(tree);
}

function filterBroadcast (tree) {
  var output = '<' + tree._nodeName;
  output += siftThroughChildren(tree._childNodes, function (child) {
    if (child._attributes._nodes['color']) {
      return ' color="' + child._attributes._nodes['color']._nodeValue + '"';
    }
    return '';
  });
  return output + '></' + tree._nodeName + '>';
}

function filterListen (tree) {
  var output = '';
  var color = null;
  siftThroughChildren(tree._childNodes, function (child) {
    console.log(child._attributes._nodes['color']);
    if (child._attributes._nodes['color']) {
      color = child._attributes._nodes['color']._nodeValue
    }
  });
  if (color) {
    return '<' + tree._nodeName + '></' + tree._nodeName + '>';
  }
  else {
    return '';
  }
}

function filterComponent (tree) {
  var output = '';
  if (tree._nodeName.indexOf('app-') === 0) {
    output = generateOpenTag(tree);
    var childOutput = '';
    if (tree._childNodes) {
      childOutput += siftThroughChildren(tree._childNodes, filterComponent);
    }
    return output + childOutput + generateCloseTag(tree);
  }
  else if (tree._nodeName === 'broadcast') {
    output += filterBroadcast(tree);
  }
  else if (tree._nodeName === 'listen') {
    output += filterListen(tree);
  }
  return output;
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
          output = filterApp(appDiv);
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