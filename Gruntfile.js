module.exports = function( grunt ) {
  grunt.initConfig({
    pkg: grunt.file.readJSON( "package.json" ),
    simplemocha: {
      options: {
        timeout: 3000,
        ignoreLeaks: true,
        ui: 'bdd',
        reporter: 'spec'
      },
      all: { src: 'test/*.js' }
    },
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
          "zero-units": false
        },
        src: [
          "public/**/*.css"
        ]
      }
    },
    jshint: {
      options: {
        "-W054": true,  // The Function constructor is a form of eval
        "-W069": true   // thing["property"] is better written in dot notation
      },
      files: [
        "Gruntfile.js",
        "app.js",
        "public/javascripts/**/*.js",
        "public/ceci/*.js",
        "public/designer/**.js"
        // we should lint these, but don't know how to tell jslint that angular is defined.
        // "app/scripts/controllers/*.js",
        // "app/scripts/directives/*.js",
        // "app/scripts/services/*.js"
      ]
    },
    inlinelint: {
      html: ['public/ceci/**/*.html',
      'public/designer/*.html'],
      ejs: ['**/*.ejs']
    }
  });

  grunt.loadNpmTasks( "grunt-contrib-csslint" );
  grunt.loadNpmTasks( "grunt-contrib-jshint" );
  grunt.loadNpmTasks('grunt-lint-inline');
  grunt.loadNpmTasks('grunt-simple-mocha');

  // TODO: the csslinting is turned off right now, because the number
  //       of warnings is staggering. Some make sense, some don't.
  grunt.registerTask( "default", [ /*"csslint",*/ "jshint", "inlinelint",
                                   "simplemocha" ]);
};
