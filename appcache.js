var glob = require('glob'),
    fs   = require('fs');

/**
 * Given an array of glob patterns, it calls glob on each pattern
 * and retrieves the matching filenames. When files for all the patterns
 * have been retrieved, calls the callBack function with the array of files
 * found.
 * @param{string[]} globArr - an array of glob params
 * @callback callBack - receives the array containing all matches as the only argument.
 */
function globMany(globArr, callBack) {
  var fileArray = [],
      count = 0,
      total = globArr.length;

  globArr.forEach(function(pattern, idx, patterns) {
    glob(pattern, function(er, files) {
      fileArray = fileArray.concat(files);

      if (++count == total) {
        callBack(fileArray);
      }
    });
  });
}

globMany(
    [
      'public/stylesheets/*.css',
      'public/images/*.png',
      'public/build/*.js',
      'public/appcache-handler.js',
      'public/vendor/polymer/*.html',
      'public/vendor/polymer/*.js',
      'public/ceci/ceci-*.html',
      'public/designer/components/*.html',
      'public/bundles/components/**/*.html',
      'public/bundles/components/**/*.css',
      'public/bundles/components/**/*.js',
      'public/vendor/font-awesome/css/font-awesome.css',
      'public/vendor/colorpicker/jquery.colorpicker.css',
      'public/vendor/jquery-ui/themes/base/minified/jquery-ui.min.css',
      'public/vendor/platform/platform.js',
      'public/vendor/firebasev0/firebase.v0.js',
      'public/vendor/persona/include.js',
      'public/vendor/jsonlint/lib/jsonlint.js',
      'public/vendor/togetherjs/togetherjs-min.js',
      'public/components/localization.js',
      'public/vendor/qrcodejs/qrcode.js',
      'public/fonts/*',
      '/vendor/platform/platform.js.map'
  ],
  function(files) {
    //This is icky, but we need to rid of the public/ since the browser doesn't see it.
    files.forEach(function(file, idx, files) {
      files[idx] = file.replace(/^public/, '');
    });

    console.log(files);

    var cacheStr = "CACHE MANIFEST\n" +
                   "/designer\n" +
                   "/strings\n" +
                   "/strings/en-US\n" +
                   "/components/localization.js\n" +
                   "/sourcesanspro-extralight,sourcesanspro-light,sourcesanspro-regular,sourcesanspro-semibold/fonts.css\n" +
                   "/vendor/font-awesome/font/fontawesome-webfont.woff?v=3.2.1\n" +
                   "/vendor/font-awesome/font/fontawesome-webfont.ttf?v=3.2.1\n" +
                   "/vendor/platform/platform.js.map\n";

    cacheStr += files.join("\n") + "\n";

    cacheStr += "NETWORK:\n*\n";
    cacheStr += "FALLBACK:\n/ /fallback.html\n";

    fs.writeFile('public/cache.appcache', cacheStr, function(err) {
      if (err) {
        throw err;
      }
      console.log("Wrote appcache file.");
    });
  }
);
