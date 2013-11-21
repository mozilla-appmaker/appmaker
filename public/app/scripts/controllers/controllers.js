'use strict';

var app = angular.module('appmaker', ['appmaker.directives', 'appmaker.services']);

app.config(function ($routeProvider) {
  $routeProvider.
    when('/components', {
      controller: 'ListCtrl', 
      resolve: {
        components: function (LoadComponents) {
          console.log('loading components for /components');
          // return LoadComponents();
          var comps = LoadComponents();
          console.log('components: %j', comps);
          return comps; 
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
    }).when('/notification/:notificationId', {
      controller: 'NotificationCtrl',
      resolve: {
        notification : function (LoadNotification) {
          return LoadNotification();
        }
      },
      templateUrl: "/app/views/componentForm.html"
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
    .otherwise({redirectTo: '/app'});
});

app.controller('ListCtrl', function ($scope, components) {
  $scope.components = components;
});

app.controller('ViewCtrl', function ($scope, component, $location) {
  $scope.component = component;

  $scope.edit = function() {
    $location.path('/edit/' + component._id);
  };
});

app.controller('NewCtrl', function ($scope, Component, $location) {
  $scope.component = new Component();

  $scope.save = function() {
    $scope.component.$save(function(component) {
      console.log('Added new component: %s', component._id);
      $location.path('/component/' + component._id);
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
      $location.path('/components/');
    });
  };

  $scope.back = function() {
    history.go(-1)
  };
})

app.controller('NotificationCtrl', function ($scope, $location, notification) {
  $scope.notification = notification;
  $scope.isNotification = true;
});


