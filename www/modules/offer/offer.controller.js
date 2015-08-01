angular.module('starter.controllers')
.controller('OfferCtrl', function($scope, $stateParams, OfferService, SessionService, $state) {
  
  var checkLogIn = function() {
        if(!SessionService.isSet()) {
            $state.go("login");
        }
  };
  checkLogIn();

  $scope.offer = OfferService.getSelectedOffer();
});