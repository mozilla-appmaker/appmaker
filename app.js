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
cors = require('cors'),
connect_fonts = require('connect-fonts'),
font_sourcesanspro = require('connect-fonts-sourcesanspro'),
postmark = require("postmark")(process.env.POSTMARK_API_KEY),
i18n = require("webmaker-i18n");

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

  // Setup locales with i18n
  app.use(i18n.middleware({
    supported_languages: ["en-US", "th-TH"],
    default_lang: "en-US",
    mappings: {
      "en": "en-US",
      "th": "th-TH"
     },
    translation_directory: path.resolve( __dirname, "locale" )
  }));

  app.use(express.favicon());

  app.use(express.logger('dev'));

  app.use(express.bodyParser());

  app.use(express.cookieParser());

  app.use(express.session({
    secret: process.env['COOKIE_SECRET']
  }));


  app.use(function(req, res, next) {
    res.removeHeader("x-powered-by");
    next();
  });
  app.use(express.methodOverride());

  app.use(express.cookieParser(process.env['COOKIE_SECRET']));

  app.use(express.session({
    secret: process.env['COOKIE_SECRET']
  }));

  app.use(app.router);

  app.use(connect_fonts.setup({
    fonts: [ font_sourcesanspro ],
    allow_origin: process.env.ASSET_HOST,
    ua: 'all',
    maxage: MAX_FONT_AGE_MS
  }));

  // enable cors for test relevant assets
  app.use("/test_assets/ceci/", cors());
  app.use("/test_assets/ceci/", express.static(path.join(__dirname, 'public', 'ceci')));
  app.use("/test_assets/vendor/", cors());
  app.use("/test_assets/vendor/", express.static(path.join(__dirname, 'public', 'vendor')));

  var lessMiddleware = require('less-middleware');

  app.use(lessMiddleware({
      src: __dirname + '/public',
      compress: true
  }));

  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
  if (!process.env['PERSONA_AUDIENCE']){
    console.log("Setting PERSONA_AUDIENCE to be http://localhost:" + app.get('port'));
    process.env['PERSONA_AUDIENCE'] = 'http://localhost:' + app.get('port');
  }
});

require("express-persona")(app, {
  audience: process.env['PERSONA_AUDIENCE']
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

//TODO: Security: https://github.com/mozilla-appmaker/appmaker/issues/602
// app.get('/component-*',         cors(), routes.proxy.gitHubComponent);
app.get('/component/:org/:component/:path',         cors(), routes.proxy.component);
app.get('/cors/:host/*',        cors(), routes.proxy.cors);
app.get('/delayedCors/:host/*', cors(), routes.proxy.delayedCors);


// This is a route that we use for client-side localization to return the JSON
// when we do the XHR request to this route.
app.get( "/strings/:lang?", i18n.stringsRoute( "en-US" ) );

app.post('/publish', routes.publish.publish);

// routes for publishing and retrieving components
// FIXME: URLs are too close to component proxy URLs
app.use('/register', express.static(path.join(__dirname, 'app')));
app.get('/components', routes.componentRegistry.componentsGet);
app.get('/components/:id', routes.componentRegistry.componentsGetById);
app.post('/components', routes.componentRegistry.componentsPost);
app.post('/components/:id', routes.componentRegistry.componentsPostById);
app.delete('/components/:id', routes.componentRegistry.componentsDeleteById);
app.get('/notifications/:notificationId', routes.componentRegistry.notificationGetById);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
