angular.module("starter.services")
.factory("VerificationService", function($http, $q, URLs, SessionService) {

	var verifyEmail = function(verificationData) {
		return $http.post(URLs.verifyEmail, verificationData)
               .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        return $q.reject(response.data);
                    }
                }, function(response) {
                    return $q.reject(response.data);
                });
	};
	
	var verifyMobile = function(verificationData) {
		return $http.post(URLs.verifyMobile, verificationData)
               .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        return $q.reject(response.data);
                    }
                }, function(response) {
                    return $q.reject(response.data);
        		});
	};

	return {
		verifyEmail : verifyEmail,
		verifyMobile : verifyMobile
	}
});