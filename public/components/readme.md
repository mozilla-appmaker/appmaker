Components
==========

A components system for visual programming.

CAUTION: this spec WILL change.

How to Write a Component
------------------------

Create a template tag. The template tag is a new HTML5 tag that makes anything inside inert.

```
<template></template>
```

Give your template tag an id, which will serve as the tagname of the component:

```
<template id="moz-button"></template>
```

Now add to your component by putting HTML inside it:

```
<template id="moz-button">
  <button>Click me</button>
</template>
```


How to Use a Component
----------------------

First, include jQuery and the Components library:

```
<script type="text/javascript" src="jquery-1.9.1.js"></script>
<script type="text/javascript" src="components.js"></script>
```

You can now include your component on a page like so:

```
<moz-button></moz-button>
```



How to add styles to a Component
-------------------------------

Components should ship with minimal styles. To stylize a component, just use normal CSS:

```
.moz-button button{
  background: blue;
  color: white;
  width: 200px;
}
```


How to Link Components
----------------------

Components implements a very simple channel system to allowing components to communicate to each other.

Each component can broadcast to a single channel. Using colors to represent channels seems to
be a good convention. The default channel is 'blue'.

You can change what channel a component broadcasts to by changing the broadcasts-to attribute:

```
<moz-counter broadcasts-to="red"></moz-button>
```

To get your component to broadcast something, have you component trigger a 'broadcast' event on the component instance:

```
<template id="moz-button">
  <div onclick="$(this).parent().trigger('broadcast', 'click')" style="">Click Me</div>
</template>
```

Each component can listen to a single channel. The default channel is 'blue'.

You can change what channel a component listens to by changing the listens-to attribute:

```
<moz-counter listens-to="red"></moz-button>
```

To get your component to do something when a message comes in, assign a dblclick attribute to your component definition:

```
<template id="moz-counter" ondblclick="$(this).find('div').text(parseFloat($(this).text()) + 1)">
  <div style="width: 100px; height: 100px; font-size: 50px;">2</div>
</template>
```






