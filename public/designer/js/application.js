/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(["jquery", "l10n", "reporter","designer/editable", "designer/publishPane"], function($, l10n, reporter, Editable, publishPane) {

    return {
      getCurrentApp: function(){
        var currentApp = localStorage.currentApp;
        return currentApp;
      },
      setCurrentApp: function(name){
        if (name && name !== l10n.get("Unsaved App")) {
          localStorage.currentApp = name;
        }
        // If we have a remix query string, replace it.
        if (location.search) {
          history.pushState({}, "", location.origin + location.pathname);
        }
      },
      clearCurrentApp: function(){
        localStorage.removeItem("currentApp");
        Editable.removeAttributes();
      },
      newApp: function(){
        var app = document.querySelector("ceci-app");
        var parent = app.parentNode;
        parent.removeChild(app);
        parent.appendChild(document.createElement('ceci-app'));
//      // TODO https://github.com/mozilla-appmaker/appmaker/issues/897
//      // we have to decouple appidChanged and initFirebase
        app.setAttribute("appid", "ceci-app-"+uuid());
      },
      renameApp: function(oldName,newName){
        var userState = document.querySelector('user-state');
        $.ajax('/api/rename_app', {
          data: {
            oldName: oldName,
            newName: newName
          },
          type: 'post',
          dataType : "json",
          success: function (data) {
            userState.appRenameOk(newName);
          },
          error: function (data) {
            var message = l10n.get("app rename failed");
            if (data.responseJSON.error === 'App name must be unique.') {
              message = l10n.get('App name must be unique.');
            }
            userState.appRenameFailed(message);
          }
        });
      },
      publishApp: function(options) {
        var name = options.name,
            appDescription = options.appDescription,
            remixedFrom = options.remixedFrom,
            appTags = options.appTags,
            appid = options.appid,
            html = options.html,
            afterPublish = options.afterPublish;

        function callAPIPublish(err) {
          if(err) {
            if(afterPublish) { afterPublish(err); }
            return;
          }
          $.ajax('/api/publish', {
            data: {
              name: name,
              html: html,
              remixedFrom: remixedFrom || "",
              appDescription: appDescription,
              appTags: appTags
            },
            type: 'post',
            success: function (data) {
              publishPane.show(name, data);

              // update the user state menu to have a Preview URL entry
              var userState = document.querySelector('user-state');
              userState.setAppURL(data.app);

              // also notify API that we have a url now (or that it got updated)
              $.ajax('api/update_app', {
                data: {
                  name: name,
                  url: data.app,
                  html: html
                },
                type: 'post',
                success: function () {
                  reporter.consoleReport("app update (for publish url) succeeded");
                  if(afterPublish) { afterPublish(false, data); }
                },
                error: function (errorData) {
                  reporter.errorReport("app update (for publish url) failed", errorData);
                  if(afterPublish) { afterPublish(errorData, data); }
                }
              });
            },
            error: function (data) {
              reporter.errorReport(data);
              if(afterPublish) { afterPublish(data); }
            }
          });
        }

        this.saveOrUpdateApp(name, appid, html, callAPIPublish);
      },
      saveApp: function(name, appid, html, next){
        $.ajax('/api/save_app', {
          data: {
            html: html,
            name: name,
            appid: appid
          },
          type: 'post',
          success: function (data) {
            var userState = document.querySelector('user-state');
            reporter.consoleReport("App saved successfully");
            userState.appRenameOk(name);
            if(next) { next(false, data); }
          },
          error: function (error) {
            if(next) { next(error); }
          }
        });

      },
      updateApp: function(name,appid,html,next){
        $.ajax('/api/update_app', {
          data: {
            name: name,
            html: html
          },
          type: 'post',
          success: function (data) {
            reporter.consoleReport("App updated successfully!");
            if(next) { next(false, data); }
          },
          error: function (error) {
            reporter.errorReport("App was not updated successfully!", error);
            if(next) { next(error); }
          }
        });

      },
      saveOrUpdateApp: function(name,appid,html,next) {
        var saveApp = this.saveApp;
        var updateApp = this.updateApp;

        // Update if app exists, save as if it does not
        $.ajax('/api/app', {
          data: {
            name: name
          },
          type: 'get',
          success: function (data) {
            // App exists, update it.
            updateApp(name, appid, html, next);
          },
          error: function (data) {
            // App not found, save it.
            saveApp(name, appid, html, next);
          }
        });
      },
      getOrInsertCeciApp: function(){
        var app = document.querySelector('ceci-app');
        if(!app){
          //ceci-app element doesn't exist
          var phoneBorderElement = document.querySelector(".phone-border");
          phoneBorderElement.appendChild(document.createElement("ceci-app"));
          return document.querySelector("ceci-app");
        } else {
          return app;
        }
      },
      loadAppByUrl: function(url) {
        var self = this;
        var userState = document.querySelector('user-state');

        url = '/api/remix-proxy?url=' + encodeURIComponent(encodeURIComponent(url));

        function findUserComponentLinkTags (data) {
          var match;
          var urls = [];

          while (match = data.match(/<link rel="import" href="([^"]+)" data-user-component>/)) {
            urls.push(match[1]);
            data = data.substr(match.index + match[0].length);
          }

          return urls;
        }

        $.ajax(url, {
          type: 'get',
          success: function (data) {
            var userComponentUrls = findUserComponentLinkTags(data);

            userComponentUrls.forEach(function (url) {
              userState.addComponentByURL(url);
            });

            var openingTag = '<ceci-app';
            var closingTag = '</ceci-app>';
            var indexOfOpeningTag = data.indexOf(openingTag);
            var indexOfClosingTag = data.indexOf(closingTag);

            if (indexOfOpeningTag > -1 && indexOfClosingTag > -1) {
              var range = document.createRange();
              var container = document.body;
              range.selectNode(document.body);
              var fragment = range.createContextualFragment(data.substring(indexOfOpeningTag, indexOfClosingTag + closingTag.length));
              var newApp = fragment.querySelector('ceci-app');
              var currentApp = self.getOrInsertCeciApp();
              currentApp.parentNode.replaceChild(newApp, currentApp);
              newApp.setAttribute("appid", "ceci-app-"+uuid());
            }
            else {
              reporter.errorReport('Error while parsing loaded app.');
              userState.failedAppLoad();
            }

            document.querySelector('ceci-card-nav').buildTabs();
          },
          error: function (data) {
            reporter.errorReport('Error while loading app', data);
            userState.failedAppLoad();
          }
        });
      },
      loadAppByName: function(name) {
        var userState = document.querySelector('user-state');
        var self = this;
        $.ajax('/api/app', {
          data: {
            name: name
          },
          type: 'get',
          success: function (data) {
            var app = self.getOrInsertCeciApp();
            var html = data.html;
            // our apps must be wrapped by a <ceci-app> element
            if(html.indexOf("<ceci-app") === -1 && html.indexOf("</ceci-app>") === -1) {
              var err = l10n.get("Malformed app HTML");
              err += " (appid: "+data.appid+")\n";
              err += l10n.get("This app will not be loaded");
              reporter.errorReport(err);
              return;
            }
            app.outerHTML = html;
            localStorage.currentApp = name;
            userState.okAppLoad(name, data);
            // Update the page/card tabs
            var cardNav = document.querySelector('ceci-card-nav');
            cardNav.buildTabs();
          },
          error: function (data) {
            reporter.errorReport('Error while loading app', data);
            userState.failedAppLoad();
          }
        });
      },
      deleteAppByName: function(name){
        $.ajax('/api/delete_app', {
          data: {
            name: name
          },
          type: 'delete',
          success: function (data) {
            reporter.consoleReport("App deleted successfully.");
          },
          error: function (data) {
            reporter.errorReport("Error while deleting app: ", data);
          }
        });
      }
    };
  }
);
