angular.module('starter.services')
.factory('SessionService', function() {
	var Session = {};
	Session.isSet = false;
	return {
		isSet : function() {
			console.log("is Logged in ", Session.isSet);
			return Session.isSet;
		},
		set : function() {
			Session.isSet = true;
		},
		reset : function() {
			Session.isSet = false;
		}
	}
});