var express = require('express');
var Habitat = require('habitat');
var WebmakerLogin = require('webmaker-auth');

Habitat.load();

var env = new Habitat();
var app = express();
var login = new WebmakerLogin({
  loginURL: env.get('LOGIN_URL'),
  secretKey: env.get('SECRET_KEY')
});

// Default!
if(!env.get('PORT_2')) {
  env.set('PORT_2', 5050);
}

app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.json());
app.use(express.urlencoded());

app.use(login.cookieParser());
app.use(login.cookieSession());

app.use(express.static(__dirname + '/..'));

app.post('/verify', login.handlers.verify);
app.post('/authenticate', login.handlers.authenticate);
app.post('/create', login.handlers.create);
app.post('/logout', login.handlers.logout);
app.post('/check-username', login.handlers.exists);

app.listen(env.get('PORT_2'), function() {
  console.log('App 2 listening on ' + env.get('PORT_2'));
});
