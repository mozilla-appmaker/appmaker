So you want to make a component?
That's great, we want to work with you! In this guide you'll learn  what components are, how they are built, how to make your own and finally how to submit your finished component to Appmaker.

##Index

1. [What is a Component?](#1---what-is-a-component)
2. [How are Components Built?](#2---how-are-components-built)
3. [Creating your own Component](#3---creating-your-own-component)
4. [Submitting your Component to Appmaker](#4---submitting-your-component-to-appmaker)

##1 - What is a Component

Components are the basic building blocks of Appmaker apps. Page headings, buttons and counters are all examples of components -- small, distinct units of functionality or interface that can be linked together to create a complex app.

#### How do components communicate?
Components can broadcast and listen on colored channels. A component can have any  number of named broadcast or listener methods, which a component author can configure in the Appmaker designer. Broadcast and listener methods  can also be configured to be on by default. In the Appmaker app designer view, the Broadcasts are configured on the  right-hand side of each component, the Listeners on the left.

#### An example
In  this example, the Button component broadcasts a "Click" message when  clicked or tapped, and the Counter listens to it with it's CountUp method, increasing the counter.

[Check Sample App](https://appmaker.mozillalabs.com/designer?remix=http%253A%252F%252Fbroad-plants-495.appalot.me%252Findex.html)

##2 - How are Components Built?
Components are built with HTML, CSS & Javascript using a framework called 
[Polymer](http://www.polymer-project.org/polymer.html).

####Introducing the Counter component
Let's look at the Counter component to get started. It counts up or down when it receives a signal and keeps track of the count.

Check out the [Start Here Component repo](https://github.com/mozilla-appmaker/start-here).

* The **HTML & Javascript** live in [component.html](https://github.com/mozilla-appmaker/component-counter/blob/gh-pages/component.html)
* The **CSS** styles live in [component.css](https://github.com/mozilla-appmaker/component-counter/blob/gh-pages/component.html)

This convention holds true for all components, although you can link external CSS files to your component as well.

####Parts of a Component

1. [Component Name](#component-name)
2. [Broadcast Methods](#broadcast-methods)
3. [Listener Methods](#listener-methods)
4. [Editable Attributes](#editable-attributes)
5. [Styling a Component](#styling-a-component)

#### Component Name
The component name must include a `ceci-` prefix and is set in two places, where it must match.

1. The component tag - `<polymer-element name="ceci-counter" extends="ceci-element" attributes="unit increment value>`
2. The Polymer definition - `Polymer("ceci-counter", { …`

There is also a name in the `ceci-definition` of the component, but this is used for localization and doesn't have to match the previous two names. You can ignore it for now.

* The ceci-definition - `<script type="text/json" id="ceci-definition"> { "name": "Counter", …`


#### Broadcast Methods
A component can have any number of broadcast methods (or none). Here's the Counter component's `count` broadcast. It sends out the value of the current count. Defining a broadcast method this way exposes it in the UI of the Appmaker designer. Component authors can turn on the `count` broadcast by assigning it a channel color.

```
"broadcasts": {
  "currentCount": {
    "label": "Current Count",
    "description": "Broadcasts the current count."
  }
}
```

* "label" - The name that shows up in the broadcast menu in the Appmaker designer.
* "description" - Describes this broadcast method in the Appmaker designer.
* "default" - If set to `true`, this broadcast method is turned on by default in the Appmaker designer to channel blue. You can also set the color explicitly. The options are:
 * blue
 * purple
 * pink
 * red
 * orange
 * yellow
 * green

**Calling the broadcast method**

To use the `count` broadcast in the component code, you have to call the component's built-in broadcast method, like this...

```
this.broadcast("currentCount", this.value);

```

The second parameter (this.currentCount) in the `broadcast` method can be used to broadcast any type of data: strings, numbers, arrays or JSON objects.

#### Listener Methods
Listeners are methods that wait for an incoming broadcast on a specific colored channel, and are triggered when they receive one. Here's the countUp listener for the Counter component.

```
"listeners": {
  "countUp": {
    "description": "Increment the current count by the increment value",
    "label": "Count Up",
    "default" : true
  }
}
```

When the countUp listener is turned on and receives a signal on the color it's listening on, it triggers the corresponding function inside the component. This causes the counter to count up by it's increment.

```
countUp: function() {
  this.value = Number(this.value) + Number(this.increment, 10);
}
```

To make use of the value that is sent in the broadcast, we can use a variable inside of the listener function, in this case 'countby'. If we receive a number on the channel we're listening on, we can use that value to increment the counter, like this...

```
countUp: function(countby) {
  this.value = Number(this.value) + Number(countby, 10);
}
```

####Editable Attributes

Components have editable attributes. The Appmaker designer exposes these attributes in the right-hand column when a component is selected and let the app author modify them.

Here are the editable properties for the Counter

```
"attributes": {
  "unit": {
    "description": "Name for items which are being counted.",
    "label": "Unit",
    "editable": "text"
  },
  "increment": {
    "description": "Count up or down with this number.",
    "label": "Increment By",
    "editable": "number",
    "min" : 1
  }
}
```

* "label" - Label the attribute editing UI in the Appmaker designer
* "designer" - Description for the attribute in the Appmaker designer
* "editable" - the type of value that is expected, will determine the editing UI in the Appmaker designer

**Types of Editables**
* "text" - shows a basic text input
* "number" - shows a number input and also looks for optional "min" and "max" values.
* "boolean"- shows a checkbox the value of the attribute to either "true" or "false"
* "colorpicker" - shows a colorpicker 

Within your component, you can access the attribute value `this.attributename`.

**Attributes as Listeners**

You can also make your attributes into listeners automatically to change their value. Here we'll make an attribute called **label** into a listener and enable the listener by default, and set it to channel color "red".

```
"attributes": {
  "label": {
    "label": "The Button Label",
    "description": "Text shown on the button.",
    "editable": "text",
    "defaultListener" : "red",
    "listener": true
  },
}
```

####Styling a Component

Components take up the full width of an app and stack vertically, so keep that in mind when designing your components.

Styles for a component are in the [component.css](https://github.com/mozilla-appmaker/component-counter/blob/gh-pages/component.css) file.

The **:host** prefix inside the stylesheet directly references the component and scopes nested selectors as well so include it in front of all of your rules.

```
:host {
  display: block;
  width: 100%;
  height: 50px;
}

:host .counter {
  line-height: 3.8rem;
  text-align: center;
  font-size: 1.6rem;
  font-family: "FiraSans", sans-serif;
  padding: .5rem 0rem;
  background: #0Da;
  color: #666;
}
```

##3 - Creating your own Component

####Option 1 - Use the start-here component template repo

To help you create your first component, we've provided the **[start here repo](https://github.com/mozilla-appmaker/start-here/)**. It will help you create your first component and run it locally in your environment while you're working on it. Follow the  instructions in the README.md file to get started.

Once you have the component running locally, you can add it to Appmaker and any changes you make to the local component files will immediately take effect in the designer.

**Caution:** This component will only work inside Appmaker as long as the local server is running it, so eventually you'll want to host the component on [GitHub Pages](http://pages.github.com/) and add it to Appmaker from there. This process is described next...

####Option 2 - Add a Component from GitHub pages

You can also add a Component to Appmaker if it is hosted on [GitHub Pages](http://pages.github.com/). To do so...
 
1. Create a component and host it on GitHub.
2. Make sure the component lives on a branch called gh-pages.
3. In Appmaker, find the **Add Component** feature in user account dropdown (top right of the editor).
4. Add the URL of the component on branch gh-pages.

**Caution Again:** While users can install an app with your custom components, your components will not load for other Appmaker authors when they're remixing your app.

##4 - Submitting your Component to Appmaker
Did you make an awesome component that you think everyone should be able to use? Great, here's what you do...

1. Publish the component somewhere on GitHub.
2. Add an issue to the [Appmaker Issues List](https://github.com/mozilla-appmaker/appmaker/issues) with link to the repo, a description of the component and tag the issue with the **Proposed Component** label.
3. We'll review your component and add it to Appmaker.

Components should also have unit tests and be localized, and we'll provide guides for that in the near future.
