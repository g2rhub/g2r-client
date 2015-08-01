angular.module("starter.services")
.factory("LoginService", function($http, $q, URLs, SessionService) {

	var login = function(userLoginData) {
	
		return $http.post(URLs.login, userLoginData)
               .then(function(response) {
                    console.log(response);
                    if (typeof response.data === 'object') {
                    	//set session
            			SessionService.set();
                        return response.data.data;
                    } else {
                    	//reset session
            			SessionService.reset();
                        return response.data;
                    }
                }, function(response) {
                	//reset session
            		SessionService.reset();
                    return $q.reject(response.data);
                });
	};

    var GPLogin = function(accessToken) {
        console.log(URLs.GPLogin(accessToken));
        return $http.get(URLs.GPLogin(accessToken))
               .then(function(response) {
                    console.log(response.data);
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        return $q.reject(response.data);
                    }
               }, function() {

               });
    }
	
	
	
	var register = function(userRegistrationData) {
		//return $http.post(URLs.register, userRegistrationData)
        return $http({
                method: 'POST',
                url: URLs.register,
                data: userRegistrationData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }})
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

	var generateOTP = function(userIdentifier) {
		return $http.post(URLs.generateOTP, userIdentifier)
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
		login : login,
		register : register,
		generateOTP : generateOTP,
        GPLogin : GPLogin
	}
});