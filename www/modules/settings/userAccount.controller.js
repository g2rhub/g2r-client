angular.module('starter.controllers')
.controller('AccountCtrl', function($scope, $ionicPopup, UserService, LoaderService, SessionService, $state) {
  
  var checkLogIn = function() {
        if(!SessionService.isSet()) {
            $state.go("login");
        }
  };
  checkLogIn();

  $scope.formData                  = {};
  $scope.enablePushNotifications   = {"checked" : false};
  $scope.upgradeAccount            = {"checked" : false};
  $scope.show_guest_account_toggle = true;
  $scope.show_register_toggle      = false;
  $scope.show_reset_toggle         = false;

  UserService.getUser(function(user) {
    console.log(user);
    $scope.formData.username                = user.username
    $scope.formData.firstname               = user.firstName;
    $scope.formData.lastname                = user.lastName;
    $scope.formData.email                   = user.email;
    $scope.formData.password                = window.localStorage.getItem("api_key");
    $scope.formData.is_guest                = user.is_guest;
    $scope.show_guest_account_toggle        = user.is_guest;
    $scope.show_reset_toggle                = !user.is_guest;
    $scope.enablePushNotifications.checked  = user.enable_push_notifications;
  });



  $scope.upgradeAccountChange = function() {
    if(!$scope.upgradeAccount.checked) {
      $scope.show_guest_account_toggle = false;
      $scope.show_reset_toggle         = false;
      $scope.show_register_toggle      = true;
      $scope.formData.is_guest         = false;
      $scope.formData.username         = "";
      $scope.formData.firstname        = "";
      $scope.formData.lastname         = "";
      $scope.formData.password         = "";
    }
  }

  $scope.processForm = function() {
    if($scope.show_register_toggle || $scope.show_reset_toggle) {
      if($scope.formData.username == "" || !validateEmail($scope.formData.username)) {
        $ionicPopup.alert({
          title : 'Please enter a valid email address'
        }).then(function(res) {        
          //
        });

        return;        
      }

      if(window.localStorage.getItem("api_key") == $scope.formData.password && !$scope.formData.password2) {

      } else {
        if($scope.formData.password2 != $scope.formData.password)  {
          $ionicPopup.alert({
            title : 'Password Mismatch'
          }).then(function(res) {        
            //
          });

          return;
        }

        if($scope.formData.password.length < 8) {
          $ionicPopup.alert({
            title : 'Password must be 8 characters or more'
          }).then(function(res) {        
            //
          });

          return;          
        }
      }
    }

    LoaderService.show("Saving settings");

    UserService.update($scope.formData, $scope.formData.password, ($scope.formData.is_guest ? "1" : "0"), $scope.enablePushNotifications.checked ? "1" : "0", function(profile) {
      $scope.formData.username                = profile.user.username;
      $scope.formData.firstname               = profile.user.first_name;
      $scope.formData.lastname                = profile.user.last_name;
      $scope.formData.password                = window.localStorage.getItem("api_key");

      if($scope.formData.is_guest && !profile.is_guest) {
        $ionicPopup.alert({
          title : 'Account upgraded!'
        }).then(function(res) {        
          //
        });
      }

      $scope.formData.is_guest                = profile.is_guest;
      $scope.show_guest_account_toggle        = profile.is_guest;
      $scope.show_reset_toggle                = !profile.is_guest;
      $scope.show_register_toggle             = false;
      $scope.enablePushNotifications.checked  = profile.enable_push_notifications;

      LoaderService.hide();
    });
  }
})