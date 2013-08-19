/*jshint node: true */
var fs = require('fs'),
    path = require('path'),
    q = require('q'),
    rjsScriptBlock = fs.readFileSync(__dirname + '/blocks/requirejs.html'),
    readFile = q.denodeify(fs.readFile);

var commentRegExp = /<!--[\s\S]*?-->/g,
    componentNameRegExp = /<(\w+\-\w+)\s/g,
    appLinkRegExp = /<link[^>]+href=\"\/\/appmaker-components.herokuapp.com\/package\/all"\s*>/,
    rjsScriptRegExp = /<script\s+src="[^"]+require.min.js">\s*<\/script>/,
    assetHostRegExp = /\{\{ASSET_HOST\}\}/;

function extractAssetsHtml(baseDir, filePath, text) {
  var result = {
    componentTags: [],
    pathContentMap: {}
  };

  // Remove all the HTML comments, for use in dependency scanning later.
  var noComments = self.removeHtmlComments(text);

  // Find all the HTML components in use
  var tags = self.getComponentTags(noComments);
  result.componentTags = tags;

  // Convert those components to file paths, and then
  // parse them for nested component dependencies.
  var tagPromises = [],
      tagPaths = [];
  if (tags.length) {
    tagPromises = tags.map(function(tag) {
      //Pull off the "app-" thing.
      tag = tag.substring(tag.indexOf('-') + 1);

      var tagPath = 'appmaker-components/components/' + tag + '.html';

      //Save base name of component for use in file rewriting.
      tagPaths.push(tagPath);

      return readFile(path.join(baseDir, tagPath), 'utf8').then(function(text) {
        return extractAssetsHtml(baseDir, tagPath, text);
      });
    });
  }

  // Merge the results of all the component scanning into
  // the final result.
  return q.spread(tagPromises, function() {
    var tagResultArray = [];
    if (arguments.length) {
      tagResultArray = Array.prototype.slice.call(arguments, 0);
    }

    tagResultArray.forEach(function(tagResult) {
      self.mergeResults(result, tagResult);
    });
  }).then(function() {
    // Generate rewritten content for this file.
    result.pathContentMap[filePath] = self.rewriteHtml(text,
                                                       tagPaths);

    return result;
  });
}
var self = extractAssetsHtml;

self.removeHtmlComments = function removeHtmlComments(text) {
  // This is a quick and easy way, could be
  // a problem with generic HTML, like text in
  // a textarea that has an HTML comment. Make
  // this fancier as needed.
  return text.replace(commentRegExp, '');
};

self.rewriteHtml = function rewriteHtml(text, tagPaths) {
  tagPaths = tagPaths || [];

  // Replace the "package/all" component with the specific ones used.
  var linkPaths = tagPaths.map(function(tagPath) {
    return '<link rel="component" type="text/ceci" href="' + tagPath + '">';
  });
  text = text.replace(appLinkRegExp, linkPaths.join('\n'));

  // Replace remote requirejs use.
  text = text.replace(rjsScriptRegExp, rjsScriptBlock);

  // Replace {{ASSET_HOST}} use
  text = text.replace(assetHostRegExp, './appmaker-components');

  return text;
};

// Find all the HTML components in use
self.getComponentTags = function getComponentTags(text) {
  var tag,
      unique = {},
      tags = [];

  componentNameRegExp.lastIndex = 0;
  while((tag = componentNameRegExp.exec(text))) {
    var name = tag[1];
    if (!unique.hasOwnProperty(name)) {
      tags.push(tag[1]);
      unique[name] = true;
    }
  }

  return tags;
};

// Merges results from a subcomponent extraction
self.mergeResults = function mergeResults(targetResult, sourceResult) {
  if (!sourceResult)
    return;

  if (sourceResult.componentTags.length) {
    targetResult.componentTags = targetResult.componentTags
                                 .concat(sourceResult.componentTags);
  }

  var pathContentMap = sourceResult.pathContentMap;
  Object.keys(pathContentMap).forEach(function(key) {
    if (!targetResult.pathContentMap.hasOwnProperty(key)) {
      targetResult.pathContentMap[key] = pathContentMap[key];
    }
  });
};


module.exports = extractAssetsHtml;