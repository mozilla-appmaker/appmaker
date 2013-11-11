// var graphite_key = 'd99b8809-56f6-4608-83fa-ec1acde05c4c';
var net = require('net');

var socket = net.createConnection(2003, "162.243.75.232", function() {
    socket.write("appmaker.app_published 12\n");
    socket.end();
});

while (1) {
	true;
}

// var graphite = require('graphite');
// var client = graphite.createClient('plaintext://162.243.75.232:2003/');

// var metrics = {appmaker.app_published: 11879};
// client.write(metrics, function(err) {
// });
// // http://:49154/