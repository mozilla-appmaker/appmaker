#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


var
express = require('express'),
http = require('http'),
engine = require('ejs-locals'),
path = require('path'),
uuid = require('node-uuid'),
connect_fonts = require('connect-fonts'),
font_sourcesanspro = require('connect-fonts-sourcesanspro'),
postmark = require("postmark")(process.env.POSTMARK_API_KEY);

var urls = require('./lib/urls');
var localStore = require('./lib/local-store');
var s3Store = require('./lib/s3-store');
var makeAPIPublisher = require('./lib/makeapi-publisher').create(process.env.MAKEAPI_URL, process.env.MAKEAPI_KEY, process.env.MAKEAPI_SECRET);

// Cache fonts for 180 days.
var MAX_FONT_AGE_MS = 1000 * 60 * 60 * 24 * 180;

var LOCAL_STORE_BASE_PATH = __dirname + '/' + 'store';

// .env files aren't great at empty values.
process.env.ASSET_HOST = typeof process.env.ASSET_HOST === 'undefined' ? '' : process.env.ASSET_HOST;

var app = express();

app.engine('ejs', engine);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(process.env['COOKIE_SECRET']));
  app.use(express.session());
  app.use(app.router);
  app.use(connect_fonts.setup({
    fonts: [ font_sourcesanspro ],
    allow_origin: process.env.ASSET_HOST,
    ua: 'all',
    maxage: MAX_FONT_AGE_MS
  }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


var store;
var useSubdomains = false;

if (process.env.STORE === 's3') {
  if (!process.env.S3_KEY || process.env.S3_KEY === '') {
    console.warn('No S3 credentials. Reverting to local store.');
    store = localStore.init(LOCAL_STORE_BASE_PATH);
    app.use('/store', express.static(path.join(__dirname, 'store')));
  }
  else {
    store = s3Store.init(process.env.S3_KEY, process.env.S3_SECRET, process.env.S3_BUCKET);
    useSubdomains = true;
  }
}
else {
  store = localStore.init(LOCAL_STORE_BASE_PATH);
  app.use('/store', express.static(path.join(__dirname, 'store')));
}

var urlManager = new urls.URLManager(process.env.PUBLISH_HOST_PREFIX, process.env.PUBLISH_HOST, process.env.S3_OBJECT_PREFIX, useSubdomains);
routes = require('./routes')(
  store,
  __dirname + '/views',
  urlManager,
  require('./lib/remix-mailer')(postmark),
  makeAPIPublisher
);

app.get('/', routes.index);
app.all('/designer', routes.designer);
app.get('/testappdesigner', routes.testappdesigner);
app.get('/testapp', routes.testapp);
app.get('/remix', routes.remix);

// Server-side gen of ID since we'll likely eventually use this for persistance
app.get('/store/uuid', function (req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.send(uuid.v1());
});

app.post('/publish', routes.publish.publish);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
