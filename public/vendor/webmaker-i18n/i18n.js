/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var fs = require('fs'),
    langMap = require("langmap"),
    _ = require("lodash"),
    momentLang = require("./momentLang"),
    path = require('path'),
    util = require('util');

var BIDI_RTL_LANGS = ['ar', 'fa', 'he'],
    translations = {},
    default_lang = 'en-US',
    default_locale = 'en_US',
    listSupportedLang,
    listOfLanguages;

function gettext(sid, locale) {
  if (translations[locale][sid] && translations[locale][sid].length) {
    return translations[locale][sid];
  }
  // Return the default lang's string if missing in the translation.
  return (translations[default_locale][sid]) || sid;
}

function qualityCmp(a, b) {
  if (a.quality === b.quality) {
    return 0;
  } else if (a.quality < b.quality) {
    return 1;
  } else {
    return -1;
  }
}

/**
 * Convert the given language name into Moment.js supported Language name
 *
 *   lang: 'en-US' return: 'en'
 *   lang: 'en-CA' return: 'en-ca'
 *   lang: 'th-TH' return: 'th'
 **/
function langToMomentJSLang(lang) {
  lang = lang.toLowerCase();
  var newLang = lang.substr(0,2);
  if (momentLang.map.indexOf(lang) !== -1) {
   return lang;
  } else if (momentLang.map.indexOf(newLang) !== -1) {
   return newLang;
  }
  return 'en';
}

/**
 * Parses the HTTP accept-language header and returns a
 * sorted array of objects. Example object:
 * {
 *   lang: 'pl', quality: 0.7
 * }
 **/
function parseAcceptLanguage(header) {
  // pl,fr-FR;q=0.3,en-US;q=0.1
  if (! header || ! header.split) {
    return [];
  }
  var raw_langs = header.split(',');
  var langs = raw_langs.map(function(raw_lang) {
    var parts = raw_lang.split(';');
    var q = 1;
    if (parts.length > 1 && parts[1].indexOf('q=') === 0) {
      var qval = parseFloat(parts[1].split('=')[1]);
      if (isNaN(qval) === false) {
        q = qval;
      }
    }
    return { lang: parts[0].trim(), quality: q };
  });
  langs.sort(qualityCmp);
  return langs;
}

/**
 * Given the user's prefered languages and a list of currently
 * supported languages, returns the best match or a default language.
 * languages must be a sorted list, the first match is returned.
 **/
function bestLanguage(languages, supported_languages, defaultLanguage) {
  var lower = supported_languages.map(function(l) { return l.toLowerCase(); });
  for(var i=0; i < languages.length; i++) {
    var lq = languages[i];
    if (lower.indexOf(lq.lang.toLowerCase()) !== -1) {
      return lq.lang;
    // Issue#1128 match locale, even if region isn't supported
    } else if (lower.indexOf(lq.lang.split('-')[0].toLowerCase()) !== -1) {
      return lq.lang.split('-')[0];
    }
  }
  return defaultLanguage;
}

/**
 * Given a language code, return a locale code the OS understands.
 *
 * language: en-US
 * locale:   en_US
 **/
function localeFrom(language) {
  if (! language || ! language.split) {
    return "";
  }
  var parts = language.split('-');
  if (parts.length === 1) {
    return parts[0].toLowerCase();
  } else if (parts.length === 2) {
    return util.format('%s_%s', parts[0].toLowerCase(), parts[1].toUpperCase());
  } else if (parts.length === 3) {
    // sr-Cyrl-RS should be sr_RS
    return util.format('%s_%s', parts[0].toLowerCase(), parts[2].toUpperCase());
  } else {
    console.error(
      util.format("Unable to map a local from language code [%s]", language));
    return language;
  }
}

/**
 * Given a locale, return native language name e.g. given "th-TH" will return "ภาษาไทย"
 **/
function languageNameFor(locale) {
  locale = languageFrom(locale);
  return langMap[locale] ? langMap[locale]["nativeName"] : "Unknown";
}

/**
 * Given a locale, return English language name e.g. given "th-TH" will return "Thai"
 **/
function languageEnglishName(locale) {
  locale = languageFrom(locale);
  return langMap[locale] ? langMap[locale]["englishName"] : "Unknown";
}

/**
 * Given a locale code, return a language code
 **/
function languageFrom(locale) {
  if (!locale || !locale.split) {
    return "";
  }
  var parts = locale.split(/[-_]/);
  if (parts.length === 1) {
    return parts[0].toLowerCase();
  } else if (parts.length === 2) {
    return util.format('%s-%s', parts[0].toLowerCase(), parts[1].toUpperCase());
  } else if (parts.length === 3) {
    // sr_RS should be sr-RS
    return util.format('%s-%s', parts[0].toLowerCase(), parts[2].toUpperCase());
  } else {
    console.error(util.format("Unable to map a language from locale code [%s]", locale));
    return locale;
  }
}

