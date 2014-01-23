/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var fs = require('fs');
var path = require('path');
var GithubClient = require('node-github');

var github = new GithubClient({
    // required
    version: "3.0.0"
});

if (process.env.GITHUB_TOKEN){
  github.authenticate({
    type: "oauth",
    token: process.env.GITHUB_TOKEN
  });
}

function getUrlFromName(name){
  return '/component/mozilla-appmaker/' + name + '/component.html';
}

function unique(array){
  var a = array.concat();
  for (var i=0; i<a.length; ++i) {
    for (var j=i+1; j<a.length; ++j) {
      if(a[i] === a[j]) {
        a.splice(j--, 1);
      }
    }
  }

  return a;
};


function addLocalComponents(componentsDir) {


  if (componentsDir) {
    components = fs.readdirSync(componentsDir).filter(function(filename) {
      return fs.existsSync(path.join(componentsDir, filename, 'component.html'));
    }).map(function(name) {
      return getUrlFromName(name);
    });
    return components;
  }

  return [];
}


function addAppmakerOrgComponents(callback) {
  // TODO: Paginate
  github.repos.getFromOrg(
    {org: 'mozilla-appmaker', per_page: 100},
    function(err, data){
      if (err) {
        console.error("Error Finding mozilla-appmaker component repos: " + err.message)
        return;
      }

      if (data.length > 99){
        consoel.warn(
          "It's likely some components aren't being loaded and pagination has to be done in ",
          module.filename
        );
      }


      var components = data
        .filter(function(repo){
          return repo.name.substr(0, 10) === "component-" && !repo.private;
        })
        .map(function(repo){
          return getUrlFromName(repo.name);
        });

      if (typeof callback === 'function'){
        callback(components);
      }
    }
  );
}

/*
 * All About Loading Components:
 * =============================
 *
 * Theoretical Dev Mode:
 * ---------------------
 *
 * - COMPONENTS_DIR is set to the directory with local clones of `component-`
 * - CURRATED_COMPONENTS is null
 *
 * This means that we'll search our local dir for subdirs that have a `component.html`
 * file in them, call out to Github (because CURRATED_COMPONENTS is null) and find the list
 * of the 'component-' repositories.
 *
 * Hosted Mode:
 * ------------
 *
 * - COMPONENTS_DIR is null
 * - CURRATED_COMPONENTS is a comma-separated list of component repository names
 *
 * This means we do no guessing, but load the comma-separated list proxying for Github.
 *
 */
module.exports = {
  load: function(callback){
    var components = addLocalComponents(process.env.COMPONENTS_DIR);

    console.log("[Components] Loaded", components.length, "from \"", process.env.COMPONENTS_DIR, "\"");

    // Add currated components if we have them specified
    if (process.env.CURRATED_COMPONENTS) {
      var curratedComponents = process.env.CURRATED_COMPONENTS.split(',').map(function(name) {
        return getUrlFromName(name);
      })
      components = components.concat(curratedComponents);

      console.log("[Components] Loaded", curratedComponents.length, "from CURRATED_COMPONENTS env var");
    }
    else {
      addAppmakerOrgComponents(function(orgComponents){
        console.log("[Components] Loaded", orgComponents.length, "from mozilla-appmaker via Github API");
        components = components.concat(orgComponents);
        callback(unique(components));
      });
    }
  }
};
