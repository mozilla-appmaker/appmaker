/*jshint node: true */
/*global describe, it */

var assert = require("assert"),
    fs = require('fs'),
    path = require('path'),
    extractAssets = require('../extractAssets/html');

function nospace(text) {
  text.replace(/\n\s+/g, '\n').trim();
}

describe('extractAssets', function() {
  var indexContents = fs.readFileSync(path.join(__dirname, 'data', 'index.html'), 'utf8'),
      rewrittenContents = fs.readFileSync(path.join(__dirname, 'data', 'rewritten.html'), 'utf8');

  describe('#getComponentTags()', function() {
    it('should find tags', function() {
      var tags = extractAssets.getComponentTags(indexContents);

      assert.equal(3, tags.length, 'found three tags');
      assert.equal('app-counter', tags[0]);
      assert.equal('app-input', tags[1]);
      assert.equal('app-label', tags[2]);
    });
  });

  describe('#extractAssets()', function() {
    it('full extraction', function(done) {
      extractAssets(path.join(__dirname, '..'), 'index.html', indexContents)
      .then(function(results) {
        assert.equal(nospace(rewrittenContents),
                     nospace(results.pathContentMap['index.html']),
                     'rewritten correctly');
      }).then(done, done);
    });
  });
});

