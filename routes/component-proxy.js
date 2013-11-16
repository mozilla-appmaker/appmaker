#!/usr/bin/env node

// // Goal
// //
// // Map https://{user}-components.appmaker.mozillalabs.com/{component-name}/(.*)
// // to proxy for
// // http://{user}.github.io/{component-name}/{(.*)}

// Couldn't get this working with node-http-proxy library, so went with simpler
// http://www.catonmat.net/http-proxy-in-nodejs/

var http = require('http');
var url = require('url');

module.exports.proxy = function componentProxy(request, response) {
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
};
