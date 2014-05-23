var express = require('express');
var Habitat = require('habitat');

Habitat.load();

var env = new Habitat();
var app = express();

if(!env.get('LOGIN_PORT')) {
  env.set('LOGIN_PORT', 3000);
}

app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.json());
app.use(express.urlencoded());

app.post('/api/user/authenticate', function(req, res, next) {
  res.json({
    email: 'floog@goop.com',
    // user: {
    //   username: 'floogal',
    //   email: 'floog@goop.com'
    // }
  })
});

app.post('/api/user/create', function(req, res, next) {
  res.json({
    email: 'floog@goop.com',
    user: {
      username: 'floogal',
      email: 'floog@goop.com'
    }
  })
});

app.listen(env.get('LOGIN_PORT'), function() {
  console.log('App listening on ' + env.get('LOGIN_PORT'));
});
