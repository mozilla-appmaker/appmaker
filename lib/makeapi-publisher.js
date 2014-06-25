/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

exports.create = function (makeApiUrl, id, secret) {
  if (makeApiUrl) {
    var makeapiClient = new (require('makeapi-client'))({
      apiURL: makeApiUrl,
      hawk: {
        key: secret,
        id: id,
        algorithm: 'sha256'
      }
    });

    var REMIX_PREFIX = process.env.ASSET_HOST + '/designer?';

    return {
      publish: function(publishOptions, callback) {
        makeapiClient.create({
          url: publishOptions.url,
          contenturl: publishOptions.url,
          remixurl: REMIX_PREFIX + 'remix=' + publishOptions.remix,
          editurl: REMIX_PREFIX + 'edit=' + encodeURIComponent(publishOptions.title),
          thumbnail: publishOptions.thumbnail,
          tags: publishOptions.appTags.split(/\s*,\s*/),
          description: publishOptions.appDescription,
          title: publishOptions.title,
          email: publishOptions.email,
          author: publishOptions.author,
          contentType: 'Appmaker',
          locale: publishOptions.locale || 'en_US'
        }, function (err, make) {
          callback(err, make);
        });
      }
    };
  }
  else {
    return {
      publish: function(publishOptions, callback) {
        callback(null);
      }
    };
  }
};
