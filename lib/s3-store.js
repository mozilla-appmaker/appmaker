/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

exports.init = function (key, secret, bucket, domain, emulated) {
  var knox = emulated ? require( "noxmox" ).mox : require( "knox" );
  var knoxClient = knox.createClient({
    key: key,
    secret: secret,
    bucket: bucket || "org.webmadecontent.staging.appmaker",
    domain: domain || ""
  });

  return {
    write: function (filename, data, callback, contentType) {
      contentType = contentType || 'text/html';
      var knoxReq = knoxClient.put(filename, {
        'x-amz-acl': 'public-read',
        'Content-Length': Buffer.byteLength(data, 'utf8'),
        'Content-Type': contentType
      });

      knoxReq.on('response', callback);
      knoxReq.end(data);
    }
  };
};
