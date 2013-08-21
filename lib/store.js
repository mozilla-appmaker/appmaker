/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var knox = require('knox');

exports.init = function (key, secret, bucket, viewsPath, urlPrefix) {
  var knoxClient = knox.createClient({
    key: key,
    secret: secret,
    bucket: bucket
  });

  return {
    write: function (filename, data, callback) {
      var knoxReq = knoxClient.put(filename, {
        'x-amz-acl': 'public-read',
        'Content-Length': Buffer.byteLength(data, 'utf8'),
        'Content-Type': 'text/html'
      });

      knoxReq.on('response', callback);
      knoxReq.end(data);
    }
  };
};