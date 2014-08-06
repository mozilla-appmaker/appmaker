// use as:  grunt serve to serve the component for the designer
// TBD: bring back linting, jshint, etc.

module.exports = function(grunt) {
  var path = require('path');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    csslint: {
      lax: {
        options: {
          "adjoining-classes": false,
          "box-model": false,
          "box-sizing": false,
          "bulletproof-font-face": false,
          "compatible-vendor-prefixes": false,
          "ids": false,
          "important": false,
          "outline-none": false,
          "overqualified-elements": false,
          "qualified-headings": false,
          "regex-selectors": false,
          "star-property-hack": false,
          "underscore-property-hack": false,
          "universal-selector": false,
          "unique-headings": false,
          "unqualified-attributes": false,
          "vendor-prefix": false,
          "zero-units": false,
          "fallback-colors": false
        },
        src: [
          "**/*.css",
          '!node_modules/**'
        ]
      },
    },
    jshint: {
      options: {
        "-W054": true,  // The Function constructor is a form of eval
        "-W069": true   // thing["property"] is better written in dot notation
      },
      files: [
        "Gruntfile.js",
        "**/*.js",
        '!node_modules/**'
      ]
    },
    inlinelint: {
      html: ['**/*.html',
        '!node_modules/**',
        '!template/**'
      ]
    },
    connect: {
      server: {
        options: {
          port: 9001,
          base: path.normalize(__dirname + '/..'),
          keepalive: true,
          protocol: 'https',
          open: 9001,
          middleware: function(connect, options) {
            var middlewares = [];
            // var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
            // middlewares.push(proxy);
            if (!Array.isArray(options.base)) {
              options.base = [options.base];
            }
            var directory = options.directory || options.base[options.base.length - 1];
            middlewares.push(function(req, res, next) {
              // we need to setup CORS headers so that the designer can load the component
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
              next();
            });
            options.base.forEach(function(base) {
              // Serve static files.
              middlewares.push(connect.static(base));
            });
            return middlewares;
          },
        }
      }
    },
  });

  grunt.loadNpmTasks( "grunt-contrib-csslint" );
  grunt.loadNpmTasks( "grunt-contrib-jshint" );
  grunt.loadNpmTasks('grunt-lint-inline');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('serve', 'start web server to use in designer', function() {
    grunt.event.once('connect.server.listening', function(host, port) {
      var specRunnerUrl = 'https://' + host + ':' + 9001 + '/' + path.basename(__dirname);
      grunt.log.writeln('Tell the designer to load: ' + specRunnerUrl + "/component.html");
    });
    grunt.task.run('connect:server');
  });
  grunt.registerTask('default', ['serve']);
  grunt.registerTask('help', 'help message', function() {
    grunt.log.writeln('');
    grunt.log.writeln('_\'grunt\'_ to display the test runner page');
    grunt.log.writeln('_\'grunt lint\'_ to check your component');
  });
  grunt.registerTask( "lint", [ "csslint", "jshint", "inlinelint"]);
};