/**
 * The format function provides string interpolation on the client and server side.
 * It can be used with either an object for named variables, or an array
 * of values for positional replacement.
 *
 * Named Example:
 * format("%(salutation)s %(place)s", {salutation: "Hello", place: "World"}, true);
 * Positional Example:
 * format("%s %s", ["Hello", "World"]);
 **/
exports.format = format = function(fmt, obj, named) {
  if (!fmt) return "";
  if (Array.isArray(obj) || named === false) {
    return fmt.replace(/%s/g, function(){return String(obj.shift());});
  } else if (typeof obj === 'object' || named === true) {
    return fmt.replace(/%\(\s*([^)]+)\s*\)s/g, function(m, v){
      return String(obj[v.trim()]);
    });
  } else {
    return fmt;
  }
};

/**
 * Returns the list of locales that we support in an array format
 **/
exports.getLocales = function() {
  return Object.keys(translations);
};

/**
 * Returns the list of languages that we support in an array format
 **/
exports.getLanguages = function() {
  return listSupportedLang;
};

/**
* Returns the list of languages that we support in an array format based on the lang-Countries found in your locale dir
**/
exports.getSupportLanguages = function() {
  return listOfLanguages;
};

/**
 * Returns a copy of the translated strings for the given language.
 **/
function getStrings(lang) {
  var locale = localeFrom(lang),
      strings = {};
  if (!translations[locale]) {
    return strings;
  }

  // Copy the translation pairs and return. We copy vs. simply returning
  // so we can maintain the translations internally, and count on them.
  // In order to get all strings (including those that exist in the default
  // lang but not a translation), we use the keys from the default lang.
  Object.keys(translations[default_locale]).forEach(function(key) {
    strings[key] = gettext(key, locale);
  });
  return strings;
}
exports.getStrings = getStrings;
exports.languageFrom = languageFrom;
exports.localeFrom = localeFrom;
exports.langToMomentJSLang = langToMomentJSLang;
exports.languageEnglishName = languageEnglishName;
exports.languageNameFor = languageNameFor;

/**
 * A route servers can use to expose strings for a given lang:
 *
 *   app.get( "/strings/:lang?", i18n.stringsRoute( "en-US" ) );
 */
exports.stringsRoute = function(defaultLang) {
  defaultLang = defaultLang || default_lang;
  return function(req, res) {
    res.jsonp( getStrings( req.params.lang || req.localeInfo.lang || defaultLang ) );
  };
};

/**
 * Middleware function for Express web apps, which deals with locales on
 * headers or URLs, and provides `gettext` and `format` to other middleware functions.
 */
