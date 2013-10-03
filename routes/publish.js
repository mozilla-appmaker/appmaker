/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var knox = require('knox');
var moniker = require('moniker');
var ejs = require('ejs-locals/node_modules/ejs');
var fs = require('fs');
var path = require('path');
var verify = require('../lib/verify');

var __publisher;

exports.init = function (store, viewsPath, publishHost, publishHostPrefix, objectPrefix, useSubdomains) {
  __publisher = {
    store: store,
    objectPrefix: objectPrefix || '',
    publishHost: publishHost || '',
    publishHostPrefix: publishHostPrefix || '',
    useSubdomains: useSubdomains,
    templates: {
      publish: null,
      install: null
    }
  };

  fs.readFile(viewsPath + '/publish.ejs', 'utf8', function (err, publishHTMLData) {
    __publisher.templates.publish = ejs.compile(publishHTMLData, {
      // for partial include access
      filename: viewsPath + '/publish.ejs'
    });
  });

  fs.readFile(viewsPath + '/install.ejs', 'utf8', function (err, installHTMLData) {
    __publisher.templates.install = ejs.compile(installHTMLData, {
      // for partial include access
      filename: viewsPath + '/publish.ejs'
    });
  });
};

exports.publish = function(req, res) {
  var folderName = moniker.choose() + '-' + Math.round(Math.random() * 1000);
  var installHTMLFilename =  'install.html';
  var appHTMLFilename = 'index.html';
  var manifestFilename = 'manifest.webapp';


  var remoteURLPrefix = __publisher.useSubdomains ?
    __publisher.publishHostPrefix + folderName + '.' + __publisher.publishHost + '/' :
    __publisher.publishHostPrefix + __publisher.publishHost + '/store/' + __publisher.objectPrefix + '/' + folderName + '/';

  var remoteURLs = {
    install: remoteURLPrefix + installHTMLFilename,
    app: remoteURLPrefix + appHTMLFilename,
    manifest: remoteURLPrefix + manifestFilename
  };

  var inputData = req.body;
  var manifest = inputData.manifest || {};

  function cleanString (str, removeQuotes) {
    str = str.replace(/>/g, '&gt;').replace(/</g, '&lt;');

    if (removeQuotes) {
      str = str.replace(/'/g, '').replace(/"/g, '')
    }
    return str;
  }

  var requestHTML = inputData.html;

  // Do some cleansing!
  verify.filter(requestHTML, function (filteredHTML) {
    var appStr = __publisher.templates.publish({
      appHTML: filteredHTML
    });

    var installStr = __publisher.templates.install({
      iframeSrc: remoteURLs.app,
      manifestUrl: remoteURLs.manifest
    });

    var manifestJSON = {
      "name": 'My App - ' + folderName,
      "description": 'My App - ' + folderName,
      "launch_path": '/index.html',
      "developer": {
        "name": "Flathead",
        "url": "https://appmaker.mozillalabs.com/"
      },
      "icons": {
        "60": "/style/icons/icon-60.png",
        "79": "/style/icons/icon-79.png"
      },
      "default_locale": "en"
    };

    var outputFiles = [
      {filename: __publisher.objectPrefix + '/' + folderName + '/' + manifestFilename,
        data: JSON.stringify(manifestJSON),
        // According to https://developer.mozilla.org/en-US/docs/Web/Apps/Manifest#Serving_manifests
        contentType: 'application/x-web-app-manifest+json'},
      {filename: __publisher.objectPrefix + '/' + folderName + '/' + appHTMLFilename,
        data: appStr},
      {filename: __publisher.objectPrefix + '/' + folderName + '/' + installHTMLFilename,
        data: installStr}
    ];

    var filesDone = 0;

    outputFiles.forEach(function (description) {
      __publisher.store.write(description.filename, description.data, function (result) {
        if (200 !== result.statusCode) {
          console.error('Trouble writing ' + description.filename + ' to S3 (' + result.statusCode + ').');
        }
        if (++filesDone === outputFiles.length) {
          res.json({error: null,
            app: remoteURLs.app,
            install: remoteURLs.install,
            manifest: remoteURLs.manifest
          }, 200);
        }
      }, description.contentType);
    });
  });
};
