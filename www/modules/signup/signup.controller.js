angular.module("starter.controllers")
.controller("SignUpCtrl", function($scope,$http, $state,$ionicPopup,$stateParams, UserService, LoaderService, SessionService, LoginService, LocationService, cordovaGeolocationService) {

  var setSelectedCountryOption = function() {

      LocationService.getCountryCode($scope.currentPosition.coords.latitude, $scope.currentPosition.coords.longitude)
      .then(function(result) {
            LocationService.getCountryFor(result, function(country) {
                console.log(result, country);
                $scope.countrySelected = country;
            });
      }, function() {

      });
  };

  var populateCountryCodes = function() {
      LocationService.getCountryCodes()
      .then(function(result) {
          $scope.countries = result;
           setSelectedCountryOption();
      }, function() {

      });
  }
  
  $scope.getCurrentPosition = function () {
            cordovaGeolocationService.getCurrentPosition(successHandler);
  };

  var successHandler = function (position) {
            $scope.currentPosition = position;
            populateCountryCodes();
  };

  $scope.getCurrentPosition();

  $scope.selectCountry = function(country) {
     console.log("seleted country", country);  
  };
  
  $scope.user = {
      firstName : "",
      lastName : "",
      email : ""
  };
  if($stateParams.email) {
      $scope.user.identifier = $stateParams.email;
  }
  $scope.newuser = {
      mobileNumber:$stateParams.email
  };

  $scope.enterAgain = function() {
    $scope.is_mobile = false;
  }

  $scope.verifyUsername = function() {
      $scope.is_mobile = false;
      $scope.is_email = false;
      var is_email = validateEmail($scope.user.identifier);
      if(is_email) {
           $scope.is_email = true;
           $scope.user.email = $scope.user.identifier;
           $scope.user.mobileNumber = "";
      }
      
      var is_mobile = validateMobile($scope.user.identifier);
      if(is_mobile) {
          $scope.is_mobile = true;
          $scope.user.mobileNumber = $scope.user.identifier;
          $scope.user.email = "";
      }
  };

  function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  }

  function validateMobile(mobileno) {
    if(isNaN(mobileno)) {
      return false;
    } else if(!isNaN(mobileno) && mobileno.length>8) {
       return true;
    }
    return false;
  }

	var checkLogIn = function() {
        if(SessionService.isSet()) {
            $state.go("tab.dash");
        }
  	};
  	checkLogIn();

	var sendOTP = function(data) {
        $scope.otp= data.result.opt_data;

        //var mobileno=$scope.countrySelected._phoneCode+$scope.user.mobileNumber;
        var mobileno="91"+$scope.user.mobileNumber;
        console.log(mobileno);
        LoaderService.show("Sending OTP");  
        /*$http.get('http://bulksms.mysmsmantra.com:8080/WebSMS/SMSAPI.jsp?username=nutechnolog&password=151270133&sendername=NETSMS&mobileno='+mobileno+'&message=OTP for your signup request is '+data.result.opt_data+'. Please enter this OTP to complete the signup process.')
        .then(function(datamsg) {
            console.log(datamsg);
            if(datamsg) {*/
     
                LoaderService.hide();
               /* $ionicPopup.alert({
                title : datamsg
                });*/

              $scope.data = {};
              var myPopup=$ionicPopup.show({
                  template: '<input type="text" ng-model="data.otp">',
                  title: 'Enter OTP',
                  subTitle: 'Please enter OTP',
                  scope: $scope,
                  buttons: [
                      { text: 'Cancel' },
                      {
                          text: '<b>Ok</b>',
                          type: 'button-positive',
                          onTap: function(e) {
                                if (!$scope.data.otp) {
                                    //don't allow the user to close unless he enters otp password
                                    e.preventDefault();
                                } else {
                                    return $scope.data.otp;
                                }
                          }
                      },
                  ]
              });
              myPopup.then(function(res) {
                  $scope.login({ username : $scope.user.mobileNumber, password : $scope.user.password });
              });    
            /*}*/
        /*}, function(error) {
             LoaderService.hide();
        }); */
       
  };

  var setUser = function(data) {
    UserService.setUser(data.data,function(error) {
      if(!error) {
        $state.go("tab.dash");
      } else {
        $scope.error = error;
      }
      LoaderService.hide();
    }, false);
  };

  $scope.login = function(user) {
        LoaderService.show("Authenticating");  

        user.username = user.username;
        user.first_name='';
        user.last_name='';
        user.login_method='';

        LoginService.login(user)
        .then(function(userData) {
            UserService.setUser(userData, function() {
                LoaderService.hide();
                $state.go("tab.dash");
            }, false);
        }, function(error) {
            LoaderService.hide();
            $scope.error = error;
        });
  };

	$scope.submitForm = function(user) {
    $scope.verifyUsername();
		console.log(user);
    if($scope.user.password.length < 3) {
          $ionicPopup.alert({
            title : 'Password must be 8 characters or more'
          }).then(function(res) {        
            //
          });
          return;          
    } else if($scope.user.password!=$scope.user.password2) {
        $ionicPopup.alert({
            title : 'Passwords Mismatch'
        }).then(function(res) {        
            //
        });
        return;          
    } else {
		    LoaderService.show("Registering! Please wait.");  
		}
   
     if($scope.is_mobile) {
        user.username = user.mobileNumber;
     } else {
        user.username = user.email;
     }
    user.google_id='';
    user.google_image='';
    user.facebook_id='';
    user.dob='';
		LoginService.register(user).then(function(data) {
        console.log("register ",user, data);
		    if($scope.is_mobile) {
           sendOTP(data);
        } else {
           $scope.login({ username : user.email,email : user.email, password : user.password });
        }
    }, function(error) {
        $scope.error=error
        LoaderService.hide();  
    });	
	};


	$scope.go = function() {
		$state.go("login");
	};
});