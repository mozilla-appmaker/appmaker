var path = require('path'),
    extractAssets = require('./extractAssets'),

    fs = require('fs'),
    fsextra = require('fs-extra'),
    q = require('q'),
    zipper = require('zipper'),

    readFile = q.denodeify(fs.readFile),
    writeFile = q.denodeify(fs.writeFile),
    mkdirs = q.denodeify(fsextra.mkdirs),
    copy = q.denodeify(fsextra.copy),
    createFile = q.denodeify(fsextra.createFile),

    manifestTemplate = fs.readFileSync(path.join(__dirname, 'template.webapp')),

    seedName = new Date().getTime(),
    counter = 1;

// Turn on q's long stack trace for dev, but turn off before shipping:
// https://github.com/kriskowal/q#long-stack-traces
q.longStackSupport = true;

exports.buildPackage = function (indexHTML, callback) {
  var results,
      dirName = 'app' + seedName + '-' + (counter += 1),
      fullDirName = path.join(__dirname, 'output', dirName),
      assetsDirName = path.join(fullDirName, 'appmaker-components', 'assets'),
      pathList = [],
      zipFilePath = path.join(fullDirName, 'app.zip');

  extractAssets(__dirname, indexHTML).then(function(r) {
    // Make output directory
    results = r;
    return mkdirs(fullDirName);
  }).then(function() {
    return mkdirs(assetsDirName);
  }).then(function() {
    // Copy over assets. A TODO would be to trim this based on what is
    // referenced by HTML/CSS/JS files.
    return copy(path.join(__dirname, 'appmaker-components', 'assets'),
                assetsDirName);
  }).then(function() {
    // Write out all the files collected during extraction.
    var filePromises = Object.keys(results.pathContentMap).map(function(p) {
      var filePath = path.join(fullDirName, p);
      return createFile(filePath).then(function() {
        return writeFile(filePath, results.pathContentMap[p], 'utf8');
      });
    });

    return q.all(filePromises);
  }).then(function() {
    // Copy over the style files.
    return copy(path.join(__dirname, 'style'),
                path.join(fullDirName, 'style'));
  }).then(function() {
    return mkdirs(path.join(fullDirName, 'scripts'));
  }).then(function() {
    // Copy over the script files.
    var paths = [
      [
        __dirname + '/scripts/require.min.js',
        fullDirName + '/scripts/require.min.js'
      ],
      [
        __dirname + '/../../public/vendor/ceci/ceci.js',
        fullDirName + '/scripts/ceci.js'
      ],
      [
        __dirname + '/../../public/vendor/ceci/ceci-ui.js',
        fullDirName + '/scripts/ceci-ui.js'
      ]
    ];

    var filePromises = paths.map(function(entry) {
      pathList.push(entry[1]);
      return copy(entry[0], entry[1]);
    });

    return q.all(filePromises);
  }).then(function() {
    // Create manifest.
    var manifest = JSON.parse(manifestTemplate);

    // TODO in future, do custom things like create a unique name.

    // Save manifest.
    var manifestPath = path.join(fullDirName, 'manifest.webapp');

    pathList.push(manifestPath);

    return createFile(manifestPath).then(function() {
      return writeFile(manifestPath,
                       JSON.stringify(manifest, null, '  '), 'utf8');
    });
  }).then(function() {
    // zip
    var zipFile = new zipper.Zipper(zipFilePath);

    pathList.forEach(function (path) {
      zipFile.addFile(path, path, function (err) {
        if (err) {
          console.error('Zipping error: ', err);
        }
      });
    });
  }).then(function() {
    // send the file back
    setTimeout(function () {
      callback(zipFilePath);
    }, 0);
  }).then();
};