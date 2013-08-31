'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
      },
      dist: {
        files: {
          'inflection.min.js': ['inflection-js/src/inflection.js']
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify']);

};