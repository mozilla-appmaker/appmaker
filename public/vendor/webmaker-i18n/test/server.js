var express = require('express');
var app = express(),
    httpServer;

module.exports = function (i18n) {
  app.get("/strings/:lang?", i18n.stringsRoute());

  return {
    listen: function (PORT, done) {
      httpServer = require('http').createServer(app);
      httpServer.listen(PORT);
      done();
    },
    close: function (done) {
      httpServer.close();
      done();
    }
  }
}
