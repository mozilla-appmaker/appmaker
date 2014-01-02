var should = require('should'),
    i18n = require("../"),
    request = require("superagent"),
    _ = require("lodash"),
    path = require("path"),
    translationPath = path.join(__dirname, '../example/locale'),
    middlewareOptions = {
      default_lang: 'en-US',
      supported_languages: ['en-US', 'en-CA'],
      translation_directory: translationPath,
      mappings: {
        'en': 'en-US'
      }
    },
    localOptions = {};

var server = require('./server')(i18n);

describe("Middleware setup", function () {
  describe("with good invocation of the middleware", function (done) {

    it("should not throw when passed default options data", function () {
      should(function () {
        _.merge(localOptions, middlewareOptions);
        i18n.middleware(localOptions);
      }).not.
      throw ();
    });

    it("should not throw when passed default options without default_lang", function () {
      should(function () {
        _.merge(localOptions, middlewareOptions);
        delete localOptions.default_lang;
        i18n.middleware(localOptions);
      }).not.
      throw ();
    });

    it("should not throw when passed default options without mappings", function () {
      should(function () {
        _.merge(localOptions, middlewareOptions);
        delete localOptions.mappings;
        i18n.middleware(localOptions);
      }).not.
      throw ();
    });

    it("should not throw when passed default options with 'en-CA' as default_lang", function () {
      should(function () {
        _.merge(localOptions, middlewareOptions);
        localOptions.default_lang = 'en-CA';
        i18n.middleware(localOptions);
      }).not.
      throw ();
    });

    it("should not throw when passed default options with '*' enabled in supported_languages", function () {
      should(function () {
        _.merge(localOptions, middlewareOptions);
        localOptions.supported_languages = ['*'];
        i18n.middleware(localOptions);
      }).not.
      throw ();
    });
  });
  describe("with bad invocation of the middleware", function (done) {
    it("should throw an error when no option passed", function () {
      should(function () {
        i18n.middleware();
      }).
      throw ();
    });

    it("should throw an error when only default_lang passed", function () {
      should(function () {
        i18n.middleware({
          default_lang: 'en-US'
        });
      }).
      throw ();
    });

    it("should throw an error when no path to translation_directory specified", function () {
      should(function () {
        _.merge(localOptions, middlewareOptions);
        delete localOptions.translation_directory;
        i18n.middleware(localOptions);
      }).
      throw ();
    });

    it("should throw an error when empty array of supported_languages passed", function () {
      should(function () {
        _.merge(localOptions, middlewareOptions);
        localOptions.supported_languages.length = 0;
        i18n.middleware(localOptions);
      }).
      throw ();
    });

    it("should throw an error when only path to translation_directory passed", function () {
      should(function () {
        i18n.middleware({
          translation_directory: translationPath
        });
      }).
      throw ();
    });

    it("should throw an error when unknown default_lang passed", function () {
      should(function () {
        _.merge(localOptions, middlewareOptions);
        localOptions.default_lang = 'unknown';
        i18n.middleware(localOptions);
      }).
      throw ();
    });

  });
});

describe("API Tests", function () {
  before(function (done) {
    i18n.middleware(middlewareOptions);
    server.listen(8000, done);
  });
  after(function (done) {
    server.close(done);
  })

  it("getStrings() should return translated object for the specified languages", function () {
    should(function () {
      i18n.getStrings('en-CA').should.be.an.instanceOf(Object)
        .and.not.empty;
    }).not.
    throw ();
  });

  it("stringsRoute() should return json object when request url: (http://localhost:8000/strings/en-US)", function (done) {
    should(function () {
      request.get("http://localhost:8000/strings/en-US", function (res) {
        res.body.should.be.an.instanceof(Object).and.not.empty;
        done();
      });
    }).not.
    throw ();
  });

  it("getLocales() should return list of locales in array format", function () {
    should(function () {
      i18n.getLocales().should.be.an.instanceOf(Array)
        .and.include('en_US', 'en')
        .and.not.include('en-US');
    }).not.
    throw ();
  });

  it("getLanguages() should return list of languages in array format", function () {
    should(function () {
      i18n.getLanguages().should.be.an.instanceOf(Array)
        .and.include('en-US', 'en')
        .and.not.include('en_US');
    }).not.
    throw ();
  });

  it("getSupportLanguages() should list of languages in an array format based on the lang-Countries", function () {
    should(function () {
      i18n.getSupportLanguages().should.be.an.instanceOf(Array)
        .and.include('en-US')
        .and.not.include('en');
    }).not.
    throw ();
  });

  it("Named: format('%(a)s %(b)s', {a: 'Hello', b: 'World'}) without boolean set and should return 'Hello World'", function () {
    should(function () {
      i18n.format('%(a)s %(b)s', {
        a: 'Hello',
        b: 'World'
      })
        .should.eql("Hello World");
    }).not.
    throw ();
  });

  it("Named: format('%(a)s %(b)s', {a: 'Hello', b: 'World'}, true) with boolean set and should return 'Hello World'", function () {
    should(function () {
      i18n.format('%(a)s %(b)s', {
        a: 'Hello',
        b: 'World'
      }, true)
        .should.eql("Hello World");
    }).not.
    throw ();
  });

  it("Positional: format('%s %s', ['Hello', 'World']) should return 'Hello World'", function () {
    should(function () {
      i18n.format("%s %s", ["Hello", "World"])
        .should.eql("Hello World");
    }).not.
    throw ();
  });

  it("languageFrom() should return language code en_US => en-US", function () {
    should(function () {
      i18n.languageFrom('en_US').should.eql('en-US');
    }).not.
    throw ();
  });

  it("localeFrom() should return locale code en-US => en_US", function () {
    should(function () {
      i18n.localeFrom('en-US').should.eql('en_US');
    }).not.
    throw ();
  });

  it("languageNameFor('en-US') and languageNameFor('th-TH') should return native language name", function () {
    should(function () {
      i18n.languageNameFor('en-US').should.eql('English (US)');
      i18n.languageNameFor('th-TH').should.eql('ภาษาไทย');
    }).not.
    throw ();
  });

  it("languageEnglishName('en-US') and languageEnglishName('th-TH') should return English language name", function () {
    should(function () {
      i18n.languageEnglishName('en-US').should.eql('English (US)');
      i18n.languageEnglishName('th-TH').should.eql('Thai');
    }).not.
    throw ();
  });

  it("langToMomentJSLang('en-US') and langToMomentJSLang('th-TH') should return moment language code 'en-US' => 'en'", function () {
    should(function () {
      i18n.langToMomentJSLang('en-US').should.eql('en');
      i18n.langToMomentJSLang('th-TH').should.eql('th');
    }).not.
    throw ();
  });

});
