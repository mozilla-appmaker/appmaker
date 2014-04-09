[![Build Status](https://travis-ci.org/mozilla/webmaker-analytics.png)](https://travis-ci.org/mozilla/webmaker-analytics)

### Webmaker Analytics

Client-side analytics utilities for Webmaker apps.

### Usage

The `analytics` module can be used as part of an AMD module system, or on the global.
It assumes that the Google Analytics (GA) snippet has already been included and setup
in the containing page. If it has not, all analytic methods below will be NO-OPs and
do nothing.

The module is also installable via [Bower](http://bower.io/):

```
$ bower install webmaker-analytics
```

You then include the installed script like so:

```html
<script src="/bower_components/webmaker-analytics/analytics.js"></script>
```

#### event(action, options)

The `event` method is used to record custom GA events using either the old [ga.js API](https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide), or the newer [analytics.js API](https://developers.google.com/analytics/devguides/collection/analyticsjs/events#overview).  It takes two arguments:
* `action` - A required string that is uniquely paired with each category, and commonly used
to define the type of user interaction for the web object. The `action` is converted
to Title Case for consistency.
* `options` - An optional set of extra arguments, which can include:
  * `label` - An optional string to provide additional dimensions to the event data.
  * `value` - An integer that you can use to provide numerical data about the user event.
  * `nonInteraction` - A boolean that when set to `true`, indicates that the event hit will
not be used in bounce-rate calculation.

NOTE: the data types of the optional properties on `options` are important, and mismatches
will cause values to be ignored.

Also be aware that any string (e.g., `action` or `label`) that look like an email address
will cause the event to be redacted for privacy reasons (i.e., it will show up in your stats
as "REDACTED (Potential Email Address)";). An email address is loosely defined as any string
of the form "..@..".

Each event will be tracked using the page's hostname as the GA Category automatically.

Example 1: Using the old GA ga.js _gaq API

```html
<script type="text/javascript">
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-XXXXX-X']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
</script>
<script src="analytics.js"></script>
<script>
  ...
  function playIntroVideo() {
    analytics.event("Play", {label: "Main page welcome video"});
    video.play();
  }
</script>
```

Example 2: Used as part of a Require.js module

```javascript
define(["analytics"], function(analytics) {

  ...

  return {
    login: function() {
      analytics.event("login");
      login();
    },

    logout: function() {
      analytics.event("logout");
      logout();
    }
  };

});
```

Example 3: Using new GA Analytics.js ga() API

```html
<head>
...
<!-- Google Analytics -->
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-XXXX-Y', 'auto');
ga('send', 'pageview');

</script>
<!-- End Google Analytics -->
</head>
<script src="analytics.js"></script>
<script>
  ...
  function playIntroVideo() {
    analytics.event("Play", {label: "Main page welcome video"});
    video.play();
  }
</script>
```

### Tests

To run the tests, do the following:

```
$ npm install
$ npm install -g bower
$ npm install -g grunt-cli
$ grunt
```

You can also run the tests in a browser by browsing to `test/index.html`.
