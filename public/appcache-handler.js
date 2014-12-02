var appCache = window.applicationCache;
var reporter = require('vendor/reporter');
var l10n = require('vendor/l10n');

appCache.addEventListener('downloading', function(e) {
  reportOnReady("Downloading files");
});

appCache.addEventListener('updateready', function(e) {
  reportCachingDone();

  if (appCache.status === appCache.UPDATEREADY) {
    reportOnReady("New version");
  }
});

appCache.addEventListener('cached', function(e) {
  reportCachingDone();
});

appCache.addEventListener('error', function(e) {
  console.warn(e);
});

function reportCachingDone() {
  reportOnReady("Downloading finished");
}

function reportOnReady(string) {
  if (window.Polymer && Polymer.whenPolymerReady) {
    reporter.successReport(l10n.get(string));
  } else {
    window.addEventListener('polymer-ready', function() {
      reporter.successReport(l10n.get(string));
    });
  }
}
//boo!
