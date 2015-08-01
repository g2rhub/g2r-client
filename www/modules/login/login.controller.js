angular.module("starter.controllers")
.controller("LoginCtrl", function($scope, $state, UserService, LoaderService, ngFB, SessionService, LoginService, $cordovaOauth) {

    $scope.user = {};
    $scope.otpVerified = false;
    var checkLogIn = function() {
        if(SessionService.isSet()) {
            $state.go("tab.dash");
        }
    };
    checkLogIn();
    
    $scope.generateOTP = function() {
        LoaderService.show("Generating OTP");  
        LoginService.generateOTP($scope.user.identifier)
        .then(function(otpData) {
            console.log(otpData);
            LoaderService.hide();
            $scope.receivedOTP = otpData.otp;
            $scope.error = undefined;
            $scope.otpSent = true;
        }, function(error) {
            LoaderService.hide();
            $scope.error = "Oops! Some error Occurred";
        });
    };

    $scope.verifyOTP = function() {
        LoaderService.show("Verifying OTP");  

        if($scope.receivedOTP == $scope.user.otp) {
            LoaderService.hide();
            $scope.error = undefined;
            $scope.otpVerified = true;
        } else {
            LoaderService.hide();
            $scope.error = "OTP did not match! Please re-enter.";
        } 
    };

    $scope.goToForgotPasswordPage = function() {
        $state.go("reset");
    };

    $scope.go = function() {
        $state.go("login");
    };

	$scope.login = function(user) {
		LoaderService.show("Authenticating");  
		user.username = user.id;
        user.first_name='';
        user.last_name='';
        user.login_method='';
        LoginService.login(user)
        .then(function(userData) {
            LoaderService.hide();
            console.log("UserData",userData);
                                if(userData==='Not registered' || userData==='Username/password combination is invalid! Try again'
                                    || userData==='User is currently not active! Please contact support.'
                                    || userData==='Http Method Not Supported') {
                                    $scope.error = userData;
                                 } else {
                                    UserService.setUser(userData, function() {
                                        LoaderService.hide();
                                        $state.go("tab.dash");
                                    }, false);
                                } 
        }, function(error) {
            LoaderService.hide();
            $scope.error = error;
        });
	};

    $scope.resetPassword = function() {
        if($scope.user.password != $scope.user.password1) {
            $scope.error = "Password and confirm password field input should match. Try again!";
        } else {
            LoaderService.show("Resetting password!");  
            UserService.resetPassword()
            .then(function(response) {
                LoaderService.hide();
                $state.go("login");
            }, function(error) {

            });
        }
        
    };

	$scope.fbLogin = function () {
    		ngFB.login({scope: 'email,read_stream,publish_actions'}).then(
        	function (response) {
            	if (response.status === 'connected') {
                	console.log('Facebook login succeeded'+ response.authResponse.accessToken);
                	ngFB.api({
        				path: '/me',
        				params: {fields: 'id,name,email'}
    				}).then(
        				function (user) {
                            console.log("User",user);
                            user.id = user.email;
                            user.first_name = "";
                            user.last_name = "";
                            user.email = user.email;
                            user.username = user.email;
                            user.login_method="gmail";
                            user.gender = "";
                            user.profilePic = "";
                            user.password="";

                            $scope.email=user.email;
                            $scope.profilepic="";
                            
            				LoginService.login(user)
                            .then(function(userData) {
                                console.log("UserData",userData);
                                if(userData==='Not registered') {
                                    LoaderService.hide();
                                    $state.go("register_social", {email:$scope.email, pic:$scope.profilepic });
                                } else {
                                    UserService.setUser(userData, function() {
                                        LoaderService.hide();
                                        $state.go("tab.dash");
                                    }, false);
                                } 
                            });
        				},
        				function (error) {
            				alert('Facebook error: ' + error.error_description);
        				}
        			);
            	} else {
                	alert('Facebook login failed');
            	}
    		});
    };

    // Google Plus Login
    $scope.gplusLogin = function () {

        $cordovaOauth.google("134054455744-9k1odsc3nskh8o0us67eegprtmcsg9ri.apps.googleusercontent.com", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"]).then(function(result) {
            var token = result;
            var accessToken = token.access_token;

            LoginService.GPLogin(accessToken)
            .then(function(response) {
                        var userEmail = response.email;
                        
                        var user = {};
                        user.id = userEmail;
                        user.first_name = "";
                        user.last_name = "";
                        user.email = userEmail;
                        user.username = userEmail;
                        user.login_method="gmail";
                        user.gender = "";
                        user.profilePic = "";
                        user.password="";

                        $scope.email=userEmail;
                        $scope.profilepic="";
                        
                        console.log(user);

                        LoginService.login(user)
                        .then(function(userData) {
                        
                                console.log("UserData",userData);
                                if(userData==='Not registered') {
                                    LoaderService.hide();
                                    $state.go("register_social", {email:$scope.email, pic:$scope.profilepic });
                                } else {
                                    UserService.setUser(userData, function() {
                                        LoaderService.hide();
                                        $state.go("tab.dash");
                                    }, false);
                                } 
                        });
            }, function() {

            });
        }, function(error) {
            if(error==="Cannot authenticate via a web browser") {
                if(gapi && gapi.auth) {
                    gapi.auth.signIn(myParams);
                }
            }
        });

        var myParams = {
            'clientid': '134054455744-9k1odsc3nskh8o0us67eegprtmcsg9ri.apps.googleusercontent.com',
            'cookiepolicy': 'single_host_origin',
            'callback': loginCallback,
            'approvalprompt': 'force',
            'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'
        };
        
 
        function loginCallback(result) {
            console.log(result);
            if (result['status']['signed_in']) {
                gapi.client.load('plus', 'v1', function() {
                    var request = gapi.client.plus.people.get({'userId': 'me'});
                    request.execute(function (resp) {
                        console.log('Google+ Login RESPONSE: ' + angular.toJson(resp));
                        var userEmail;
                        if (resp['emails']) {
                            for (var i = 0; i < resp['emails'].length; i++) {
                                if (resp['emails'][i]['type'] == 'account') {
                                    userEmail = resp['emails'][i]['value'];
                                }
                            }
                        }
                        var user = {};
						user.id=resp.id;
                        user.first_name = resp['name'].familyName;
                        user.last_name = resp['name'].givenName;
                        user.email = userEmail;
                        user.username = userEmail;
                        user.login_method="gmail";
                        if(resp.gender) {
                            resp.gender.toString().toLowerCase() === 'male' ? user.gender = 'M' : user.gender = 'F';
                        } else {
                            user.gender = '';
                        }
                        user.profilePic = resp.image.url;
                        user.username=userEmail;
                        user.password="";

                        $scope.email=userEmail;
                        $scope.profilepic=resp.image.url;

                        console.log(user);

						LoginService.login(user)
						.then(function(userData) {
                        $state.go("tab.dash");
						UserService.setUser(userData, function() {
                                LoaderService.hide();
                                $state.go("tab.dash");
                            }, false);
						}, function(error) {
							LoaderService.hide();
                            if(error=='not registered')
                            {
                                $state.go("register_social", {email:$scope.email, pic:$scope.profilepic });
                            }
                            else
                            {
							    $scope.error = error;
                            }
						});
                    });    
                });
            }
        }
    };
});
