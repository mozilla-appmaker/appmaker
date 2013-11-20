#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


// // Goal
// //
// // Map https://{user}-components.appmaker.mozillalabs.com/{component-name}/(.*)
// // to proxy for
// // http://{user}.github.io/{component-name}/{(.*)}

// Couldn't get this working with node-http-proxy library, so went with simpler
// http://www.catonmat.net/http-proxy-in-nodejs/

var http = require('http');
var httpProxy = require('http-proxy');
var url = require('url');
var cors = require('cors');

var proxy = new httpProxy.RoutingProxy();

module.exports = {
  gitHubComponent: function(request, response) {
    var urlObj = url.parse(request.url);
    var user = request.headers.host.match(/^(.*)-components\/*/)[1]
    var path = urlObj.pathname.split('/');
    var componentName = path[0];
    var fileName = path.slice(1).join('/');
    var target = 'http://' + user + '.github.io/' + componentName + fileName;
    console.log('proxying %s to %s', request.url, target);
    var proxy_request = http.request(target);
    proxy_request.headers = request.headers;
    proxy_request.addListener('response', function (proxy_response) {
      proxy_response.addListener('data', function(chunk) {
        response.write(chunk, 'binary');
      });
      proxy_response.addListener('end', function() {
        response.end();
      });
      response.writeHead(proxy_response.statusCode, proxy_response.headers);
    });
    request.addListener('data', function(chunk) {
      proxy_request.write(chunk, 'binary');
    });
    request.addListener('end', function() {
      proxy_request.end();
    });
  },

  cors: function(req, resp){
    //TODO: So much error handling.

    // Host pulled from url mapping in app.js
    var host = req.params.host.split(":");
    var port = 80;

    if (host[1]){
      port = parseInt(host[1]);
    }

    host = host[0];

    //This is the first and only wildcard match
    req.url = "/" + req.params[0];

    req.headers.host = host;
    proxy.proxyRequest(req, resp, {

      host: host,
      port: port
    });
  }

};
