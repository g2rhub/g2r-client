
angular.module('starter.controllers', ['ngOpenFB', 'cordovaDeviceModule', 'cordovaGeolocationModule'])
.controller("AppCtrl", function($scope, $state, SessionService) {
	$scope.logout = function() {
		SessionService.reset();
		$state.go("landing");
	};	
});


