Ceci
====

Ceci n'est pas une web component!

Ceci provides the foundational building blocks of [Appmaker](https://github.com/mozilla-appmaker/appmaker), implemented as a set of [Polymer](http://polymer-project.org/) components.

## Overview

The `<ceci-*>` elements inside a `<ceci-app>` are connected to one another using a simple broadcast/listen model. Elements listen for activity on channels (e.g. red, blue, yellow, monkey, aleph, zoiks), and consequently named functions (e.g. `element.bar()`) are called. For example, if an element `<ceci-foo>` has a child `<ceci-listen on="red" for="bar">`, a message on the `red` channel, will call the `bar` function on `<ceci-foo>`.

To broadcast a message on a channel, components use `this.broadcast(name, data);`, where `this` is the element's scope (likely within the Polymer definition), `name` is the name of the broadcast (as listed in the `broadcasts` section of the ceci definition; outlined below), and `data` can be some associated data which a listener can use. For example, `<ceci-broadcast on="red" from="baz">` defines a broadcast which will occur on the `red` channel, corresponding to a broadcast called as `this.broadcast('baz', 'boop');`.

## Atomic Elements

### ceci-element

`ceci-element.html`

Component from which all other Appmaker components should be extended. Here's a implementation breakdown for a simple ceci component:


```
<polymer-element name="ceci-bang"
  extends="ceci-element"
  attributes="label bangs maxbangs"
  label="Bang!" bangs="0" maxbangs="10">
```
Ceci components are standard Polymer components which extend `ceci-element`. Attributes should be published via `attributes`, each of which may have a default. For more information see http://www.polymer-project.org/polymer.html.


```
  <template>
    <style>
      :host {
        display: block;                                           /* elements are display:inline by default */
        text-align: center;
      }
    </style>
```
A component must have a `<template>` element, which details the component's [ShadowDOM](http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom/). `<style>` or `<link rel="stylesheet">` can be used to provide CSS.

```
    <div>Bangs: {{bangs}}/{{maxbangs}}</div>                      <!-- use Polymer {{attribute}} data-binding -->
    <button id="button" on-click="{{click}}">
      {{label}}                                                   <!-- use Polymer {{eventListener}} behavior-binding -->
    </button>
```
Polymer's data-binding functionality can be used to connect attributes to content, using `{{attributeName}}`. The value of `on-*` attributes correspond to properties on the Polymer object (below) which are attached as appropriate event handlers.

```
    <shadow></shadow>                                             <!-- include ceci-element's <template> too -->
```
The `<shadow>` tag should be included in a component's `<template>` to include `<ceci-element>`'s ShadowDOM as well.


```
    <script type="text/json" id="ceci-definition">
      {
```
To define a ceci component, a `<script>` must exist within the `<template>`, identified with `id="ceci-definition"`.

```
        "tags": ["bang", "click", "tap"],
        "thumbnail": "./thumbnail.png",
```
Appmaker makes use of `tags` as a component discoverability tool. Keywords related to the component should be listed here. To provide some graphical representation of the component (without rendering the component itself) a thumbnail image may be specified.
```
        "broadcasts": {
          "bang": {
            "label": "Bang!",
            "description": "Bang is initiated.",
            "default": true
          },
          "maxReached": {
            "label": "Max Reached",
            "description": "Maximum bangs have occured.",
            "default": true
          }
        },
```
Each potential broadcast should be defined within the `broadcasts` object. Each definition should adhere to this specification:

* `label` A human-readable label which will be displayed in place of broadcast name where possible to assist users. (Can be localized).
* `description` A human-readable description for the broadcast which will be exposed where possible to assist users. (Can be localized).
* `default` _Optional_ If `true`, a corresponding `<ceci-broadcast>` is inserted immediately after element is created.

```
        "listeners": {
          "reset": {
            "description": "Resets bang counter.",
            "label": "Reset Counter"
          }
        },
```
Listeners defined in the `listeners` object are exposed for use with `<ceci-listen>` elements. Each definition should adhere to this specification:

* `label` A human-readable label which will be displayed in place of listener name where possible to assist users. (Can be localized).
* `description` A human-readable description for the listener which will be exposed where possible to assist users. (Can be localized).
* `default` _Optional_ If `true`, a corresponding `<ceci-listen>` is inserted immediately after element is created.
```
        "attributes": {
          "label": {
            "label": "Label",
            "description": "Text shown on the button.",
            "editable": "text",
            "listener": true,
            "defaultListener": true
          },
          "maxbangs": {
            "label": "Maximum Bangs",
            "description": "Max number of bangs allowed.",
            "editable": "text"
          }
        }
```
Each attribute listed in `attributes` in the `<polymer-element>` definition can be exposed for use with ceci. Each definition should adhere to this specification:

* `label` A human-readable label which will be displayed in place of attribute name where possible to assist users. (Can be localized).
* `description` A human-readable description for the attribute which will be exposed where possible to assist users. (Can be localized).
* `editable` _Optional_ If specified, exposed for an editor (e.g. the Appmaker designer). Values such as `text` and `color` can be used as hints to an editor as to which widget/method should be used to manipulate this attribute.
* `listener` _Optional_ If `true`, a corresponding `set_<attribute name>` function will be attached to the element and exposed as a listener which automatically manipulates this attribute. If this value is a string, it will be used as the function for the listener instead.
* `defaultListener` _Optional_ If `true`, a corresponding `<ceci-listen>` is inserted immediately after element is created.
```
      }
    </script>
  </template>
```

```
  <script>
    Polymer('ceci-bang', {                                        // Make sure first arguments matches "name" attribute in <polymer-element> tag.
      ready: function () {
        this.super();                                             // Must be called to provie a ceci element functionality.
      },
      checkMax: function () {                                     // Not exposed to ceci.
        if (Number(this.bangs) > Number(this.maxbangs)) {         // Cast attributes to numbers for comparison.
          this.bangs = this.maxbangs;
          this.broadcast('maxReached', this.bangs);               // Broadcast the "maxReached" message.
        }
      },
      click: function () {                                        // Connected to <button> in <template> via on-click="{{click}}" behavior-binding
        this.bangs = Number(this.bangs) + 1;                      // Change the "currentbang" attribute. Managed by Polymer automatically.
        this.checkMax();
        this.broadcast('bang', this.bangs);                       // Broadcast the "bang" message (w/ number of bangs).
      },
      maxbangsChanged: function (oldValue, newValue) {            // Polymer signals when the maxbangs attribute changes
        this.checkMax();
      },
      reset: function (value) {                                   // Not accessible via attribute manipulation -- only <ceci-listen>.
        this.bangs = value || 0;
      }
    });
  </script>
</polymer-element>
```
Finally, outside of the `<template>`, a `Polymer` definition is provided.

#### Complete Listing
```
<polymer-element name="ceci-bang"
  extends="ceci-element"
  attributes="label bangs maxbangs"
  label="Bang!" bangs="0" maxbangs="10">
  <template>
    <style>
      :host {
        display: block;                                           /* elements are display:inline by default */
        text-align: center;
      }
    </style>
    <div>Bangs: {{bangs}}/{{maxbangs}}</div>                      <!-- use Polymer {{attribute}} data-binding -->
    <button id="button" on-click="{{click}}">
      {{label}}                                                   <!-- use Polymer {{eventListener}} behavior-binding -->
    </button>
    <shadow></shadow>                                             <!-- include ceci-element's <template> too -->
    <script type="text/json" id="ceci-definition">
      {
        "tags": ["bang", "click", "tap"],
        "thumbnail": "./thumbnail.png",
        "broadcasts": {
          "bang": {
            "label": "Bang!",
            "description": "Bang is initiated.",
            "default": true
          },
          "maxReached": {
            "label": "Max Reached",
            "description": "Maximum bangs have occured.",
            "default": true
          }
        },
        "listeners": {
          "reset": {
            "description": "Resets bang counter.",
            "label": "Reset Counter"
          }
        },
        "attributes": {
          "label": {
            "label": "Label",
            "description": "Text shown on the button.",
            "editable": "text",
            "listener": true,
            "defaultListener": true
          },
          "maxbangs": {
            "label": "Maximum Bangs",
            "description": "Max number of bangs allowed.",
            "editable": "text"
          }
        }
      }
    </script>
  </template>
  <script>
    Polymer('ceci-bang', {                                        // Make sure first arguments matches "name" attribute in <polymer-element> tag.
      ready: function () {
        this.super();                                             // Must be called to provie a ceci element functionality.
      },
      checkMax: function () {                                     // Not exposed to ceci.
        if (Number(this.bangs) > Number(this.maxbangs)) {         // Cast attributes to numbers for comparison.
          this.bangs = this.maxbangs;
          this.broadcast('maxReached', this.bangs);               // Broadcast the "maxReached" message.
        }
      },
      click: function () {                                        // Connected to <button> in <template> via on-click="{{click}}" behavior-binding
        this.bangs = Number(this.bangs) + 1;                      // Change the "currentbang" attribute. Managed by Polymer automatically.
        this.checkMax();
        this.broadcast('bang', this.bangs);                       // Broadcast the "bang" message (w/ number of bangs).
      },
      maxbangsChanged: function (oldValue, newValue) {            // Polymer signals when this attribute changes
        this.checkMax();
      },
      reset: function (value) {                                   // Not accessible via attribute manipulation -- only <ceci-listen>.
        this.bangs = value || 0;
      }
    });
  </script>
</polymer-element>


```

### ceci-listen

`ceci-listen.html`

Provides listening capabilities to ceci elements. When a message is broadcasted on a channel corresponding to a `<ceci-listen>`'s `on` attribute, the listen element calls the function specified in the `for` attribute on the nearest `ceci-` parent element.

For example here's a populated `ceci-sandwich` component:

```
<ceci-sandwich>
  <ceci-listen on="orange" for="addOnions" />
  <ceci-listen on="blue" for="applyHorseradish" />
  <ceci-listen on="red" for="addCornedBeef" />
  <ceci-listen on="yellow" for="applyMustard" />
  <ceci-listen on="green" for="addLettuce" />
  <ceci-listen on="brown" for="addBun" />
  <ceci-listen on="black" for="squish" />
  <ceci-listen on="purple" for="serve" />
</ceci-sandwich>
```

When an `orange` broadcast occurs, the `addOnions` function on `<ceci-sandwich>` is called. For `purple`, the `serve` function, and so forth.

### ceci-broadcast

`ceci-broadcast.html`

Provides broadcasting capabilities to ceci elements. When the `broadcast` function is called from within a ceci element, its enclosed `<ceci-broadcast>` elements provide a mapping for which channel should be used.

For example, here's a populated `ceci-customer` component:

```
<ceci-customer>
  <ceci-broadcast on="red" from="askForSuperSize" />
  <ceci-broadcast on="yellow" from="askForMustard" />
  <ceci-broadcast on="black" from="complain" />
  <ceci-broadcast on="purple" from="pay" />
</ceci-customer>
```

Inside the `ceci-customer` component, an `askForSuperSize` broadcast may occur, which will cause a message to be sent out on the `red` channel. For `broadcast("askForMustard")`,  a `yellow` message; for `broadcast("complain")`, `black`; and so forth.

### ceci-card

`ceci-card.html`

Cards wrap elements so that they may be presented in groups. Cards with the `visible` attribute set to `true` will be visible. Since cards are not meant to be shown in parallel, only one card should have the `visible` attribute in a given moment.

```
<ceci-card visible="true">
  <ceci-button></ceci-button>
    ...
</ceci-card>
<ceci-card>
  <ceci-counter></ceci-counter>
    ...
</ceci-card>
```

### ceci-app

`ceci-app.html`

Apps contain all the cards and components associated with an Appmaker app. Appmaker gives `<ceci-app>` a unique id using the `id` attribute. This format is designed to be portable, so moving copying and pasting  `<ceci-app>...</ceci-app>` should offer consistent functionality.

```
<ceci-app id="[unique-app-id]">
  <ceci-card>
    ...
  </ceci-card>
</ceci-app>
```

For more background info, check out http://secretrobotron.tumblr.com/post/68158562075/ceci-nest-pas-une-web-component.

## Element Hierarchies

![ceci](http://4.bp.blogspot.com/_kwoeqBU-2wY/TPT-ozX_VOI/AAAAAAAAAAw/38I4JYbsbEA/s1600/Margritti+this+is+not+a+pipe.jpg)
