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
      ]
    },
    inlinelint: {
      html: ['public/ceci/**/*.html',
      'public/designer/*.html'],
      ejs: ['**/*.ejs']
    },
    requirejs: {
      compile: {
        //purposely blank. see require-designer and require-ceci tasks below
      }
    },
    gettext_finder: {
      files: [
        "views/*.html",
        "views/**/*.html",
        "views/*.ejs",
        "views/**/*.ejs",
        "public/ceci/**/*.html",
        "public/ceci/**/*.js",
        "public/designer/**/*.html",
        "public/designer/**/*.js",
        "public/templates/**/*.html",
        "public/templates/**/*.js",
        "public/samples/**/*.html",
        "public/samples/**/*.js"
      ],
      options: {
        pathToJSON: [ "locale/en_US/msg.json" ],
        extraSearchRegexp: [
          /[lL]10n(\.get)?\(["'][^)]+["']\)/g
        ]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-csslint");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-lint-inline");
  grunt.loadNpmTasks("grunt-simple-mocha");
  grunt.loadNpmTasks("grunt-contrib-requirejs");
  grunt.loadNpmTasks('grunt-gettext-finder');

  grunt.registerTask("require-designer", function () {
    grunt.config('requirejs.compile', {
      options: {
        baseUrl: "./public/javascripts",
        mainConfigFile: "public/javascripts/requireConfig.js",
        paths: {
          persona: "empty:",
          Firebase: "empty:"
        },
        name: "requireConfig",
        include: [
          // Dependencies don't seem to work properly for the colorpicker
          "jquery",
          "jquery-ui",
          "colorpicker.swatches.crayola",
          "colorpicker.swatches.pantone",
          "colorpicker.swatches.ral-classic",
          "colorpicker.parts.memory",
          "colorpicker.parts.rgbslider",
          "colorpicker.parsers.rgbslider",
          "colorpicker.parsers.cmyk-parser",
          "colorpicker.i18n.de",
          "colorpicker.i18n.en",
          "colorpicker.i18n.fr",
          "colorpicker.i18n.nl",
          "colorpicker.i18n.pt-br",
          "colorpicker.core",
          "designer/index"
        ],
        out: "public/javascripts/designer-build.js",
        optimize: "uglify2",
        generateSourceMaps: true,
        preserveLicenseComments: false
      }
    });
  });

  grunt.registerTask("require-ceci", function () {
    grunt.config('requirejs.compile', {
      options: {
        baseUrl: "./public/javascripts",
        mainConfigFile: "public/javascripts/requireConfig.js",
        paths: {
          persona: "empty:",
          Firebase: "empty:"
        },
        name: "requireConfig",
        include: [
          // Dependencies don't seem to work properly for the colorpicker
          "ceci/index"
        ],
        out: "public/javascripts/ceci-build.js",
        optimize: "uglify2",
        generateSourceMaps: true,
        preserveLicenseComments: false
      }
    });
  });

  // TODO: the csslinting is turned off right now, because the number
  //       of warnings is staggering. Some make sense, some don't.
  grunt.registerTask("default", [
    /*"csslint",*/
    "gettext_finder",
    "jshint",
    "inlinelint",
    "simplemocha",
    "require-designer",
    "requirejs",
    "require-ceci",
    "requirejs"
  ]);
};
