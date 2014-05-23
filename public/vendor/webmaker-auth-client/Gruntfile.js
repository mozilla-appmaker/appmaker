module.exports = function (grunt) {

  grunt.initConfig({
    requirejs: {
      compile: {
        options: {
          baseUrl: './',
          paths: {
            'cookie-js/cookie': 'bower_components/cookie-js/cookie',
            'eventEmitter/EventEmitter': 'bower_components/eventEmitter/EventEmitter',
            'analytics': 'bower_components/webmaker-analytics/analytics'
          },
          name: 'webmaker-auth-client',
          out: 'dist/webmaker-auth-client.min.js',
          optimize: 'uglify2'
        }
      }
    },
    watch: {
      node: {
        files: ['example/**/*.js'],
        tasks: ['shell:fakeApp', 'shell:fakeApp2']
      },
      client: {
        files: ['webmaker-auth-client.js'],
        tasks: ['requirejs']
      }
    },
    shell: {
      fakeLogin: {
        options: {
          async: true
        },
        command: 'node example/loginforthelols.js'
      },
      fakeApp: {
        options: {
          async: true
        },
        command: 'node example/server.js'
      },
      fakeApp2: {
        options: {
          async: true
        },
        command: 'node example/server-2.js'
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'webmaker-auth-client.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    jsbeautifier: {
      modify: {
        src: ['Gruntfile.js', 'webmaker-auth-client.js'],
        options: {
          config: '.jsbeautifyrc'
        }
      },
      validate: {
        src: ['Gruntfile.js', 'webmaker-auth-client.js'],
        options: {
          mode: 'VERIFY_ONLY',
          config: '.jsbeautifyrc'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-shell-spawn');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['shell:fakeApp', 'shell:fakeApp2', 'watch']);

  // Clean code before a commit
  grunt.registerTask('clean', ['jsbeautifier:modify', 'jshint']);

  // Validate code (read only)
  grunt.registerTask('validate', ['jsbeautifier:validate', 'jshint']);

  // Build
  grunt.registerTask('build', ['requirejs']);

};
