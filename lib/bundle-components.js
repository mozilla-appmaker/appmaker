/**
 * Bundle all the appmaker components (including .css and .js)
 * into a single file, and minify it.
 */
var fs = require("fs"),
    vulcan = require("./vulcanize"),
    componentDir = process.env.COMPONENT_DIR,
    outputFile = "mozilla-appmaker.html",
    htmlMinifier = require('html-minifier');

vulcan.vulcanize(outputFile, function(err, data) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  var bundleSize = data.length;
  console.log("Finished bundling components to ./"+ componentDir + outputFile + " ("+bundleSize+" bytes).");

  if (!!process.env.BUNDLE_MINIFY) {

    var minified = htmlMinifier.minify(data, {
      removeComments: true,
      removeCDATASectionsFromCDATA: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeAttributeQuotes: true,
      useShortDoctype: true,
      minifyJS: {
        // no explicit options for now
      },
      minifyCSS: {
        // no explicit options for now
      }
    });

    var minSize = minified.length;
    outputFile = outputFile.replace('.html','-min.html');
    fs.writeFile(componentDir + outputFile, minified, "utf8", function(err, result) {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      console.log("Finished minification to ./" + componentDir + outputFile + " ("+minSize+" bytes).");
      var perc = minSize*100/bundleSize;
      perc = ((10*perc)|0) / 10;
      console.log("Minified to " + perc + "% size of original (" + (bundleSize-minSize) + " byte reduction).");
    });
  }

});
