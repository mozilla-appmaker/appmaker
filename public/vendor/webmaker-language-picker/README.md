# Webmaker Language Picker

This is a template and library files for Webmaker's Language picker which is being used in all Webmaker's tools.

## Install

```
bower install webmaker-language-picker --save
```

**JS Dependencies:**

* requirejs
* selectizejs
* fuzzySearch
* listjs

**CSS Dependencies:**

* font-awesome
* hint.css


## What's included?

```bash

# Main js file
js/
    languages.js

# Language Picker
template/
    languages.html // Main file for full page
    partial.html // Use in header or footer
    alllanguages.html // dropdown with all languages/locales

# LESS file
styles/
    languages.less
```

## Usage for language.html

Include these in your require-config paths:

    "list": "path/to/listjs/dist/list.min",
    "fuzzySearch": "path/to/list.fuzzysearch.js/dist/list.fuzzysearch.min"

```html
{% extends "layout.html" %}
{% block requirejs %}{% endblock %}
{% block body %}
<div class="ui-wrapper ui-section" id="language">
  {% include "webmaker-language-picker/template/languages.html" %}
</div>
{% endblock %}
```

Initialize:

  // Call this when the element is ready
  languages.ready({
    position: "top",
    arrow: "left"
  });

## Usage for partial.html

Include these in your require-config paths:

    "list": "path/to/listjs/dist/list.min",
    "fuzzySearch": "path/to/list.fuzzysearch.js/dist/list.fuzzysearch.min"

```html
{% extends "layout.html" %}
{% block requirejs %}{% endblock %}
{% block body %}
<div>
  {% include "webmaker-language-picker/template/partial.html" %}
</div>
{% endblock %}
```

Initialize:

```
  // Call this when the element is ready
  languages.ready({
    position: "top",
    arrow: "left"
  });
```

## Usage for supportedLanguages.html

Include these in your require-config paths:

"selectize": "path/to/selectize/dist/js/standalone/selectize.min",

```html
{% extends "layout.html" %}
{% block requirejs %}{% endblock %}
{% block body %}
<div>
  {% include "webmaker-language-picker/template/supportedLanguages.html" %}
</div>
{% endblock %}
```

Initialize:

```js
$('#supportedLocales').selectize();
```

NOTE:

`supportedLanguages.html` template expect list of locales, see the file [here](template/supportedLanguages.html).


## Usage for alllanguages.html

Include these in your require-config paths:

    "selectize": "path/to/selectize/dist/js/standalone/selectize.min",

```html
{% extends "layout.html" %}
{% block requirejs %}{% endblock %}
{% block body %}
<div>
  {% include "webmaker-language-picker/template/alllanguages.html" %}
</div>
{% endblock %}
```

Initialize:

```js
$('#locales').selectize();
```

NOTE:

`alllanguages.html` template expect list of locales, see the file [here](template/alllanguages.html).
