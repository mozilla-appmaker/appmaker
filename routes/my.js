#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var http = require('http');
var url = require('url');
var request = require('request');
var path = require('path');
var fs = require('fs');

module.exports = {
  apps: function(request, response) {
    console.log("EMAIL", request.session.email);
    if (! request.session.email) {
      response.json({'apps': []}, 400);
    } else {
      response.json({'apps': ["fireworks","more fireworks","todo"]}, 200);
    }
  }
};
