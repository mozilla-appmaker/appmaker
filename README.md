# Appmaker

[![Build Status](https://travis-ci.org/mozilla-appmaker/appmaker.svg?branch=develop)](https://travis-ci.org/mozilla-appmaker/appmaker)
[![devDependency Status](https://david-dm.org/mozilla-appmaker/appmaker/dev-status.svg)](https://david-dm.org/mozilla-appmaker/appmaker#info=devDependencies)

Welcome to Appmaker (beta).

Appmaker is a tool that helps anyone, not just developers, create mobile applications.

Appmaker apps are composed of web components, custom/resusable HTML tags, connected with events and listeners.

To learn more about web components, check out the [Polymer Project](http://www.polymer-project.org/).

More resources:

  * The [Appmaker website](https://appmaker.mozillalabs.com/).
  * The `#appmaker` channel on [irc.mozilla.org](http://irc.mozilla.org/).
  * A [youtube video](http://www.youtube.com/watch?v=RaRIdLgZTPI&feature=youtu.be) (that's already dated, but better than nothing).
  * [Appmaker -- why, what how](https://github.com/mozilla/appmaker-words/wiki) provides additional context about the motivation and use cases for the project, written before any code was forged.
  * The [ROADMAP.md](https://github.com/mozilla-appmaker/appmaker/blob/develop/ROADMAP.md) and [CONTRIBUTING.md](https://github.com/mozilla-appmaker/appmaker/blob/develop/CONTRIBUTING.md) documents in this directory.

## Getting Started

This section covers how to get Appmaker running locally. The workflow is optimized for contributors.

### Dependencies

Make sure you have `nodejs`, `npm`, and `git` installed.

`grunt` is required to run the test suite. To install grunt on unix and OS X,
run `sudo npm install -g grunt-cli`.

We manage client-side dependencies using [bower](http://bower.io/). In order to add/remove these dependencies, you need to have `bower` installed globally on your machine, which can be done on unix and OS X via
`sudo npm install bower -g`.

[Webmaker Login](https://github.com/mozilla/login.webmaker.org) is required to log into the app. [Follow these instructions exactly](https://github.com/mozilla/login.webmaker.org#getting-the-server-up-and-running-locally) to run it locally

### Forking And Cloning The Repository

Create a root `mozilla-appmaker` directory:
```
mkdir mozilla-appmaker
cd mozilla-appmaker
```

[Fork](https://help.github.com/articles/fork-a-repo) this repository, and
then clone your fork into the `mozilla-appmaker` directory:
```
git clone git@github.com:<your GitHub username>/appmaker.git appmaker
```

Your directory structure should look like this:
```
mozilla-appmaker/
  ├── appmaker/
```

Configure remote:
```
cd appmaker
git remote add upstream git@github.com:mozilla-appmaker/appmaker.git
git fetch upstream
```

### Environment Setup And Configuration

Install Node packages:
```
npm install
```

Configure your env:
```
cp sample.env .env

```

A short explanation of a complete `.env` file:

```
MONGO_URL: REQUIRED - the URI for your mongod instance and database, for example mongodb://localhost/appmakerdev (or whatever your database is named)
LOGINAPI: REQUIRED - The URI of a Webmaker login server to use for user authentication. for exmaple http://localhost:3000
LOGINAPI_WITH_AUTH: - The URI of a Webmaker login server, including basic authentication credentials. for exmaple http://testuser:password@localhost:3000
COOKIE_SECRET: A long, complex string for cookie encryption (NOTE: You define this for your local use, the string can be anything).
FORCE_SSL: If using SSL, set this to true.
STORE: Storage approach for publishing apps. `local` is the default, `s3` requires additional environment variables (prefixed by S3_)
S3_BUCKET: S3 bucket name. e.g. "my.coolappmaker.com"
S3_KEY: An access key for the S3 bucket listed above.
S3_SECRET: The secret corresponding to the specified S3 access key.
S3_OBJECT_PREFIX: String to prepend S3 objects. Useful for storing objects in folders. E.g. "level1/level2" => <bucket>/level1/level2/<filename>.
PUBLISH_URL_PREFIX: String to prepend to filenames that are saved when publishing. Try use the URL that matches the protocol from which assets are hosted to avoid mixed content blockage.
REDIRECT_URL: The hostname and port that we want to redirect to for Appmaker
PORT: The port that the web process listens on for incomming connections
GITHUB_TOKEN: A personal Github token used for loading lists of components from the mozilla-appmaker org during development (https://github.com/blog/1509-personal-api-tokens)
EXCLUDED_COMPONENTS: A comma-delimited list of component repositories to exclude from the mozilla-appmaker org. The name is the repo name rather than the component name, though this is usually the same.
ALLOW_CUSTOM_COMPONENTS: Optional flag to turn on using custom component for testing purposes (any value that coerces to true is accepted)
BUNDLE: Any non-null value will cause the application to bundle as many resources as possible
LOAD_FROM_GITHUB: if omitted, or "false", instructs appmaker to load components from repositories hosted on github.com
HSTS_DISABLED: if set to "true", [HSTS](http://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security) is disabled.  **(If you are not forcing SSL, you should turn disable HSTS by setting HSTS_DISABLED='true' in the .env)**
DISABLE_XFO_HEADERS_DENY: If set to "true", [X-Frame-Options Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/X-Frame-Options) are not set.  If not set to "true" / left unset, XFO headers are set to DENY.
IEXSS_PROTECTION_DISABLED: If set to "true", iexss vulnerability headers are not set.  If set to false or left unset, iexss protection for IE8 will be enabled.
GA_ACCOUNT: Optional google analytics account setting. (https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration#_gat.GA_Tracker_._setAccount)
GA_DESIGNER_DOMAIN: Optional google analytics domain setting for the designer. (https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiDomainDirectory#_gat.GA_Tracker_._setDomainName)
GA_PUBLISH_DOMAIN: Optional google analytics domain setting for the published apps. (https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiDomainDirectory#_gat.GA_Tracker_._setDomainName)
```

### Install and Run MongoDB

MongoDB is used for saving the user-created apps before publishing.

## Installation
Visit http://docs.mongodb.org/manual/installation/ for platform-specific installation instructions.


## Running `mongod`

Either configure MongoDB to run on startup or manually start the mongod daemon. You can also run mongod from foreman by adding it to your Procfile.

To manually start `mongod` once it is installed:

```bash
mongod
```

The `mongod` process will, by default listen on port 27017. If you have it configured to listen on an alternate port, be sure to adjust your `MONGO_URL` in your `.env` file.

### Start the Server

```bash
foreman start
```

or

```bash
foreman start -p <PORT>
```

If you need foreman:

```bash
sudo gem install foreman
```

NOTE: foreman's configuration file is Procfile in the root of the appmaker directory
Foreman explanation: http://blog.daviddollar.org/2011/05/06/introducing-foreman.html

NOTE FOR WINDOWS USERS: newer versions of Foreman may not work, and it is recommended
to install v0.61.0, which is known to work. To install this specific version, use
`gem install foreman -v0.61.0`

## How you can help

* Fix issues by [submitting Pull Requests](#submitting-a-pull-request)
* Submit new components (See [Component Docs](./doc/en-US))
* Add [issues](https://github.com/mozilla-appmaker/appmaker/issues)
* Build apps
* Run workshops
* Join our weekly call

## Component Development

So you want to make a component? That's great, we want to work with you! <a href="https://github.com/mozilla-appmaker/appmaker/wiki/Contributing-a-component">Here's a guide</a> where you can learn what components are, how they are built, how to make your own and finally how to submit your finished component to Appmaker.

<a href="https://github.com/mozilla-appmaker/appmaker/wiki/Contributing-a-component">Guide to Contributing a Component</a>


Technical reading:
https://github.com/mozilla-appmaker/appmaker/blob/develop/public/ceci/README.md

Ceci is a set of foundational elements used in a AppMaker app, implemented as a set of [Polymer](http://polymer-project.org/) components.
If you create a new component, it's really an HTML tag that Polymer processes and then injects a variety of capabilities into that tag / JS object

### Example AppMaker Component
TODO link to the Counter example, provide explanation

## Submitting A Pull Request

Switch to develop branch:
```
cd mozilla-appmaker/appmaker
git checkout develop
```

Pull the latest version:
```
git pull
```

Create a new branch (for example a feature branch):
```
git checkout -b your-feature-branch-name
```

Make changes to the local copy, commit your changes, and then make
sure your patch still works with latest version of develop branch:
```
git checkout develop
git pull
git checkout your-feature-branch-name
git rebase develop
```

Test commits:
```
grunt
```

Submit changes:
```
git push origin your-feature-branch-name
```

Submit the pull request at https://github.com/mozilla-appmaker/appmaker. For
more assistance, see Github's help page on [creating a pull request](https://help.github.com/articles/creating-a-pull-request).

## Localization

Appmaker uses the [Webmaker-i18n](https://github.com/mozilla/node-webmaker-i18n) module for localization of both the designer and (ceci) components.

### Localizating component

If you have created your own component, see: https://github.com/mozilla-appmaker/appmaker/wiki/How-components-are-built#localization

### Help on translation

Spotted any typo or want to help translate appmaker into your own language?

Appmaker uses [Transifex](https://transifex.com) for translation platform. You can check this [how to article](https://support.mozilla.org/en-US/kb/translate-webmaker) if you want to contribute for translation and visit [Appmaker on Transifex](https://www.transifex.com/projects/p/mozilla-appmaker) to start translate.
