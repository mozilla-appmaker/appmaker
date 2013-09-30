var v = require('./lib/verify');
var fs = require('fs');

fs.readFile('public/templates/fireworks.html', 'utf8', function (err, data) {
  v.filter(data, function (output) {
    console.log(output);
  });
});