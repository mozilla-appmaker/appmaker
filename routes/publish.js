/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var knox = require('knox');
var moniker = require('moniker');
var ejs = require('ejs-locals/node_modules/ejs');
var fs = require('fs');
var path = require('path');
var verify = require('../lib/verify');
var lynx = require('lynx');
var metrics = new lynx('localhost', 8125);

module.exports = function (store, viewsPath, urlManager, makeAPIPublisher) {
  var templates = {
    publish: null,
    install: null
  };

  fs.readFile(viewsPath + '/publish.ejs', 'utf8', function (err, publishHTMLData) {
    templates.publish = ejs.compile(publishHTMLData, {
      // for partial include access
      filename: viewsPath + '/publish.ejs'
    });
  });

  fs.readFile(viewsPath + '/install.ejs', 'utf8', function (err, installHTMLData) {
    templates.install = ejs.compile(installHTMLData, {
      // for partial include access
      filename: viewsPath + '/publish.ejs'
    });
  });

  return {
    publish: function(req, res) {
      var folderName = moniker.choose() + '-' + Math.round(Math.random() * 1000);
      var installHTMLFilename =  'install.html';
      var appHTMLFilename = 'index.html';
      var manifestFilename = 'manifest.webapp';

      var remoteURLPrefix = urlManager.createURLPrefix(folderName);

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
        var appStr = templates.publish({
          appHTML: filteredHTML,
          appName: folderName
        });

        var installStr = templates.install({
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
          {filename: urlManager.objectPrefix + '/' + folderName + '/' + manifestFilename,
            data: JSON.stringify(manifestJSON),
            // According to https://developer.mozilla.org/en-US/docs/Web/Apps/Manifest#Serving_manifests
            contentType: 'application/x-web-app-manifest+json'},
          {filename: urlManager.objectPrefix + '/' + folderName + '/' + appHTMLFilename,
            data: appStr},
          {filename: urlManager.objectPrefix + '/' + folderName + '/' + installHTMLFilename,
            data: installStr}
        ];

        var filesDone = 0;

        outputFiles.forEach(function (description) {
          store.write(description.filename, description.data, function (result) {
            if (200 !== result.statusCode) {
              console.error('Trouble writing ' + description.filename + ' to S3 (' + result.statusCode + ').');
            }
            if (++filesDone === outputFiles.length) {
              res.json({error: null,
                app: remoteURLs.app,
                install: remoteURLs.install,
                manifest: remoteURLs.manifest
              }, 200);

              // Don't wait for the MakeAPI to deliver url to user
              makeAPIPublisher.publish({
                url: remoteURLs.install,
                thumbnail: 'http://appmaker.mozillalabs.com/images/mail-man.png',
                tags: ['appmaker'],
                description: 'Appmaker ' + folderName,
                title: 'Appmaker ' + folderName,
              }, function (err, make) {
                if (err) {
                  console.error(err);
                }
              });
            }
          }, description.contentType);
        });
        metrics.increment('flathead.app_published');
      });
    }
  };
};