# Webmaker auth client

This is the client-side library that adds support for Webmaker Login to your app. In order for it to work, you will need the following on your app's server:

* [express](https://github.com/visionmedia/express)
* [webmaker-auth](https://github.com/mozilla/webmaker-auth), the sister node module for this library

If you choose to use the create user form assets included in this package, you will also need [node-webmaker-l18n](https://github.com/mozilla/node-webmaker-i18n) for localization and [nunjucks](https://github.com/mozilla/nunjucks) for server-side rendering.

## Install

`bower install webmaker-auth-client --save`

## What's included?

```bash

# Main js file
webmaker-auth-client.js

# Create new user form assets
create-user/
    create-user-form.css
    create-user-form.html

# Localized strings for create new user form
locale/
    en_US/
        create-user-form.json

# Minified file (~11kb) packaged with dependencies.
dist/
    webmaker-auth-client.min.js
```


## Example

There is a fully-featured example in the [examples directory](example/) that you can run locally. It uses server-side rendering with nunjucks and webmaker-i18n, so you may need to modify the example to get it to work in your environment.

```html
<html>
  <head></head>
  <body>

    <button id="login"></button>
    <button id="logout"></button>

    <script src="https://login.persona.org/include.js"></script>
    <script src="bower_components/webmaker-auth-client/dist/webmaker-auth-client.min.js"></script>
    <script>
      var loginEl = document.querySelector('#login');
      var logoutEl = document.querySelector('#logout');

      var auth = new WebmakerAuthClient();

      // Attach event listeners!
      auth.on('login', function(user, debuggingInfo) {
        console.log('login', user, debuggingInfo);
      });
      auth.on('logout', function() {
        console.log('logout');
      });

      // Run this function to automatically log-in users with a session set.
      auth.verify();

      // Use auth.login and auth.logout to login and out!
      loginEl.addEventListener('click', auth.login, false);
      logoutEl.addEventListener('click', auth.logout, false);

    </script>
  </body>
</html>
```

### Require-js

```js
requirejs.config({
  paths: {
    'analytics': '/bower/webmaker-analytics',
    'eventEmitter': '/bower/eventEmitter',
    'webmaker-auth-client': '/bower/webmaker-auth-client'
  }
});

define(['webmaker-auth-client/webmaker-auth-client'],
  function(WebmakerAuthClient) {
    var auth = new WebmakerAuthClient();
    ...
  });
```


## Configure

```js
var auth = new WebmakerAuthClient({
  host: '',
  paths: {
    authenticate: '/authenticate',
    create: '/create',
    verify: '/verify',
    logout: '/logout'
  },
  csrfToken: 'YOURCSRFTOKEN',
  audience: window.location.origin,
  prefix: 'webmaker-', // for local storage
  timeout: 10,
  handleNewUserUI: true // Do you want to auto-open/close the new user UI?
});
```

## Listen to events

```js
auth.on('event', callback);
auth.off('event', callback);
```

### `login` (userData, [message])

When a user logs in or a session is automatically restored.

The `message` parameter is one of:

- `null`: on a successful check from the server
- `restored`: if the data was restored from local storage
- `email mismatch`: if the email was different in local storage v.s. on the server
- `user created`: if a new user was created an logged in

###`error` (errorMessage)

When an error happens. Check the error message for more information.

### `logout` (no parameters)

When user logs out or is logged out due to an error, or when no user session exists.

## Session restore and SSO
### To automatically login users and set up SSO, you must call
```js
auth.verify();
```

## Login/Logout

```js
auth.login();
auth.logout();
```
