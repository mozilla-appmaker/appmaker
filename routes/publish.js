/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var knox = require('knox');
var shortid = require('shortid');
var ejs = require('ejs-locals/node_modules/ejs');
var fs = require('fs');
var builder = require('../lib/builder/builder');

var __publisher;

exports.init = function (store, viewsPath, urlPrefix, objectPrefix) {
  __store = store;

  fs.readFile(viewsPath + '/publish.ejs', 'utf8', function (err, data) {
    __publisher = {
      store: store,
      objectPrefix: objectPrefix || '',
      urlPrefix: urlPrefix || '',
      compiledPublishEJSTemplate: ejs.compile(data)
    };
  });
};

exports.publish = function(req, res) {
  var htmlFilename = shortid.generate();
  var zipFilename = shortid.generate();
  var inputData = req.body;

  var htmlStr = __publisher.compiledPublishEJSTemplate({
    content: inputData.html
  });

  builder.buildPackage(inputData.html, function (zipFilePath) {
    fs.readFile(zipFilePath, 'utf8', function (err, zipData) {
      __publisher.store.write(__publisher.objectPrefix + '/' + htmlFilename, htmlStr, function (htmlResult) {
        if (200 == htmlResult.statusCode) {
          __publisher.store.write(__publisher.objectPrefix + '/' + htmlFilename, zipData, function (zipResult) {
            if (200 == zipResult.statusCode) {
              res.json({error: null,
                html: __publisher.urlPrefix + '/' + __publisher.objectPrefix + '/' + htmlFilename,
                zip: __publisher.urlPrefix + '/' + __publisher.objectPrefix + '/' + zipFilename
                }, 200);
            }
            else {
              res.send('Couldn\'t save to S3', 500);
            }
          });
        }
        else {
          res.send('Couldn\'t save to S3', 500);
        }
      });
    });
  });
};
