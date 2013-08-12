'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
      },
      dist: {
        files: {
          'ceci.min.js': ['ceci.js'],
          'ceci-ui.min.js': ['ceci-ui.js']
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify']);

};