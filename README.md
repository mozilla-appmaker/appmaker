Appmaker
========

Running the Server
------------------

### Dependencies

Execute `npm install` in the application directory:

### Running in Development mode

#### Configuration for Node

Copy and edit your .env file. -- This should never be committed to the repo.

```
cp sample.env .env
```

A short explanation of a complete `.env` file:
```
COOKIE_SECRET=A long, complex string for cookie encryption.
ASSET_HOST=Location of the javascript, css, fonts, and images that will be used by the designer and published assets.
COMPONENTS_BASE_URL=An appmaker-components repo which Ceci will query. Likely "//appmaker-components.herokuapp.com/"
S3_BUCKET=S3 bucket name. e.g. "my.coolappmaker.com"
S3_KEY=An access key for the S3 bucket listed above.
S3_SECRET=The secret corresponding to the specified S3 access key.
S3_OBJECT_PREFIX=String to prepend S3 objects. Useful for storing objects in folders. E.g. "level1/level2" => <bucket>/level1/level2/<filename>.
PUBLISH_URL_PREFIX=String to prepend to filenames that are saved on S3. Try use the URL that matches the protocol from which assets are hosted to avoid mixed content blockage.
```

### Start the Server

```
foreman start
```

If you need foreman:

```
sudo gem install foreman
```

Authoring Components:
---------------------

Ideas to get you started:
https://github.com/mozilla/appmaker/wiki/Component-Ideas



Style Guide
-----------

### Introduction

The purpose of this Style Guide is to provide a single reference for visual styles and design elements used in Appmaker. 

The overall design approach is based on making building apps fun and gamelike. We want the site’s content and design to 1) encourage play and exploration 2) encourage non developers to think like programmers 3) enable anyone to build and customize apps that matter to them.

The visual guidelines outlined here are based on Appmaker’s fundamental characteristics, communicating a sense of fun, exploration, and play while building a space where developers and non developers can collaborate to create new and meaningful apps.

### Firefox OS Component Guide

Looking for guidance on how to make cool Firefox OS style components? Fret not, Firefox OS has its own [component guide](http://buildingfirefoxos.com/building-blocks/action-menu.html).

### Color Palette

The color palette describes the colors used in the Appmaker app. It is not intended to be a color guide for components, though you are certainly welcome to use it that way.


**Appmaker Blue** - Critical call to action 

```css
background-color: #358CCE
```

**Appmaker Orange** - Primary call to action 

```css
background-color: #FF7B00
```

**Appmaker Green** - Selected item 

```css
background-color: #55B12E
```

**Almost Black** - Page background 

```css
background-color: #111111
```

**Gray Black** - Default text

```css
color: #222222
```

**Dark Gray** - Side Panel 

```css
background-color: #333333
```

**Medium Gray** - Secondary call to action 

```css
background-color: #555555
```

**Gray** - Side Panel

```css
background-color: #CCCCCC
```

**Medium Light Gray** - Container background 

```css
background-color: #DDDDDD
```

**Light Gray** - Component background 

```css
background-color: #EEEEEE
```

### Buttons

Describe buttons here.

### Elements

Describe elements here.

### Grid/Layout

Describe layout here.

### Editable Properties

Describe input styles/types here.
=======
