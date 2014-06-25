[![Build Status](https://travis-ci.org/mozilla/webmaker-analytics.png)](https://travis-ci.org/mozilla/webmaker-analytics)

### Webmaker Analytics

Client-side analytics utilities for Webmaker apps.

### Usage

The `analytics` module can be used as part of an AMD module system, or on the global.
It assumes that the Google Analytics (GA) snippet and/or the Optimizely tracking code
has already been included and setup in the containing page. If it has not, all analytics
methods below will be NO-OPs and do nothing.

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

#### virtualPageview(virtualPagePath)

##### What are Virtual Pageviews?

Adapted From [Google's Documentation](https://developers.google.com/analytics/devguides/collection/gajs/asyncMigrationExamples#VirtualPageviews)

> Use the `analytics.virtualPageview()` method along with a URL path you fabricate in order to track clicks from users that do not lead to actual website pages on your site. For example: a modal pop-up with a form a user needs to complete to progress is equivilent to a pageview even if it's loaded asynchronously. In general, we recommend you use `analytics.event()` for tracking downloads, outbound links, PDFs or similar kinds of user interactions within a page.
> This is because virtual pageviews will add to your total pageview count. But if you need to track the sequentional user flow from actual pages to virtual pages, use virtual pageviews.

The `virtualPageview` method is used to record custom GA virtualPageviews using either the old [ga.js API](https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration#_gat.GA_Tracker_._trackPageview), or the newer [analytics.js API](https://developers.google.com/analytics/devguides/collection/analyticsjs/pages).

It takes one argument:
* `virtualPagePath` - A required string that is unique to the virtual pageview you want to track

NOTE: the 'virtualPagePath' value will be prefixed in GA reports with `/virtual/` to distinguish these custom tracked 'hits' and to avoid clashes with existing (or potential page URLs).

Usage is the same as the event() method documented above.

```
analytics.virtualPageview('create-user-account-modal');
```

#### conversionGoal(action, options)

The `conversionGoal` method is used to record Optimizely [https://help.optimizely.com/hc/en-us/articles/200039925](Custom Event Goals) and [https://help.optimizely.com/hc/en-us/articles/200039865](Revenue Tracking).

It takes two arguments:
* `action` - A required string that is used in the Optimizely admin interface during experiment setup. This string must match exactly to count as a conversion in a given experiment. Unlike GA events, the Optimizely `action` is *not* converted to Title Case. Avoid using spaces.
* `options` - An optional set of extra arguments:
  * `valueInCents` - An optional integer that can be used to track revenue in A/B and multivariate testing experiments

NOTE: the data types of the optional properties on `options` are important, and mismatches
will cause values to be ignored.

Include `webmaker-analtics` in your page as shown in the GA examples above. Either directly, or as part of a Require.js module.

Example: Non-financial conversion

```html
<script src="//cdn.optimizely.com/js/XXXXXXXXXXXXXXXXX.js"></script>
<script src="analytics.js"></script>
<script>
  ...
  function createAccount() {
    analytics.conversionGoal("WebmakerAccountCreated");
    account.save();
  }
</script>
```

Example: Financial conversion

```html
<script src="//cdn.optimizely.com/js/XXXXXXXXXXXXXXXXX.js"></script>
<script src="analytics.js"></script>
<script>
  ...
  function showDonationThanks() {
    analytics.conversionGoal("Donation", {valueInCents: 300});
    // etc
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
