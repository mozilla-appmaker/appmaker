var Utils = require('../utils');
var test = require('prova');

test('Utils.hexToRgb', function (t) {
  t.same(Utils.hexToRgb('#fff', 100), 'rgba(255,255,255,1)');
  t.same(Utils.hexToRgb('#777', 55), 'rgba(119,119,119,0.55)');
  t.same(Utils.hexToRgb('#ff0', 100), Utils.hexToRgb('#ffff00', 100));
  t.end();
});

test('Utils.prettyName', function (t) {
  t.same(Utils.prettyName('ceci-burger-town'), 'Burger-Town');
  t.same(Utils.prettyName('rad-city'), 'Rad-City');
  t.end();
});

test('Utils.getQueryStringVariable', function (t) {
  var m = Utils.getQueryStringVariable;
  t.same(m('animal', 'where=central+america&animal=sloth&when=1976'), 'sloth');
  t.end();
});
