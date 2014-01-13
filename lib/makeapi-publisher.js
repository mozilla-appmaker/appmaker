/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

exports.create = function (url, id, secret) {
  var makeapiClient = new (require('makeapi-client'))({
    apiURL: url,
    hawk: {
      key: secret,
      id: id,
      algorithm: 'sha256'
    }
  });

  return {
    publish: function (publishOptions, callback) {
      makeapiClient.create({
        url: publishOptions.url,
        thumbnail: publishOptions.thumbnail,
        tags: publishOptions.tags,
        description: publishOptions.description,
        title: publishOptions.title,
        email: publishOptions.email,
        author: 'Mozilla Appmaker',
        contentType: 'Appmaker',
        locale: 'en_US'
      }, function (err, make) {
        callback(err, make);
      });
    }
  };
};
