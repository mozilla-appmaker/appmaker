var lynx = require('lynx');
//
// Options in this instantiation include:
//   * `on_error` function to be executed when we have errors
//   * `socket` if you wish to just use a existing udp socket
//   * `scope` to define the a prefix for all stats, e.g. with `scope`
//     'product1' and stat 'somestat' the key would actually be
//     'product1.somestat'
//
var metrics = new lynx('localhost', 8125);
metrics.increment('appmaker.app_published');
metrics.timing('appmaker.time_to_publish.time', 500); // time in ms
// metrics.gauge('gauge.one', 100);
// metrics.set('set.one', 10);