'use strict';

var services = angular.module('appmaker.services',
    ['ngResource']);

services.factory('Component', ['$resource',
    function($resource) {
  return $resource('/components/:id', {id: '@id'});
}]);

services.factory('LoadComponents', ['Component', '$q',
    function(Component, $q) {
  return function() {
    var delay = $q.defer();
    Component.query(function(components) {
      delay.resolve(components);
    }, function() {
      delay.reject('Unable to fetch components');
    });
    return delay.promise;
  };
}]);

services.factory('LoadComponent', ['Component', '$route', '$q',
    function(Component, $route, $q) {
  return function() {
    var delay = $q.defer();
    Component.get({id: $route.current.params.componentId}, function(component) {
      delay.resolve(component);
    }, function() {
      delay.reject('Unable to fetch component '  + $route.current.params.componentId);
    });
    return delay.promise;
  };
}]);

services.factory('Notification', function ($resource) {
  return $resource('/notification/:notificationId', {notificationId: '@id'});
})

services.factory('LoadNotification', function (Notification, $route, $q) {
  return function () {
    var delay = $q.defer();
    Notification.get({notificationId: $route.current.params.notificationId}, function(notification) {
      delay.resolve(notification);
    }, function () {
      delay.reject('Unable to fetch notification ' + $route.current.params.notificationId)
    });
    return delay.promise;
  }
})