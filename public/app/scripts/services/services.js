'use strict';

var services = angular.module('appmaker.services',
    ['ngResource']);

services.factory('Component', ['$resource',
    function($resource) {
  return $resource('/api/component/:id', {id: '@id'});
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

