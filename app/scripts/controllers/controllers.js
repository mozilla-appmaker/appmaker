'use strict';

var app = angular.module('appmaker', ['appmaker.directives', 'appmaker.services']);

app.config(function ($routeProvider) {
  $routeProvider.
    when('/', {
      controller: 'ListCtrl', 
      resolve: {
        components: function (LoadComponents) {
          return LoadComponents();
        }
      },
      templateUrl: '/views/list.html'
    }).when('/component/:componentId', {
      controller: 'ViewCtrl',
      resolve: {
        component: function (LoadComponent) {
          return LoadComponent();
        }
      },
      templateUrl: '/views/viewComponent.html'
    }).when('/notification/:notificationId', {
      controller: 'NotificationCtrl',
      resolve: {
        notification : function (LoadNotification) {
          return LoadNotification();
        }
      },
      templateUrl: "/views/componentForm.html"
    }).when('/new', {
      controller: 'NewCtrl',
      templateUrl:'/views/componentForm.html'
    }).when('/edit/:componentId', {
      controller: 'EditCtrl',
      resolve: {
        component: function (LoadComponent) {
          return LoadComponent();
        }
      },
      templateUrl: '/views/componentForm.html'
    })
    .otherwise({redirectTo: '/'});
});

app.controller('ListCtrl', function ($scope, components) {
  $scope.components = components;
});

app.controller('ViewCtrl', function ($scope, component, $location) {
  $scope.component = component;

  $scope.edit = function() {
    $location.path('/edit/' + component.id);
  };
});

app.controller('NewCtrl', function ($scope, Component, $location) {
  $scope.component = new Component();

  $scope.save = function() {
    $scope.component.$save(function(component) {
      $location.path('/component/' + component.id);
    });
  };

  $scope.back = function() {
    history.go(-1)
  };
});

app.controller('EditCtrl', function ($scope, $location, component) {
  $scope.component = component;

  $scope.save = function() {
    $scope.component.$save(function(component) {
      $location.path('/component/' + component.id);
    });
  };

  $scope.remove = function() {
    $scope.component.$remove(function(component) {
      $location.path('/');
    });
  };

  $scope.back = function() {
    history.go(-1)
  };
})

app.controller('NotificationCtrl', function ($scope, $location, notification) {
  $scope.notification = notification;
  $scope.isNotification = true;
})


