'use strict';

var directives = angular.module('appmaker.directives',[]);

directives.directive("notification", function () {
	return {
		restrict: "E",
		template: '<div ng-show="isNotification">{{notification.message}}</div>'
	}
})