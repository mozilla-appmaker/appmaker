# jqueryui-amd

A conversion script for translating [jQuery UI](http://jqueryui.com/) files into
[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) JavaScript modules.

The modules can be loaded by AMD script loaders like [RequireJS](http://requirejs.org).

## Installing

The script requires nodejs 0.6 to run. Use npm to install it:

    npm install -g jqueryui-amd

## Using

    jqueryui-amd path/to/jquery-ui-version

## What happens

It is assumed a full source directory of jQuery UI is given to the conversion
script. So, the directory should have a **ui** directory inside of it with the
.js files for jQuery UI.

The script will a `jqueryui` directory that lives inside the directory given to
the conversion script. The AMD modules will be inside the `jqueryui` directory.

Taking the example above, the **path/to/jqueryui-version**
directory above would have the following contents (items that can be deleted if
you do not use them -- they are not strictly part of making the example
work -- are marked with a (d) below):

* jqueryui-version
    * AUTHORS.txt
    * demos (d)
    * docs (d)
    * external (d)
    * GPL-LICENSE.txt
    * jquery-1.4.4.js (d)
    * **jqueryui** (directory created by convert)
    * MIT-LICENSE.txt
    * tests (d)
    * themes
    * ui (d)
    * version.txt

The conversion process transformed the following files:

* jqueryui-1.8.14/ui/jquery.ui.?.js --> jqueryui-1.8.14/jqueryui/?.js
* jqueryui-1.8.14/ui/jquery.effects.?.js --> jqueryui-1.8.14/jqueryui/effects/?.js
* jqueryui-1.8.14/ui/i18n/jquery.ui.datepicker-?.js --> jqueryui-1.8.14/jqueryui/datepicker-?.js

These file/path name changes were done to fit better with module path expectations,
and to make it easier/less typing to load the files.

## Configuring AMD loading

Once the conversion is done, either configure the location to jqueryui in
the AMD loaders config. Example for requirejs:

```javascript
requirejs.config({
    paths: {
        jqueryui: 'path/to/jquery-ui-version/jqueryui'
    }
});
```

Or just place the `path/to/jquery-ui-version/jqueryui` directory directly in
the `baseUrl` for the AMD project.

Then, just reference the modules with a `jqueryui` prefix:

```javascript
define(['jquery', jqueryui/widget', 'jqueryui/button'], function ($) {
    //Use widget and button in here, off of the given $ variable.
});
```

## Example

The **example** directory contains an example that includes a sample web
project, in the **webapp** directory, along with the RequireJS optimizer, r.js.
Run the webapp/app.html file to see the example in action.d

## Constraints

This script assumes a directory for jQuery UI contains a `ui` directory.

This script will need to be revisited if:

* the naming convention of jquery.something.plugin.js changes.
* the i18n approach changes.
* more i18n files appear that are not for datepicker.
