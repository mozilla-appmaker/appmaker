# Appmaker

Welcome to Appmaker (beta).

Appmaker is a tool that helps anyone, not just developers, create mobile applications.

Appmaker apps are composed of web components, custom/resusable HTML tags, connected with events and listeners.

To learn more about web components, check out the [Polymer Project](http://www.polymer-project.org/).

Appmaker Website: http://www.appmaker.mozillalabs.com
IRC: '#appmaker' on Mozilla network

More resources:

  * a youtube video (that's already dated, but better than nothing): http://www.youtube.com/watch?v=RaRIdLgZTPI&feature=youtu.be
  * some words written before any code was written: https://github.com/mozilla/appmaker-words/wiki
  * the ROADMAP.md and [CONTRIBUTING.md](https://github.com/mozilla-appmaker/appmaker/blob/develop/CONTRIBUTING.md) documents in this directory.

## Getting Started

This section covers how to get Appmaker running locally. The workflow is optimized for contributors.

### Dependencies

Make sure you have `nodejs`, `npm`, and `git` installed.

`grunt` is required to run the test suite. To install grunt on unix and OS X,
run `sudo npm install -g grunt-cli`.

We manage client-side dependencies using [bower](http://bower.io/). In order to add/remove these dependencies, you need to have `bower` installed globally on your machine, which can be done on unix and OS X via
`sudo npm install bower -g`.

### Forking And Cloning The Repository

Create a root `mozilla-appmaker` directory:
```
mkdir mozilla-appmaker
cd mozilla-appmaker
```

[Fork](https://help.github.com/articles/fork-a-repo) this repository, and
then clone your fork into the `mozilla-appmaker` directory:
```
git clone git@github.com:mozilla-appmaker/your-username/appmaker.git mozilla-appmaker
```

Your directory structure should look like this:
```
mozilla-appmaker/
  ├── appmaker/
```

Configure remote:
```
cd appmaker
remote add upstream https://github.com/octocat/appmaker.git
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
COOKIE_SECRET: A long, complex string for cookie encryption.
STORE: Storage approach for publishing apps. `local` is the default, `s3` requires additional environment variables (prefixed by S3_)
S3_BUCKET: S3 bucket name. e.g. "my.coolappmaker.com"
S3_KEY: An access key for the S3 bucket listed above.
S3_SECRET: The secret corresponding to the specified S3 access key.
S3_OBJECT_PREFIX: String to prepend S3 objects. Useful for storing objects in folders. E.g. "level1/level2" => <bucket>/level1/level2/<filename>.
PUBLISH_URL_PREFIX: String to prepend to filenames that are saved on S3. Try use the URL that matches the protocol from which assets are hosted to avoid mixed content blockage.
PERSONA_AUDIENCE: The hostname and port of Appmaker used by Persona for authentication
PORT: The port that the web process listens on for incomming connections
```

## How you can help

* Fix issues by [submitting Pull Requests](#submitting-a-pull-request)
* Submit new components
* Add [issues](https://github.com/mozilla-appmaker/appmaker/issues)
* Build apps
* Run workshops
* Join our weekly call

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

Create a new branch:
```
git checkout -b your-branch-name
```

Make changes to the local copy, commit your changes, and then make
sure your patch still works with latest version of develop branch:
```
git checkout develop
git pull
git checkout your-branch-name
git rebase develop
```

Test commits:
```
grunt
```

Submit changes:
```
git push origin your-branch-name
```

Submit the pull request at https://github.com/mozilla-appmaker/appmaker. For
more assistance, see Github's help page on [creating a pull request](https://help.github.com/articles/creating-a-pull-request).
