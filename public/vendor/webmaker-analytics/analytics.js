(function(global, factory) {
  if(typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global.analytics = factory();
  }
}(this, function() {

  // Make sure _gaq is on the global so we don't die trying to access it
  if(!this._gaq) {
    this._gaq = [];
  }

  // Use hostname for GA Category
  var _category = location.hostname,
      _redacted = "REDACTED (Potential Email Address)";

  /**
   * To Title Case 2.1 - http://individed.com/code/to-title-case/
   * Copyright 2008-2013 David Gouch. Licensed under the MIT License.
   * https://github.com/gouch/to-title-case
   */
  function toTitleCase(s){
    var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
    s = trim(s);

    return s.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title){
      if (index > 0 &&
          index + match.length !== title.length &&
          match.search(smallWords) > -1 &&
          title.charAt(index - 2) !== ":" &&
          (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
          title.charAt(index - 1).search(/[^\s-]/) < 0) {
        return match.toLowerCase();
      }

      if (match.substr(1).search(/[A-Z]|\../) > -1) {
        return match;
      }

      return match.charAt(0).toUpperCase() + match.substr(1);
    });
  }

  // GA strings need to have leading/trailing whitespace trimmed, and not all
  // browsers have String.prototoype.trim().
  function trim(s) {
    return s.replace(/^\s+|\s+$/g, '');
  }

  // See if s could be an email address. We don't want to send personal data like email.
  function mightBeEmail(s) {
    // There's no point trying to validate rfc822 fully, just look for ...@...
    return (/[^@]+@[^@]+/).test(s);
  }

  function warn(msg) {
    console.warn("[analytics] " + msg);
  }

  // Support both types of Google Analytics Event Tracking, see:
  // ga.js - https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
  // analytics.js - https://developers.google.com/analytics/devguides/collection/analyticsjs/events
  function _ga(options) {
    // If the new analytics.js API is present, fire this event using ga().
    if(typeof this.ga === "function") {
      // Transform the argument array to match the expected call signature for ga(), see:
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/events#overview
      var fieldObject = {
        'hitType': 'event',
        'eventCategory': _category,
        'eventAction': options.action
      };
      if(options.label) {
        fieldObject['eventLabel'] = options.label;
      }
      if(options.value || options.value === 0) {
        fieldObject['eventValue'] = options.value;
      }
      if(options.nonInteraction === true) {
        fieldObject['nonInteraction'] = 1;
      }
      this.ga('send', fieldObject);
    }

    // Also support the old API. Google suggests firing data at both to be the right thing.
    var eventArgs = ['_trackEvent', _category, options.action];
    if(options.label) {
      eventArgs[3] = options.label;
    }
    if(options.value || options.value === 0) {
      eventArgs[4] = options.value;
    }
    if(options.nonInteraction === true) {
      eventArgs[5] = true;
    }
    _gaq.push(eventArgs);
  }

  function event(action, options) {
    options = options || {};
    var eventOptions = {},
        label = options.label,
        value = options.value,
        // Support both forms to deal with typos between the 2 APIs
        nonInteraction = options.noninteraction || options.nonInteraction;

    if(!action) {
      warn("Expected `action` arg.");
      return;
    }
    if(mightBeEmail(action)) {
      warn("`action` arg looks like an email address, redacting.");
      action = _redacted;
    }
    eventOptions.action = toTitleCase(action);

    // label: An optional string to provide additional dimensions to the event data.
    if(label) {
      if(typeof label !== "string") {
        warn("Expected `label` arg to be a String.");
      } else {
        if(mightBeEmail(label)) {
          warn("`label` arg looks like an email address, redacting.");
          label = _redacted;
        }
        eventOptions.label = trim(label);
      }
    }

    // value: An optional integer that you can use to provide numerical data about
    // the user event.
    if(value || value === 0) {
      if(typeof value !== "number") {
        warn("Expected `value` arg to be a Number.");
      } else {
        // Force value to int
        eventOptions.value = value|0;
      }
    }

    // noninteraction: An optional boolean that when set to true, indicates that
    // the event hit will not be used in bounce-rate calculation.
    if(nonInteraction) {
      if(typeof nonInteraction !== "boolean") {
        warn("Expected `noninteraction` arg to be a Boolean.");
      } else {
        eventOptions.nonInteraction = nonInteraction === true;
      }
    }

    _ga(eventOptions);
  }

  return {
    event: event
  };

}));
