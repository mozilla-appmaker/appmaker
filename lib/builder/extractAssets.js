/*jshint node: true */

var extractAssetsHtml = require('./extractAssets/html');

function extractAssets(baseDir, text) {
  return extractAssetsHtml(baseDir, 'index.html', text);
}

module.exports = extractAssets;