Appmaker
========

For context as to the motivation of the project, see:

  * a youtube video (that's already dated, but better than nothing): http://www.youtube.com/watch?v=RaRIdLgZTPI&feature=youtu.be
  * some words written before any code was written: https://github.com/mozilla/appmaker-words/wiki
  * the ROADMAP.md and [CONTRIBUTING.md](https://github.com/mozilla-appmaker/appmaker/blob/develop/CONTRIBUTING.md) documents in this directory.

Running the Server
------------------

### Dependencies

Then you can execute `npm install` in the application directory:

You'll also need to run the appmaker-components server, located at https://github.com/mozilla/appmaker-components

### Running in Development mode

#### Configuration for Node

Copy and edit your .env file. -- This should never be committed to the repo.

```
cp sample.env .env
```

A short explanation of a complete `.env` file:
```
COOKIE_SECRET=A long, complex string for cookie encryption.
ASSET_HOST=Location of the javascript, css, fonts, and images that will be used by the designer and published assets. Likely "//appmaker-components.herokuapp.com/"
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

Note, for the time being, at least in the `develop` branch, you will need this instead:

```
foreman start -f Procfile.chain
```

If you need foreman:

```
sudo gem install foreman
```

### Client-side dependencies

We manage client-side dependencies using (bower)[http://bower.io/]. In order to add/remove these depencies, you need to have `bower` installed globally on your machine:

Excecute `sudo npm install bower -g` (Mac & *nix users)
