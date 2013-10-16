/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

exports.create = function (url, key, secret) {
  var makeapiClient = new (require('makeapi-client'))({
    apiURL: url,
    hawk: {
      key: key,
      id: secret,
      algorithm: 'sha256'
    }
  });

  return {
    publish: function (publishOptions, callback) {
      makeapiClient.create({
        make: {
          url: publishOptions.url,
          thumbnail: publishOptions.thumbnail,
          tags: publishOptions.tags,
          description: publishOptions.description,
          title: publishOptions.title,
          author: 'Mozilla Appmaker',
          email: 'appmaker.mozilla@gmail.com',
          contentType: 'Appmaker',
          locale: 'en_US'
        },
        maker: 'appmaker.mozilla@gmail.com'
      }, function (err, make) {
        callback(err, make);
      });
    }
  };
};