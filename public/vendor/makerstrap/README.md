# Makerstrap

**A Bootstrap theme based on [Webmaker's style guide](https://wiki.mozilla.org/Webmaker/styleguide)**

Check out our [demo page](http://mozilla.github.io/makerstrap/demo/#/), which showcases much of what Makerstrap can do.

## Usage

```
bower install makerstrap
```

## How lazy are you?

### Real frikin lazy

Includes Font Awesome and Open Sans automagically via @import. *Don't use this in production please.*

```html
<link rel="stylesheet" href="bower_components/makerstrap/makerstrap.complete.min.css">
```

### Somewhat lazy

Includes Font Awesome and Open Sans from a CDN.

```html
<link href="https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,700italic,400,300,700" rel="stylesheet">

<link href="https://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">

<link href="bower_components/makerstrap/makerstrap.min.css" rel="stylesheet">
```

### Actually, I'm a ninja, hit me

This is for LESS importing:

```css

@import 'bower_components/makerstrap/less/makerstrap';
@makerstrap-bower-path: '../bower_components';

```

## Contributing

### Development environment

1. Install bower and grunt-cli if you don't have them:

  ```bash
  npm install -g bower
  npm install -g grunt-cli
  ```

2. Clone this repo: `git clone https://github.com/mozilla/makerstrap.git`
3. Run `npm install` from inside the `makerstrap` directory.
4. Run `grunt` to start the dev server and LESS watch task, navigate to `http://localhost:1944` to see the demo page.
5. The main LESS files are in the `less/` directory.
6. Read [http://getbootstrap.com/css/#less](http://getbootstrap.com/css/#less) to orient yourself on extending Bootstrap with LESS.

### Submitting a Pull Request

Be sure to run `grunt build` and commit the generated files to your patch if you modify any of the LESS files. This ensures that people using the library as a dependency will get the latest compiled CSS.
