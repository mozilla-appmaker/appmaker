module.exports = createJavaScriptBundles;

var fs = require('fs');
var path = require('path');
var browserify = require('browserify');
var Uglify = require('uglify-js');

var RUN_AS_SCRIPT = module && !module.parent;
var PRODUCTION_MODE = process.env.NODE_ENV === 'production';

function log() {
  return console.error.apply(console, arguments);
}

function minify(buf) {
  return Uglify.minify(buf.toString('utf8'), {fromString: true}).code;
}

function createJavaScriptBundles(opts, cb) {
  opts = opts || {};
  if (typeof opts === 'function') {
    cb = opts; opts = {};
  }

  var commonOutput = opts.commonFile ||
    path.join(__dirname, '../public/javascripts/common.js');

  var bundleOutput = opts.bundleOutput||
    path.join(__dirname, '../public/javascripts/designer-bundle.js');

  var designerEntry = opts.designerEntry ||
    path.join(__dirname, '../public/designer/js/index.js');

  var externalLibraries = opts.external || [
    'jquery',
    'vendor/customevent',
    'vendor/l10n',
    'vendor/reporter',
    'webmaker-analytics',
    'webmaker-language-picker',
  ];

  var buildOptions = opts.buildOptions || {
    noparse: ['jquery'],
    insertGlobals: !PRODUCTION_MODE,
    detectGlobals: PRODUCTION_MODE,
  };

  var common = browserify(buildOptions);
  var designer = browserify(buildOptions);
  var expect = 2; // number of callbacks to expect before finishing
  var globalError = false;

  common.require(externalLibraries);
  common.bundle(process(commonOutput));

  designer.add(designerEntry);
  designer.external(externalLibraries);
  designer.bundle(process(bundleOutput));

  function process(file) {
    return function (err, code) {
      if (err && !globalError)
        return cb(globalError = err);
      if (PRODUCTION_MODE)
        code = minify(code);
      fs.writeFileSync(file, code);
      log('Wrote %d bytes to %s', code.length, file);
      return finish();
    };
  }

  function finish() {
    if (--expect > 0) return;
    return cb && cb();
  }
}

if (RUN_AS_SCRIPT) {
  createJavaScriptBundles();
}
