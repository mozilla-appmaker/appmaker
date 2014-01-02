node-webmaker-i18n
==================

[![Build Status](https://travis-ci.org/mozilla/node-webmaker-i18n.png)](https://travis-ci.org/mozilla/node-webmaker-i18n)

Webmaker Localization Components for node.js and the browser.

This code is heavily inspired by, and borrows from, [Mozilla's i18n-abide](https://github.com/mozilla/i18n-abide) project.
However, this code has been stripped down to support only those things needed by the Webmaker tools and apps, and is based on
JSON instead of PO files, uses a different form of client-side localization, etc.

# Usage

## Server-Side with node.js

Install the node.js module using npm:

```
$ npm install webmaker-i18n
```

## Example

There is an example Express app in the `example/` directory. To run it:

```
$ npm install
$ cd example
$ node app.js
```

Now navigate to http://localhost:8000.  You'll see examples of server-side and client-side usage.

## API

The module exposes a number of useful functions, including:

### middleware

The `middleware` function is used with Express. It should be placed early on in the order of your middleware
functions, such that it can detect and process any extra language (i.e., language codes on the URL or
accept-language header. You use it like so:

```javascript
var i18n = require('webmaker-i18n');
...
app.use(i18n.middleware({
  supported_languages: [
    'en-US', 'th-TH', 'ru'
  ],
  default_lang: 'en-US',
  translation_directory: path.join( __dirname, 'locale' )
}));
```

This will cause the app to look for three locales on startup:

* `locale/en_US`
* `locale/th_TH`
* `locale/ru`

You can change the root locale directory by passing `translation_directory` with another path to the
`middleware` function.  Notice how the language tags have been converted
to locale names (i.e., en-US becomes en_US). Each locale directory must have one file named `messages.json`
which contains the strings for the locale.

When `middleware` is used, all subsequent middleware and routes will have `req` and `res` objects
with additional features. These include:

* `gettext` - a function used to get a localized string for a given key
* `format` - a function used to interpolate strings (see below)

#### Dynamic Mappings

Often one wants to map locale-specific languages to a default.  For example, if there are 3 locales specified
for English: `en-US`, `en-GB`, `en-CA`.  If a user requests `en`, we might choose to use `en-US` as the
default. Doing such mappings is accomplished using the `mappings` option:

```javascript
var i18n = require('webmaker-i18n');
...
app.use(i18n.middleware({
  supported_languages: [
    'en-US', 'en-GB', 'en-CA', 'th-TH', 'ru-RU'
  ],
  default_lang: 'en-US',
  translation_directory: path.join( __dirname, 'locale' ),
  mappings: {
    'en': 'en-US',
    'th': 'th-TH',
    'ru': 'ru-RU'
  }
}));
```

Here 8 languages are identified, 5 locale-based, and 3 defaults with no locale. Using such mappings,
users can request `th` or `th-TH` and get the same result. NOTE: no mappings are applied by default.


#### Global enabling langauges

If you are using Transifex and want to download and enable all the languages supported in your project, you can accomplish this with the following steps:

```
sudo npm install -g transifex
```

You will have to download all the translation files first using:

```
transifex -u "user:pass" -p "<project_name>" -c "<category_name>" -d "path_to_save_files"
```


* name: The name of your project on Transifex which can be found in the url slug
- https://www.transifex.com/projects/p/webmaker/
* category_name: The category of your resource file(s) that you want to download for your project
- Webmaker.org has `weblitstandard.json` and `webmaker.org.json` which are both categorized under `webmaker`.

Now all the languages in your Transifex project will be downloaded to "path_to_save_files", for example your locale directory.  Each language will be stored as a locale-Country pair (i.e., en_US).

``` javascript
var i18n = require('webmaker-i18n');

app.use( i18n.middleware({
  supported_languages: ['*'],
  default_lang: 'en-US',
  translation_directory: path.join( __dirname, 'locale' ),
  mappings: {
    'en': 'en-CA'
  }
}));
```

_Note:_ If you set ['*'] to the supported_languages option, the language codes will be read from the specified translation directory and supported_languages will be updated with the new list. This assumes you have already downloaded or otherwise created these directories yourself. For example, if you have locale/en_US and locale/fr the list of supported languages will include en-US and fr.

### localeInfo

The `localeInfo` object contains all the locale information listed below:

If the request comes in as "en-CA"

* `localeInfo.name` = "English (Canada)"
* `localeInfo.engName` = "English (Canada)"
* `localeInfo.lang` = "en-CA"
* `localeInfo.locale` = "en_CA"
* `localeInfo.momentLang` = "en-ca"
* `localeInfo.direction` = "ltr"

### getStrings

The `getStrings` function is used to get an object containing all strings for a given language. This
will include any strings missing from the given language, which are present in the default language.

```javascript
var ru = i18n.getStrings('ru');
```

### stringsRoute

The `stringsRoute` is a convenience to expose `getStrings` as a route for Express. It takes one optional
argument, the default language to use (defaults to "en-US" if missing). It can be used like so:

```javascript
app.get( "/strings/:lang?", i18n.stringsRoute( "en-US" ) );
```

### getLocales

The `getLocales` function is used to get a list (array) of supported locale names, and matches the
names of the folders that should be present in the `locale/` translation directory.

```javascript
var locales = i18n.getLocales();
```

### getLanguages

The `getLanguages` function is used to get a list (array) of supported language names.

```javascript
var languages = i18n.getLanguages();
```

### getSupportLanguages

The `getSupportLanguages` function is used to get a list (array) of supported language names based on the lang-Countries found in your translation directory.

```javascript
var languages = i18n.getSupportLanguages();
```

### format

The `format` function provides string interpolation, and can be used with either an object for
named variables, or an array  of values for positional replacement.

```javascript
// Named Example:
i18n.format("%(salutation)s %(place)s", {salutation: "Hello", place: "World"}, true);

// Positional Example:
i18n.format("%s %s", ["Hello", "World"]);
```

### languageFrom, localeFrom

The `languageFrom` and `localeFrom` functions convert languages to locales and vice versa.

```javascript
// en-US (language) to en_US (locale)
var enUSlocale = localeFrom('en-US');

// en_US (locale) to en-US language)
var enUSlanguage = languageFrom('en_US');
```

### languageNameFor

The `languageNameFor` function returns the language name based on the locale.

```javascript
var languageName = languageNameFor('en-US');
// The above will return "English (US)"

var languageName = languageNameFor('th-TH');
// The above will return "ไทย"
```

### languageEnglishName

The `languageEnglishName` function returns the language name based on the locale in English.

``` javascript
var languageName = languageEnglishName('en-US');
// The above will return "English (US)"

var languageName = languageEnglishName('th-TH');
// The above will return "Thai"
```

## Client-Side in the browser

Install the browser `localized.js` script using bower:

```
$ bower install webmaker-i18n
```

The `localized.js` script is usable with require.js or other AMD module loaders, and also in vanilla JavaScript.
In both cases, the code assumes that the HTML page it lives in has language information stored in the HTML element:

```html
<!DOCTYPE html>
<html lang="en-US" dir="ltr">
<head>
  ...
  <script src="bower_components/webmaker-i18n/localized.js"></script>
```

### AMD Usage

```javascript
require(['path/to/localized'], function(localized) {
  // Don't do anything until the DOM + localized strings are ready
  localized.ready(function(){
    var someText = localized.get('some key');
  });
});
```

### Forcing Localized on the Global

In some cases, it might be desirable to have the `localized` object placed on the global (e.g., `window`) even though requirejs is present in the page. This can be accomplished by assigning `true` to `window.__LOCALIZED_IGNORE_REQUIREJS`.

### Global Usage

If you aren't using an AMD loader like require.js, the object will get added to the global:

```javascript
// Don't do anything until the DOM + localized strings are ready
Localized.ready(function(){
  var someText = localized.get('some key');
});
```

### Localized members

The `localized.js` script exposes a number of functions:

* `ready` - a function that initializes the strings (i.e., downloads) on the client-side. A callback
should be passed, as well as any desired options, which include `noCache` (whether to do cache busting, default is no)
and `url` (the url end-point to use to call `getStrings` -- see above, default is '/strings/').  If the `url`
is an absolute URL beginning in "http", the URL will not be processed in any way.  Otherwise, URLs get
extra language info added (e.g., `/strings/[lang]`) based on what is in the HTML element's lang attribute.

```javascript
function readyCallback() {
 // Safe to use localized.get() now...
}

var options = { noCache: true, url: '/localized' }
localized.ready(options, readyCallback);
// NOTE: you could also call it like so:
// localized.ready(function(){...}); with no options.
```

* `getCurrentLang` - a function that returns the current language defined in the HTML element of the page.

```html
<html lang="th-TH" dir="ltr">
...
<script>
...
  var lang = localized.getCurrentLang();
  // lang === 'th-TH'
...
</script>
```

* `langToMomentJSLang` - a function that converts the given language name to the [moment.js supported language name](momentLang.js)

```javascript
var momentJSLang = langToMomentJSLang('en-US');
// The above will return "en"

var momentJSLang = langToMomentJSLang('th-TH');
// The above will return "th"

var momentJSLang = langToMomentJSLang('en-CA');
// The above will return "en-ca"
```


* `get` - a function that gets the localized version of a given string key. Must be called after `ready` has completed so that
the localized strings are loaded.

```javascript
localized.ready(function(){
  var localized = localized.get('some string key');
});
```
