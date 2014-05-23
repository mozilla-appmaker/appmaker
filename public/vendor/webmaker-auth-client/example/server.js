var express = require('express');
var i18n = require('webmaker-i18n');
var nunjucks = require('nunjucks');
var path = require('path');
var WebmakerLogin = require('webmaker-auth');

module.exports = function(config) {
  var app = express();

  var nunjucksEnv = new nunjucks.Environment([
    new nunjucks.FileSystemLoader(path.join(__dirname, 'views'), true),
    new nunjucks.FileSystemLoader(path.join(__dirname, '../bower_components'), true),
    // Weird path because we're inside the bower module you're supposed to use
    new nunjucks.FileSystemLoader(path.join(__dirname, '../..'), true)
  ], {
    autoescape: true
  });

  nunjucksEnv.addFilter('instantiate', function (input) {
    var tmpl = new nunjucks.Template(input);
    return tmpl.render(this.getVariables());
  });

  var login = new WebmakerLogin({
    loginURL: config.LOGIN_URL,
    secretKey: config.SECRET_KEY
  });

  nunjucksEnv.express(app);

  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(express.json());
  app.use(express.urlencoded());

  app.use(login.cookieParser());
  app.use(login.cookieSession());

  // Setup locales with i18n
  app.use(i18n.middleware({
    supported_languages: ['en-US'],
    default_lang: 'en-US',
    mappings: require('webmaker-locale-mapping'),
    translation_directory: path.resolve(__dirname, '../locale')
  }));

  app.use(express.static(__dirname + '/..'));

  app.locals({
    bower_path: '',
    languages: i18n.getSupportLanguages()
  });

  app.get('/', function(req, res) {
    res.render('index.nunjucks');
  });

  app.post('/verify', login.handlers.verify);
  app.post('/authenticate', login.handlers.authenticate);
  app.post('/create', login.handlers.create);
  app.post('/logout', login.handlers.logout);
  app.post('/check-username', login.handlers.exists);

  return app;
};
