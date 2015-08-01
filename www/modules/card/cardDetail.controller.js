angular.module('starter.controllers')
.controller('CardDetailCtrl', function($window, $scope, $ionicPopup, $ionicScrollDelegate, $stateParams, $location, $timeout, CardsService, LoaderService, LocationService, SessionService, $state, OfferService) {
  
  var checkLogIn = function() {
        if(!SessionService.isSet()) {
            $state.go("login");
        }
  };
  checkLogIn();

  $scope.card          = {};
  $scope.formData      = {};
  $scope.deal_range    = {"value" : 0};
  $scope.offers        = [];
  $scope.locations     = [];

  var addSliderTimeout = function() {
    var timeoutId = null;
    $scope.$watch('deal_range.value', function() {
      if(timeoutId !== null) {
        return;
      }

      timeoutId = $timeout( function() {
        if($scope.card.offers && $scope.card.offers.length <= 0) {
          return;
        }          

        var new_offers = [];
        for(var i=0; i < $scope.card.offers.length; i++) {
          var offer = $scope.card.offers[i];
          if(parseInt(offer.trigger_balance) <= parseInt($scope.deal_range.value)) {
            offer.trigger_balance = parseFloat(offer.trigger_balance).toFixed(2);
            new_offers.push(offer);
          }
        }

        if(new_offers.length <= 0) {
          $scope.deal_range.value = $scope.card.offers[$scope.card.offers.length-1].trigger_balance;
        }

        $scope.offers = new_offers.slice(0, (new_offers.length >= 10 ? 9 : new_offers.length));
        $timeout.cancel(timeoutId);
        timeoutId = null;
      }, 500);   
    });    
  }

  var card = CardsService.getSelectedCard();
    console.log(card);
    $scope.card             = card;
    $scope.formData.pin     = card.pin;
    $scope.formData.number  = card.number;
    $scope.formData.balance = card.balance;
    $scope.offers           = card.offers;
    $scope.maxOfferAmount   = CardsService.getCurrentMaxOffer();
    $scope.deal_range       = {"value" : parseInt($scope.card.balance)};

    //addSliderTimeout();

  $scope.deleteCard = function() {
    $ionicPopup.confirm({
      title   : 'Delete Card',
      content : 'Are you sure you want to delete this gift card?'
    }).then(function(res) {
      if(res) {
        LoaderService.show("Removing card");
      	Cards.delete($scope.card.id, function() {
          LoaderService.hide();
          $location.path("/tab/dash");
      	});
      }
    });
  };

  $scope.showOfferDetail = function(offer) {
      OfferService.setSelectedOffer(offer);
      $state.go("tab.offer-detail", { cardId : card.id, offerId : offer.id});
  };
});