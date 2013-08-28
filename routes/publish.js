/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var knox = require('knox');
var moniker = require('moniker');
var ejs = require('ejs-locals/node_modules/ejs');
var fs = require('fs');
var path = require('path');

var __publisher;

exports.init = function (store, viewsPath, publishHost, publishHostPrefix, objectPrefix) {
  __publisher = {
    store: store,
    objectPrefix: objectPrefix || '',
    publishHost: publishHost || '',
    publishHostPrefix: publishHostPrefix || '',
    templates: {
      publish: null,
      install: null
    }
  };

  fs.readFile(viewsPath + '/publish.ejs', 'utf8', function (err, publishHTMLData) {
    __publisher.templates.publish = ejs.compile(publishHTMLData);
  });

  fs.readFile(viewsPath + '/install.ejs', 'utf8', function (err, installHTMLData) {
    __publisher.templates.install = ejs.compile(installHTMLData);
  });
};

exports.publish = function(req, res) {
  var folderName = moniker.choose() + '-' + Math.round(Math.random() * 1000);
  var installHTMLFilename =  'install.html';
  var appHTMLFilename = 'index.html';
  var manifestFilename = 'manifest.webapp';

  var remoteInstallUrl = __publisher.publishHostPrefix + folderName + '.' + __publisher.publishHost + '/' + installHTMLFilename;
  var remoteAppUrl = __publisher.publishHostPrefix + folderName + '.' + __publisher.publishHost + '/' + appHTMLFilename;
  var remoteManifestUrl = __publisher.publishHostPrefix + folderName + '.' + __publisher.publishHost + '/' + manifestFilename;

  var inputData = req.body;
  var manifest = inputData.manifest;

  var appStr = __publisher.templates.publish({
    cards: manifest.cards
  });

  var installStr = __publisher.templates.install({
    iframeSrc: remoteAppUrl,
    manifestUrl: remoteManifestUrl
  });

  var manifestJSON = {
    "name": 'My Flathead App - ' + folderName,
    "description": 'My Flathead App - ' + folderName,
    "launch_path": '/index.html',
    "developer": {
      "name": "Flathead",
      "url": "https://flathead.herokuapp.com/"
    },
    "icons": {
      "60": "/style/icons/icon-60.png",
      "79": "/style/icons/icon-79.png"
    },
    "default_locale": "en"
  };

  var outputFiles = [
    {filename: __publisher.objectPrefix + '/' + folderName + '/' + manifestFilename, data: JSON.stringify(manifestJSON), contentType: 'text/json'},
    {filename: __publisher.objectPrefix + '/' + folderName + '/' + appHTMLFilename, data: appStr},
    {filename: __publisher.objectPrefix + '/' + folderName + '/' + installHTMLFilename, data: installStr}
  ];

  var filesDone = 0;

  outputFiles.forEach(function (description) {
    __publisher.store.write(description.filename, description.data, function (result) {
      if (200 !== result.statusCode) {
        console.error('Trouble writing ' + description.filename + ' to S3 (' + result.statusCode + ').');
      }
      if (++filesDone === outputFiles.length) {
        res.json({error: null,
          app: remoteAppUrl,
          install: remoteInstallUrl,
          manifest: remoteManifestUrl
        }, 200);
      }
    }, description.contentType);
  });
};
