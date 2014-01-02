(function(global, ignoreRequireJS, factory) {
  // AMD. Register as an anonymous module. Also deal with the case
  // that we've been told to force localized on the global (e.g.,
  // in cases where require.js might exist in a page and we want to
  // ignore it and use the global instead).
  if (typeof define === 'function' &&
      define.amd                   &&
      !ignoreRequireJS) {
    define(factory);
  }
  // Expose a global instead
  else {
    global.Localized = factory();
  }
}(this, this.__LOCALIZED_IGNORE_REQUIREJS, function() {

  var _strings,
      _readyCallbacks = [],
      _requestedStrings = false;

  function fireReadyCallbacks() {
    // Fire all ready callbacks we have queued up.
    while(_readyCallbacks.length) {
      (_readyCallbacks.pop())();
    }
  }

  function ready(data) {
    function domReady() {
      // If the DOM isn't ready yet, repeat when it is
      if ( document.readyState !== "complete" ) {
        document.onreadystatechange = domReady;
        return;
      }
      document.onreadystatechange = null;
      _strings = data;

      fireReadyCallbacks();
    }

    domReady();
  }

  // Get the current lang from the document's HTML element, which the
  // server set when the page was first rendered. This saves us having
  // to pass extra locale info around on the URL.
  function getCurrentLang() {
    var html = document.querySelector( "html" );
    return html && html.lang ? html.lang : "en-US";
  }

  return {
    /**
     * gets the localized string for a given key
     */
    get: function(key) {
      if ( !_strings ) {
        console.error( "[webmaker-i18n] Error: string catalog not found." );
        return "";
      }
      return ( _strings[ key ] || "" );
    },

    /**
     * Convert the given language name into Moment.js supported Language name
     *
     *   lang: 'en-US' return: 'en'
     *   lang: 'en-CA' return: 'en-ca'
     *   lang: 'th-TH' return: 'th'
     **/
    langToMomentJSLang: function(lang) {
      /* The list of moment.js supported languages
       * Extracted from http://momentjs.com/downloads/moment-with-langs.js
       */
      var momentLangMap = ['en', 'ar-ma', 'ar', 'bg', 'br', 'bs', 'ca',
                          'cs', 'cv', 'cy', 'da', 'de', 'el',
                          'en-au', 'en-ca', 'en-gb', 'eo', 'es',
                          'et', 'eu', 'fa', 'fi', 'fo', 'fr-ca',
                          'fr', 'gl', 'he', 'hi', 'hr', 'hu', 'id',
                          'is', 'it', 'ja', 'ka', 'ko', "lt", 'lv',
                          'ml', 'mr', 'ms-my', 'nb', 'ne', 'nl', 'nn',
                          'pl', 'pt-br', 'pt', 'ro', 'ru', 'sk', 'sl',
                          'sq', 'sv', 'th', 'tl-ph', 'tr', 'tzm-la',
                          'tzm', 'uk', 'uz', 'vn', 'zh-cn', 'zh-tw'];

      lang = lang.toLowerCase();
      var newLang = lang.substr(0,2);
      if (momentLangMap.indexOf(lang) !== -1) {
        return lang;
      } else if (momentLangMap.indexOf(newLang) !== -1) {
        return newLang;
      }
      return 'en';
    },

    /**
     * gets the current lang used for the given page, or en-US by default.
     */
    getCurrentLang: getCurrentLang,

    /**
     * initializes the strings locally (i.e., downloads if not already downloaded) and
     * queues a callback to be fired when the DOM + strings are ready. It is safe to
     * call ready() multiple times. For cache busting, pass noCache=true on the options arg.
     */
    ready: function(options, callback) {
      var _callback;

      // Allow calling ready with or without options.
      if (typeof options === 'function') {
        _callback = options;
        options = {};
      } else {
        _callback = callback || function(){};
      }

      var noCache = !!options.noCache,
          url = options.url || '/strings';

      // If given an absolute url (starting in http), we don't process it.
      // Otherwise we fix it up to include the current lang from <html lang="...">
      if (url.indexOf( 'http' ) !== 0) {
        url = url.replace(/^\/?/, '/').replace(/\/?$/, '/');
        url = url + getCurrentLang();
      }

      // Add cache busting if requested.
      url = url + (noCache ? '?bust=' + Date.now() : '');

      if (!_requestedStrings) {
        _requestedStrings = true;
        _readyCallbacks.push(_callback);

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function(){
          if (this.readyState !== 4) {
            return;
          }

          if (xhr.status !== 200) {
            console.error("Localized Error: HTTP error " + xhr.status);
            return;
          }

          try {
            ready(JSON.parse(this.responseText));
          } catch (err) {
            console.error("Localized Error: " + err);
          }
        };
        xhr.send(null);
      }

      if (this.isReady()) {
        fireReadyCallbacks();
      }
    },

    /**
     * returns true if the localized strings have been loaded and can be used.
     */
    isReady: function() {
      return !!_strings;
    }
  };
}));
