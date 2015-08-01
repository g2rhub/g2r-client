angular.module("starter.controllers")
.controller("ProfileCtrl", function($scope, UserService, SessionService, $state, LoaderService, LoginService, $timeout, VerificationService) {

	var checkLogIn = function() {
        if(!SessionService.isSet()) {
            $state.go("login");
        }
  	};
  	checkLogIn();
  	$scope.user = {};

	$scope.formData = {};
	$scope.isEditing = false;
	var showData = function() {
		UserService.getUser(function(user) {
			$scope.user.identifier = user.username;
			console.log("User ",user);
    		$scope.formData.username                = user.profile.username
    		$scope.formData.firstname               = user.profile.firstName;
    		$scope.formData.lastname                = user.profile.lastName;
    		$scope.formData.email                   = user.profile.email;
    		$scope.formData.is_email_verified       = user.profile.is_email_verified;
    		$scope.formData.mobile                  = user.profile.mobile;
    		$scope.formData.is_mobile_verified      = user.profile.is_mobile_verified;
    		$scope.formData.password                = window.localStorage.getItem("api_key");
  		});
	};

	showData();

	$scope.verifyMobile = function() {
		LoaderService.show("Generating OTP!");
		var verificationData = {
			mobile : $scope.formData.mobile
		};

		VerificationService.verifyMobile(verificationData)
		.then(function(response) {
			LoaderService.hide();
			$scope.formData.is_mobile_verified = true;
		}, function(error) {
			LoaderService.hide();
			LoaderService.show("There was an error! Try again!");  
           	$timeout(function() {
                LoaderService.hide();
            }, 2000);
		});

	};

	$scope.verifyEmail = function() {
		LoaderService.show("Wait!");
		var verificationData = {
			mobile : $scope.formData.mobile
		};

		VerificationService.verifyEmail(verificationData)
		.then(function(response) {
			LoaderService.hide();
			LoaderService.show("A Verification mail has been sent to your email id, please verify at the earliest.");  
           	$timeout(function() {
                LoaderService.hide();
            }, 2000);
		}, function(error) {
			LoaderService.hide();
			LoaderService.show("There was an error! Try again!");  
           	$timeout(function() {
                LoaderService.hide();
            }, 2000);
		});
	};

	$scope.startEditing = function() {
		$scope.isEditing = true;
	};

	$scope.cancelEdit = function() {
		$scope.isEditing = false;
	};

	$scope.processForm = function() {
		LoaderService.show("Updating profile!");  
		UserService.setUser($scope.formData, function(error) {
			if(error!=undefined && error) {
				$scope.isEditing = false;
				LoaderService.hide();
				showData();
			} else {
				LoaderService.hide();
            	LoaderService.show("There was an error! Try again!");  
            	$timeout(function() {
                	LoaderService.hide();
                }, 2000);
			}
		}, true);
		
	};

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

    $scope.resetPassword = function() {
        if($scope.user.password != $scope.user.password1) {
            $scope.error = "Password and confirm password field input should match. Try again!";
        } else {
            LoaderService.show("Resetting password!");  
            UserService.resetPassword()
            .then(function(response) {
                LoaderService.hide();
                LoaderService.show("Password has been reset successfully!");  
                $timeout(function() {
                	LoaderService.hide();
                	$state.go("tab.account");
                }, 2000);
                
            }, function(error) {
            	LoaderService.hide();
            	LoaderService.show("There was an error! Try again!");  
            	$timeout(function() {
                	LoaderService.hide();
                }, 2000);
            });
        }
        
    };

});