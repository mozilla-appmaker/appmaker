/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

exports.URLManager = function (publishHostPrefix, publishHost, objectPrefix, useSubdomains) {
  objectPrefix = objectPrefix || '';
  publishHost = publishHost || '';
  publishHostPrefix = publishHostPrefix || '';

  return {
    createURLPrefix: function (folderName) {
      return useSubdomains ?
        publishHostPrefix + folderName + '.' + publishHost + '/' :
        publishHostPrefix + folderName + '.' + publishHost + '/' + folderName + '/';
    },
    createLaunchPath: function (folderName) {
      return useSubdomains ?
        '/app' :
        '/' + folderName + '/app';
    },
    publishHostPrefix: publishHostPrefix,
    publishHost: publishHost,
    objectPrefix: objectPrefix,
    useSubdomains: useSubdomains
  };
};
