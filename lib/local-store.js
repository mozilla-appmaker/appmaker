/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

exports.init = function (baseDir) {

  mkdirp(baseDir, function (err) {
    if (err && err.code !== 'EEXIST') {
      console.error(err);
    }
  });

  return {
    write: function (filename, data, callback) {
      var fullPath = path.join(baseDir, filename);
      var dir = path.dirname(fullPath);
      mkdirp(dir, function (mkdirErr) {
        if (mkdirErr && mkdirErr.code !== 'EEXIST') {
          console.error(mkdirErr);
          callback({statusCode: mkdirErr.errno});
        }
        fs.writeFile(fullPath, data, 'utf8', function (fsErr) {
          callback({statusCode: fsErr ? fsErr.errno : 200});
        });
      });
    }
  };
};