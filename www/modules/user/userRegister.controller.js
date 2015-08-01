angular.module('starter.controllers')
.controller('RegisterCtrl', function($scope, $location, UserService, LoaderService, SessionService, $state) {
  
  var checkLogIn = function() {
        if(!SessionService.isSet()) {
            $state.go("login");
        }
  };
  checkLogIn();

  LoaderService.show("Authenticating");  
    if(UserService.is_first_time()) {
      var username = randomString();
      UserService.register(username, function() {
        LoaderService.hide();   
        top.location = "#/tab/dash";
      });
    } else {
      UserService.auto_authenticate(function() {
        LoaderService.hide();   
        top.location = "#/tab/dash";
     });
    }
})