exports.middleware = function(options) {
  if (!options) {
    throw new Error("No options passed in the middleware function. Please see the README for more info.");
  } else if (!options.translation_directory) {
    throw new Error("No path to translation_directory specified in the middleware function. Please see the README for more info.");
  } else if (!options.supported_languages) {
    throw new Error("No supported_languages option passed. Please see the README for more info.")
  }


  if (options.supported_languages && options.supported_languages.length) {
    listSupportedLang = options.supported_languages.slice(0);
    listOfLanguages = options.supported_languages;
  } else {
    throw new Error("Please check your supported_languages config.")
  }
  options.mappings = options.mappings || {};

  // Use the lang-Countries found in your locale dir without explicitly specifying them.
  if( listSupportedLang.length === 1 && listSupportedLang[0] === '*') {

    // Read the translation_directory and get all the language codes
    listSupportedLang = fs.readdirSync(options.translation_directory);

    // Change the locale to lang e.g. en_US ==> en-US
    for (var i = listSupportedLang.length - 1; i >= 0; i--) {
      listSupportedLang[i] = languageFrom(listSupportedLang[i]);
    };
    options.supported_languages = listSupportedLang.slice(0);
    listOfLanguages = options.supported_languages;
  }
  // If there is a '*' in the supported_languages field with some other languages.
  else if (listSupportedLang.indexOf('*') !== -1 && listSupportedLang.length !== 1) {
    throw new Error("Bad Config - Check your supported_languages field. Please see the README for more details.");
  }

  if (options.default_lang && listSupportedLang.indexOf(options.default_lang) === -1) {
    throw new Error("An unknown default_lang was passed. Please check your config or see the README for more details.")
  }
  default_lang = options.default_lang || "en-US";
  default_locale = localeFrom(default_lang);



  function messages_file_path(locale) {
    return path.resolve(path.join(__dirname, '..', '..', '..'),
                        options.translation_directory,
                        path.join(locale));
  }

  function parse_messages_file(locale) {
    var localePath = messages_file_path(locale),
        localeStrings = {};

    // Require all the files in locale directory for the given locale
    // and add them to a single object then return them.
    fs.readdirSync(localePath).forEach(function(fileName) {
      // Check if the file extension is .json
      if( !fileName.match(/\.json$/) ) {
        return;
      }
      fullPath = path.join(localePath, fileName);
      try {
        strings = require(fullPath);
        _.extend(localeStrings, strings);
      } catch (e) {
        var msg = util.format(
          'Unknown file name for locale=[%s] in [%s]. See the error message: (%s)',
          locale, messages_file_path(locale), e
        );
        console.error(msg);
        return;
      }
    });
    return localeStrings;
  }

  options.supported_languages.forEach(function(lang) {
    var locale = localeFrom(lang);

    try {
      translations[locale] = parse_messages_file(locale);
    } catch (e) {
      var msg = util.format(
        'Bad locale=[%s] missing .json files in [%s]. See locale/README (%s)',
        locale, messages_file_path(locale), e
      );
      // Only console error if bad config then we remove them off from the list so
      // that we can continue with no problem.
      console.error(msg);
      listSupportedLang = _.remove(listSupportedLang, function(l) {
        return l !== locale;
      });
      options.supported_languages = _.remove(options.supported_languages, function(l) {
       return l !== locale;
     });
      return;
    }
  });

  // Set up dynamic mappings on top of supported languages
  Object.keys(options.mappings).forEach(function(dynamicLang) {
    var mapping = options.mappings[dynamicLang];
    var locale = localeFrom(mapping);
    if (!translations[locale]) {
      console.error('Unknown language mapping [%s] -> [%s], skipping.', dynamicLang, mapping);
      return;
    }
    translations[dynamicLang] = translations[locale];
    // Extend the language name mappings too, in case we're missing a generic language name.
    langMap[dynamicLang] = langMap[dynamicLang] || langMap[mapping];
    listSupportedLang.push(dynamicLang);
  });

  function checkUrlLocale(req) {
    // Given a URL, http://foo.com/ab/xyz/, we check to see if the first directory
    // is actually a locale we know about, and if so, we strip it out of the URL
    // (i.e., URL becomes http://foo.com/xyz/) and store that locale info on the
    // request's accept-header.
    var matches = req.url.match(/^\/([^\/]+)(\/|$)/);
    if (!(matches && matches[1])) {
      return;
    }

    // Look for a lang we know about, and if found, strip it off the URL so routes
    // continue to work. If we don't find it (i.e., comes back "unknown") then bail.
    // We do this so that we don't falsely consume more of the URL than we should
    // and stip things that aren't actually locales we know about.
    var lang = bestLanguage(parseAcceptLanguage(matches[1]),
                            listSupportedLang,
                            "unknown");
    if (lang === "unknown") {
      return;
    }

    req.url = req.url.replace(matches[0], '/');
    req.headers['accept-language'] = lang;
  }

  // If the given lang is the lang in the mapping we will substitute that lang
  // to the lang name in which its pointing to
  // e.g.   mappings: { 'en': 'en-CA' } now 'en' will become 'en-CA'
  function substituteMapping(lang) {
    return options.mappings[lang] || lang;
  }

  return function(req, resp, next) {
    checkUrlLocale(req);

    var langs = parseAcceptLanguage(req.headers['accept-language']),
        lang_dir,
        lang = bestLanguage(langs, listSupportedLang, default_lang),
        locale,
        localeInfo = {},
        locals = {},
        gt;

    lang = substituteMapping(languageFrom(lang));

    // BIDI support, which direction does text flow?
    lang_dir = BIDI_RTL_LANGS.indexOf(lang) >= 0 ? 'rtl' : 'ltr';

    locale = localeFrom(lang);

    // localeInfo object will contain all the necessary informations that we need
    // from the coming request and we will later attached that to the locals and req
    localeInfo.name = languageNameFor(lang);
    localeInfo.engName = languageEnglishName(lang);
    localeInfo.lang = languageFrom(lang);
    localeInfo.locale = locale;
    localeInfo.momentLang = langToMomentJSLang(lang);
    localeInfo.direction = lang_dir;

    locals.localeInfo = localeInfo;
    req.localeInfo = localeInfo;
    locals.languageEnglishName = languageEnglishName;
    locals.languageNameFor = languageNameFor;

    var formatFnName = 'format';
    if (!! locals.format || !! req.format) {
      if (!! options.format_fn_name) {
        formatFnName = options.format_fn_name;
      } else {
        console.error("It appears you are using middleware which " +
          "already sets a variable 'format' on either the request " +
          "or reponse. Please use format_fn_name in options to " +
          "override this setting.");
        throw new Error("Bad Config - override format_fn_name");
      }

    }
    locals[formatFnName] = format;
    req[formatFnName] = format;

    if (translations[locale]) {
      gt = function(sid) {
        return gettext(sid, locale);
      };
    } else {
      // default lang in a non gettext environment... fake it
      gt = function(a) { return a; };
    }
    locals.gettext = gt;
    req.gettext = gt;

    // resp.locals(string, value) doesn't seem to work with EJS
    resp.locals(locals);

    next();
  };
};
