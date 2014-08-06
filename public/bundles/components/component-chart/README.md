component-counter
================

[![Build Status](https://travis-ci.org/mozilla-appmaker/component-counter.png)](https://travis-ci.org/mozilla-appmaker/component-counter)

Basic counter component for [Appmaker](https://github.com/mozilla-appmaker/appmaker).

Appmaker import:
```
<link rel="import" href="/component-counter">
```

# Test Status

See the github page http://mozilla-appmaker.github.io/component-counter/ for test status.

# Installation
`component.html` can be served from this repo without any setup. However, `Polymer` and `ceci-element` must be exposed for the component to function. The instructions below detail a full development/testing environment.

Make sure you have `nodejs`, `npm`, and `git` installed.

If you don't already have one, create a root `mozilla-appmaker` directory:
```
mkdir mozilla-appmaker
cd mozilla-appmaker
```

Clone this repo:
```
git clone git@github.com:mozilla-appmaker/component-counter.git
```

Clone the `tools` repo:
```
git clone git@github.com:mozilla-appmaker/tools.git
```

Clone the `appmaker` repo, which will provide foundational appmaker components:
```
git clone git@github.com:mozilla-appmaker/appmaker.git
```

Your directory structure should look like this (more component repos can be cloned as siblings of `component-counter`):
```
mozilla-appmaker/
  ├── appmaker/
  ├── component-counter/
  └── tools/
```

Enter the `component-counter` directory, and install npm dependencies
```
cd component-counter
npm install
```

If `npm` installs dependencies without any trouble, you're ready to go!

# Usage
Include this component in your appmaker app using Polymer's `<link>` import tag:
```
<link rel="import" href="{url-to-this-repo}">
```

In appmaker, this component is available using gh-pages:
```
<link rel="import" href="/component-counter">
```

# Testing

The test framework has three entry points:

1. `grunt karma:unit` runs unit tests (once).
2. `grunt karma:dev` watches the component directory, and runs unit tests when a file change occurs.
3. `grunt test-server` starts a server listening on port `9001`, and opens `index.html` in the default browser to show test status.

# Test Development
```
mozilla-appmaker/
  ├── conf/
      ├── karma.conf.js       karma configuration
      └── mocha.conf.js       mocha configuration (can be ignored 99% of the time)
  ├── test/
      ├── fixtures/           contains html files which are converted to js before tests run
      ├── js/                 contains js files for running tests
          └── tests.js        root for running tests. likely to contain calls to 'describe', 'before', 'test', etc.
      └── html/               contains html files which are included by 'tests.js'
          └── test.html       included by 'tests.js' as a working component environment for running tests
  ├── tools/
      ├── component-name.js   (ignore this file -- it's only here to make the framework simpler)
      ├── harness-utils.css   some simple css for 
      ├── harness-utils.js    (ignore this file -- it's only here to make the framework simpler)
      ├── iframe-utils.js     (ignore this file -- it's only here to make the framework simpler)
  ├── index.html              entry point for running tests in the browser
  ├── component.css           css for component definition
  └── component.html          component definition 
```

## `index.html`
Entry point for in-browser testing.

## `harness-utils.js`
Implements a helper for running tests with iframes.

#### `harnessUtils.createIframe(url, callback)`
Spawns an 
```
iframeHandler = harnessUtils.createIframe('test/html/test.html', function (win, doc) {
  // do stuff with win/doc
});
```

#### `handler.testBroadcasts(element, done, options)`

Tests each broadcast published in `ceci.broadcasts`

The options object takes two optional keys:
* `execute` An object whose functions which will cause broadcasts to occur, corresponding to property names.
* `check` Similarly, an object whose properties are names of broadcasts which will be executed by functions in the `execute` object. Each function is an event listener which will run once the corresponding broadcast event occurs. 

e.g.
```
execute: {
  click: function (channel) {
    var e = iframeHandler.document.createEvent('MouseEvents');
    e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, true, false, false, true, 0, null);
    buttonElement.$.button.dispatchEvent(e);
  }
},
check: {
  click: function (e, channel) {
    chai.assert.equal(e.detail.data, 'test data', 'Component attached correct value to event.');
  }
}
```

#### `handler.testBroadcasts(element, done, options)`

Tests each broadcast published in `ceci.broadcasts`

The options object takes two optional keys:
* `check` An object containing named functions which will be called once a listener has been used on the element. 
* `execute` _Optional_. An object containing named functions which will cause a listener to be used on the element. If listener keys are left out of this object (or if `execute` is not issued at all), listeners will be automatically triggered. Use this option when a listener is called through unconventional means.

e.g.
```
check: {
  click: function (e, channel) {
    chai.assert(true, 'Click event occured.');
  },
  setLabel: function (e, channel) {
    chai.assert(true);
  }
},
execute: {
  click: function (channel) {
    var e = new iframeWindow.CustomEvent(channel, {detail: 'clicked!'} );
    iframeHandler.document.dispatchEvent(e);
  }
}
```

#### `handler.createBroadcastElement(onAttribute, fromAttribute)`
Creates a `ceci-broadcast` element in the iframe document. Must be appended to the element manually, e.g. `element.appendChild(handler.createBroadcastElement('blue', 'click'));`

#### `handler.createListenElement(onAttribute, forAttribute)`
Creates a `ceci-listen` element in the iframe document. Must be appended to the element manually, e.g. `element.appendChild(handler.createListenElement('red', 'setLabel'));`

#### `handler.runIframeTest(name, callback)`
Runs groups of named tests that were queued inside the iframe. Calls to `test(name, testFunction)` inside the iframe will not be run immediately, and won't be run at all without using `runIframeTest`.

## `conf/karma.conf.js`

Most of this file doesn't need to be altered. However, if any filenames change, or files are added to run tests, make sure they're added to the `files` list (in which order matters). `karma` will serve only these files (see http://karma-runner.github.io/0.8/config/files.html for more info):
```
    files: [
      componentPath + 'tools/component-name.js',
      componentPath + 'tools/harness-utils.js',
      componentPath + 'tools/iframe-utils.js',
      componentPath + 'conf/mocha.conf.js',
      'appmaker/public/vendor/polymer/polymer.min.js',
      'appmaker/public/vendor/mocha/mocha.js',
      'tools/test/chai/chai.js',
      componentPath + 'test/js/tests.js',
      {pattern: 'appmaker/public/ceci/*.html', included: false},
      {pattern: 'appmaker/public/ceci/test/fixtures/*.html', included: false},
      {pattern: componentPath + 'test/**/*.js', included: false},
      {pattern: componentPath + 'test/**/*.html', included: false},
      {pattern: componentPath + '*.html', included: false},
      {pattern: componentPath + '*.js', included: false},
      {pattern: componentPath + '*.css', included: false},
      {pattern: 'tools/**/*.js', included: false},
    ]
```

## `test/js/tests.js`
This is the root testing file. It contains tests to run, and mechanisms to spawn iframes. e.g.
```
  var iframeHandler, buttonElement;
  
  beforeEach(function (done) {
    iframeHandler = harnessUtils.createIframe('test/html/test.html', function (win, doc) {
      buttonElement = iframeHandler.document.querySelector('ceci-button');
      done();
    });
  });

  describe('Ceci Button', function () {
    test('Sanity check', function (done) {
      chai.assert(buttonElement.ceci, 'Ceci descriptor exists.');
      iframeHandler.runIframeTest('Sanity Check', done);
    });
    
    test('Broadcasts', function (done) {
      iframeHandler.testBroadcasts(buttonElement, done, {
        //see testBroadcasts in harndess-utils.js description below
      });
    });
  });
```


## `test/html/test.html`

Files in this directory present environments for tests to run. They are opened as iframes so tests have a live DOM to manipulate and analyze.

Make sure that basic appmaker components and this repo's element definition are included as `<link>`s, and that `polymer` is referenced, e.g.:
```
<head>
  <link rel="import" href="../../../appmaker/public/ceci/ceci-element.html">
  <link rel="import" href="../../../appmaker/public/ceci/ceci-element-base.html">
  <link rel="import" href="../../../appmaker/public/ceci/ceci-broadcast.html">
  <link rel="import" href="../../../appmaker/public/ceci/ceci-listen.html">
  <!-- This is the component we're actually testing -->
  <link rel="import" href="../../component.html">
  <script src="../../../appmaker/public/vendor/polymer/polymer.min.js"></script>
</head>
```

You can then include and instance of this repo's element in the document body:
```
<body>
  <!-- The skeleton app we'll be using to test -->
  <ceci-counter id="ceci-counter" value="you must construct additional pylons"></ceci-counter>
</body>
</html>
```

If desirable, a small `iframe-test-utils` can be included to run tests inside the html file:
```
<script src="../../tools/iframe-utils.js"></script>
```

Then, make sure `iframeTestUtils` is called, which will queue named tests to be driven by `tests.js` using `iframeHandler.runIframeTest('example', done);` (see above)
```
<script>
  iframeTestUtils(function () {
    test('example', function (done) {
      var buttonElement = document.querySelector('ceci-button');
      chai.assert(buttonElement.$.button, 'Button recognized and exposed by Polymer.');
      chai.assert(buttonElement.ceci.broadcasts, 'Ceci broadcasts publicized.');
      chai.assert(buttonElement.ceci.listeners, 'Ceci listeners publicized.');
      done();
    });
  });
</script>
```
