'use strict';

var app = angular.module('appmaker', ['appmaker.services']);

app.config(function ($routeProvider) {
  $routeProvider.
    when('/list', {
      controller: 'ListCtrl',
      resolve: {
        components: function (LoadComponents) {
          return LoadComponents();
        }
      },
      templateUrl: '/app/views/list.html'
    }).when('/component/:componentId', {
      controller: 'ViewCtrl',
      resolve: {
        component: function (LoadComponent) {
          return LoadComponent();
        }
      },
      templateUrl: '/app/views/viewComponent.html'
    }).when('/new', {
      controller: 'NewCtrl',
      templateUrl:'/app/views/componentForm.html'
    }).when('/edit/:componentId', {
      controller: 'EditCtrl',
      resolve: {
        component: function (LoadComponent) {
          return LoadComponent();
        }
      },
      templateUrl: '/app/views/componentForm.html'
    })
    .otherwise({redirectTo: '/list'});
});

app.controller('ListCtrl', function ($scope, components) {
  $scope.components = components;
});

app.controller('ViewCtrl', function ($scope, component, $location) {
  // console.log('viewing scope: %o', $scope);
  // console.log('viewing component.component: %o', component.component);
  // console.log('viewing location: %o', $location);
  $scope.component = component;

  $scope.edit = function() {
    // console.log('edit path scope: %o', $scope);
    // console.log('edit path component: %o', $scope.component);
    $location.path('/edit/' + $scope.component._id);
  };
});

app.controller('NewCtrl', function ($scope, Component, $location) {
  $scope.component = new Component();

  $scope.heading = "Add a Component";

  $scope.save = function() {
    $scope.component.$save(function(component) {
      console.log('received from add component: %o', component);
      $location.path('/component/' + component._id);
    });
  };

  $scope.back = function() {
    history.go(-1)
  };
});

app.controller('EditCtrl', function ($scope, $location, component) {
  console.log('editing %o', component);
  $scope.component = component;

  $scope.heading = "Edit Component";

  $scope.save = function() {
    $scope.component.$save(function(component) {
      console.log('received from save component: %o', component);
      $location.path('/component/' + component._id);
    });
  };

  $scope.remove = function() {
    $scope.component.$remove(function(component) {
      $location.path('/components/');
    });
  };

  $scope.back = function() {
    history.go(-1)
  };
})


