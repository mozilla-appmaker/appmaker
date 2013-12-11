#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var statsd = require('child_process').fork(
  __dirname + '/node_modules/statsd/stats.js',
  ["appmakerStatsConfig.js"],
  {
    cwd: __dirname,
    env: process.env
  });

