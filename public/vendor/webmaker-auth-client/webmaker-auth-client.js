(function (window) {

  var usernameRegex = /^[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\-]{1,20}$/;

  function webmakerAuthClientDefinition(EventEmitter, cookiejs, analytics) {

    return function WebmakerAuthClient(options) {

      if (!window.localStorage) {
        console.error('Local storage must be supported for instant login.');
      }

      var self = this;

      var referralCookieSettings = {
        // grab only the first two parts of the hostname
        domain: location.hostname.split('.').slice(-2).join('.'),
        path: '/',
        // secure cookie if connection uses TLS
        secure: location.protocol === 'https:',
        // expire in one week
        expires: new Date((Date.now() + 60 * 1000 * 60 * 24 * 7))
      };
      var refValue = /ref=((?:\w|-)+)/.exec(window.location.search);
      var cookieRefValue = cookiejs.parse(document.cookie).webmakerReferral;

      if (refValue) {
        refValue = refValue[1];
      }

      options = options || {};
      options.paths = options.paths || {};

      // For handling events
      self.emitter = new EventEmitter();

      // Config
      self.host = options.host || '';
      self.paths = options.paths || {};
      self.paths.authenticate = options.paths.authenticate || '/authenticate';
      self.paths.create = options.paths.create || '/create';
      self.paths.verify = options.paths.verify || '/verify';
      self.paths.logout = options.paths.logout || '/logout';
      self.paths.checkUsername = options.paths.checkUsername || '/check-username';
      self.urls = {
        authenticate: self.host + self.paths.authenticate,
        create: self.host + self.paths.create,
        verify: self.host + self.paths.verify,
        logout: self.host + self.paths.logout,
        checkUsername: self.host + self.paths.checkUsername
      };
      self.audience = options.audience || (window.location.protocol + '//' + window.location.host);
      self.prefix = options.prefix || 'webmaker-';
      self.timeout = options.timeout || 10;
      self.localStorageKey = self.prefix + 'login';
      self.csrfToken = options.csrfToken;
      // Needed when cookie-issuing server is on a different port than the client
      self.withCredentials = options.withCredentials === false ? false : true;

      // save referrer value
      if (refValue) {
        if (cookieRefValue !== refValue) {
          document.cookie = cookiejs.serialize('webmakerReferral', refValue, referralCookieSettings);
          cookieRefValue = refValue;
        }
      }

      // Create New User Modal
      self.handleNewUserUI = options.handleNewUserUI === false ? false : true;

      // This is a separate function because Angular apps use their own modal
      self.analytics = {};
      self.analytics.webmakerNewUserCancelled = function () {
        analytics.event('Webmaker New User Cancelled');
      };

      // You can override any of these if necessary
      self.modal = {};
      self.modal.element = document.getElementById('webmaker-login-new-user');
      self.modal.dismissSelector = '[data-dismiss]';
      self.modal.createSelector = '.create-user';
      self.modal.createBtnOnClick = function () {};

      self.modal.checkUsernameOnChange = function () {
        var usernameTakenError = self.modal.element.querySelector('.username-taken-error');
        var usernameInvalidError = self.modal.element.querySelector('.username-invalid-error');
        var usernameRequiredError = self.modal.element.querySelector('.username-required-error');
        var usernameGroup = self.modal.element.querySelector('.username-group');
        var username = this.value;
        if (!username) {
          usernameGroup.classList.remove('has-success');
          usernameGroup.classList.add('has-error');
          usernameTakenError.classList.add('hidden');
          usernameRequiredError.classList.remove('hidden');
          usernameInvalidError.classList.add('hidden');
          return;
        }
        self.checkUsername(username, function (error, message) {
          if (error && message === 'Username taken') {
            usernameGroup.classList.add('has-error');
            usernameGroup.classList.remove('has-success');
            usernameTakenError.classList.remove('hidden');
            usernameRequiredError.classList.add('hidden');
            usernameInvalidError.classList.add('hidden');
          } else if (error && message === 'Username invalid') {
            usernameGroup.classList.add('has-error');
            usernameGroup.classList.remove('has-success');
            usernameInvalidError.classList.remove('hidden');
            usernameTakenError.classList.add('hidden');
            usernameRequiredError.classList.add('hidden');
          } else {
            usernameGroup.classList.remove('has-error');
            usernameGroup.classList.add('has-success');
            usernameTakenError.classList.add('hidden');
            usernameRequiredError.classList.add('hidden');
            usernameInvalidError.classList.add('hidden');
          }
        });
      };

      self.modal.setup = function (assertion, email) {
        var createBtn = self.modal.element.querySelector(self.modal.createSelector);
        var closeBtns = self.modal.element.querySelectorAll(self.modal.dismissSelector);

        var usernameGroup = self.modal.element.querySelector('.username-group');
        var agreeGroup = self.modal.element.querySelector('.agree-group');

        var usernameTakenError = self.modal.element.querySelector('.username-taken-error');
        var usernameRequiredError = self.modal.element.querySelector('.username-required-error');
        var usernameInvalidError = self.modal.element.querySelector('.username-invalid-error');
        var agreeError = self.modal.element.querySelector('.agree-error');

        var usernameInput = self.modal.element.querySelector('[name="username"]');
        var agreeInput = self.modal.element.querySelector('[name="agreeToTerms"]');
        var mailingListInput = self.modal.element.querySelector('[name="mailingList"]');
        var languagePreference = self.modal.element.querySelector('[name=supportedLocales]');

        createBtn.removeEventListener('click', self.modal.createBtnOnClick, false);
        usernameInput.addEventListener('change', self.modal.checkUsernameOnChange, false);

        self.modal.createBtnOnClick = function () {
          var hasError = false;

          if (!agreeInput.checked) {
            agreeGroup.classList.add('has-error');
            agreeError.classList.remove('hidden');
            hasError = true;
          }

          if (!usernameInput.value) {
            usernameGroup.classList.remove('has-success');
            usernameGroup.classList.add('has-error');
            usernameTakenError.classList.add('hidden');
            usernameRequiredError.classList.remove('hidden');
            usernameInvalidError.classList.add('hidden');
            hasError = true;
          }

          if (hasError) {
            return;
          }

          self.checkUsername(usernameInput.value, function (error, message) {
            if (error && message === 'Username taken') {
              usernameGroup.classList.add('has-error');
              usernameGroup.classList.remove('has-success');
              usernameTakenError.classList.remove('hidden');
              usernameRequiredError.classList.add('hidden');
              usernameInvalidError.classList.add('hidden');
            } else if (error && message === 'Username invalid') {
              usernameGroup.classList.add('has-error');
              usernameGroup.classList.remove('has-success');
              usernameInvalidError.classList.remove('hidden');
              usernameTakenError.classList.add('hidden');
              usernameRequiredError.classList.add('hidden');
            } else {
              self.createUser({
                assertion: assertion,
                user: {
                  username: usernameInput.value,
                  mailingList: mailingListInput.checked,
                  referrer: cookieRefValue,
                  prefLocale: languagePreference.value
                }
              }, function (err) {
                if (err) {
                  console.error(err);
                  return;
                }

                usernameTakenError.classList.add('hidden');
                usernameRequiredError.classList.add('hidden');
                usernameInvalidError.classList.add('hidden');
                agreeError.classList.add('hidden');

                usernameGroup.classList.remove('has-error');
                usernameGroup.classList.remove('has-success');
                agreeGroup.classList.remove('has-error');

                self.modal.close();
              });
            }
          });

        };

        for (var i = 0; i < closeBtns.length; i++) {
          closeBtns[i].removeEventListener('click', self.modal.close, false);
          closeBtns[i].addEventListener('click', self.modal.close, false);
        }
        createBtn.addEventListener('click', self.modal.createBtnOnClick, false);
      };

      self.modal.open = function () {
        self.modal.element.classList.add('in');
        self.modal.element.style.display = 'block';
        self.modal.element.setAttribute('aria-hidden', false);
      };

      self.modal.close = function (event) {
        // If close is called by the user via addEventListener we'll get the event object
        if (event) {
          self.analytics.webmakerNewUserCancelled();
        }

        self.modal.element.classList.remove('in');
        self.modal.element.style.display = 'none';
        self.modal.element.setAttribute('aria-hidden', true);
      };

      self.on = function (event, cb) {
        self.emitter.addListener(event, cb);
      };

      self.off = function (event, cb) {
        self.emitter.removeListener(event, cb);
      };

      self.checkUsername = function (username, callback) {
        if (!usernameRegex.test(username)) {
          return callback(true, 'Username invalid');
        }
        var http = new XMLHttpRequest();
        var body = JSON.stringify({
          username: username
        });

        http.open('POST', self.urls.checkUsername, true);
        http.withCredentials = self.withCredentials;
        http.setRequestHeader('Content-type', 'application/json');
        http.setRequestHeader('X-CSRF-Token', self.csrfToken);

        http.onreadystatechange = function () {
          if (http.readyState === 4 && http.status === 200) {
            var response = JSON.parse(http.responseText);

            // Username exists;
            if (response.exists) {
              callback(true, 'Username taken');
            } else {
              callback(false, 'Username not taken');
            }

          }
          // Some other error
          else if (http.readyState === 4 && http.status && (http.status >= 400 || http.status < 200)) {
            self.emitter.emitEvent('error', [http.responseText]);
            callback(false, 'Error checking username');
          }

          // No response
          else if (http.readyState === 4) {
            self.emitter.emitEvent('error', ['Looks like ' + self.urls.checkUsername + ' is not responding...']);
            callback(false, 'Error checking username');
          }

        };

        http.send(body);

      };

      self.createUser = function (data, callback) {

        var http = new XMLHttpRequest();
        var body = JSON.stringify({
          assertion: data.assertion,
          audience: self.audience,
          user: data.user
        });
        callback = callback || function () {};

        http.open('POST', self.urls.create, true);
        http.withCredentials = self.withCredentials;
        http.setRequestHeader('Content-type', 'application/json');
        http.setRequestHeader('X-CSRF-Token', self.csrfToken);

        http.onreadystatechange = function () {
          if (http.readyState === 4 && http.status === 200) {
            var data = JSON.parse(http.responseText);

            // User creation successful
            if (data.user) {
              self.storage.set(data.user);
              self.emitter.emitEvent('login', [data.user, 'user created']);
              analytics.event('Webmaker New User Created', {
                nonInteraction: true
              });
              analytics.conversionGoal('WebmakerNewUserCreated');
              callback(null, data.user);
            } else {
              self.emitter.emitEvent('error', [http.responseText]);
              callback(http.responseText);
            }

          }

          // Some other error
          else if (http.readyState === 4 && http.status && (http.status >= 400 || http.status < 200)) {
            self.emitter.emitEvent('error', [http.responseText]);
            callback(http.responseText);
          }

          // No response
          else if (http.readyState === 4) {
            self.emitter.emitEvent('error', ['Looks like ' + self.urls.create + ' is not responding...']);
            callback(http.responseText);
          }

        };

        http.send(body);

      };

      self.verify = function () {

        if (self.storage.get()) {
          self.emitter.emitEvent('login', [self.storage.get(), 'restored']);
        }

        var email = self.storage.get('email');

        var http = new XMLHttpRequest();

        http.open('POST', self.urls.verify, true);
        http.withCredentials = self.withCredentials;
        http.setRequestHeader('Content-type', 'application/json');
        http.setRequestHeader('X-CSRF-Token', self.csrfToken);
        http.onreadystatechange = function () {
          if (http.readyState === 4 && http.status === 200) {
            var data = JSON.parse(http.responseText);

            // Email is the same as response.
            if (email && data.email === email) {
              self.emitter.emitEvent('login', [data.user, 'verified']);
              self.storage.set(data.user);
            }

            // Email is not the same, but is a cookie
            else if (data.user) {
              self.emitter.emitEvent('login', [data.user, 'email mismatch']);
              self.storage.set(data.user);
            }

            // No cookie
            else {
              self.emitter.emitEvent('logout');
              self.storage.clear();
            }

          }

          // Some other error
          else if (http.readyState === 4 && http.status && (http.status >= 400 || http.status < 200)) {
            self.emitter.emitEvent('error', [http.responseText]);
          }

          // No response
          else if (http.readyState === 4) {
            self.emitter.emitEvent('error', ['Looks like ' + self.urls.verify + ' is not responding...']);
          }

        };

        http.send();

      };

      self.login = function () {

        if (!window.navigator.id) {
          console.error('No persona found. Did you include include.js?');
          return;
        }

        analytics.event('Webmaker Login Clicked');

        window.removeEventListener('focus', self.verify, false);

        window.navigator.id.get(function (assertion) {

          if (!assertion) {
            self.emitter.emitEvent('error', [
              'No assertion was received'
            ]);

            analytics.event('Persona Login Cancelled');

            return;
          }

          analytics.event('Persona Login Succeeded');

          var http = new XMLHttpRequest();
          var body = JSON.stringify({
            audience: self.audience,
            assertion: assertion
          });

          if (self.timeout) {
            var timeoutInstance = setTimeout(function () {
              http.abort();
              self.emitter.emitEvent('error', [
                'The request for a token timed out after ' + self.timeout + ' seconds'
              ]);
            }, self.timeout * 1000);
          }

          http.open('POST', self.urls.authenticate, true);
          http.withCredentials = self.withCredentials;
          http.setRequestHeader('Content-type', 'application/json');
          http.setRequestHeader('X-CSRF-Token', self.csrfToken);
          http.onreadystatechange = function () {

            // Clear the timeout
            if (self.timeout && timeoutInstance) {
              clearTimeout(timeoutInstance);
            }

            if (http.readyState === 4 && http.status === 200) {
              var data = JSON.parse(http.responseText);

              // There was an error
              if (data.error) {
                self.emitter.emitEvent('error', [data.error]);
              }

              // User exists
              if (data.user) {
                self.storage.set(data.user);
                self.emitter.emitEvent('login', [data.user]);
                analytics.event('Webmaker Login Succeeded');
                window.addEventListener('focus', self.verify, false);
              }

              // Email valid, user does not exist
              if (data.email && !data.user) {
                self.emitter.emitEvent('newuser', [assertion, data.email]);
                analytics.event('Webmaker New User Started');

                // If handleNewUserUI is true, show the modal with correct data
                if (self.handleNewUserUI) {
                  self.modal.setup(assertion, data.email);
                  self.modal.open();
                }
              }

              if (data.err) {
                self.emitter.emitEvent('error', [data.err]);
              }

            }

            // Some other error
            else if (http.readyState === 4 && http.status && (http.status >= 400 || http.status < 200)) {
              self.emitter.emitEvent('error', [http.responseText]);
            }

            // No response
            else if (http.readyState === 4) {
              self.emitter.emitEvent('error', ['Looks like ' + self.urls.authenticate + ' is not responding...']);
            }

          };

          http.send(body);

        }, {
          backgroundColor: '#E3EAEE',
          privacyPolicy: 'https://webmaker.org/privacy',
          siteLogo: 'https://stuff.webmaker.org/persona-assets/logo-webmaker.png',
          siteName: 'Mozilla Webmaker',
          termsOfService: 'https://webmaker.org/terms'
        });

      };

      self.logout = function () {

        analytics.event('Webmaker Logout Clicked');

        window.removeEventListener('focus', self.verify, false);

        var http = new XMLHttpRequest();
        http.open('POST', self.urls.logout, true);
        http.withCredentials = self.withCredentials;
        http.setRequestHeader('X-CSRF-Token', self.csrfToken);
        http.onreadystatechange = function () {

          if (http.readyState === 4 && http.status === 200) {
            self.emitter.emitEvent('logout');
            self.storage.clear();
            window.addEventListener('focus', self.verify, false);
          }

          // Some other error
          else if (http.readyState === 4 && http.status && (http.status >= 400 || http.status < 200)) {
            self.emitter.emitEvent('error', [http.responseText]);
          }

          // No response
          else if (http.readyState === 4) {
            self.emitter.emitEvent('error', ['Looks like ' + self.urls.logout + ' is not responding...']);
          }
        };
        http.send(null);

      };

      // Utilities for accessing local storage
      self.storage = {
        get: function (key) {
          var data = JSON.parse(localStorage.getItem(self.localStorageKey));
          if (!data) {
            return;
          }
          if (key) {
            return data[key];
          } else {
            return data;
          }
        },
        set: function (data) {
          var userObj = JSON.parse(localStorage.getItem(self.localStorageKey)) || {};
          for (var key in data) {
            if (data.hasOwnProperty(key)) {
              userObj[key] = data[key];
            }
          }
          localStorage.setItem(self.localStorageKey, JSON.stringify(userObj));
        },
        clear: function () {
          delete localStorage[self.localStorageKey];
        }
      };

    };
  }

  // AMD
  if (typeof define === 'function' && define.amd) {
    define(['eventEmitter/EventEmitter', 'cookie-js/cookie', 'analytics'], webmakerAuthClientDefinition);
  }

  // Global
  else {
    window.WebmakerAuthClient = webmakerAuthClientDefinition(window.EventEmitter, window.cookiejs, window.analytics);
  }

})(window);
