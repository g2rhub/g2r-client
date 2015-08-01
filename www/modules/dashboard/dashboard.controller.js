angular.module('starter.controllers')
.controller('DashCtrl', function($scope, $rootScope, $ionicPopup, $ionicModal, UserService, RetailersService, CardsService, LoaderService, ImageService, $cordovaBarcodeScanner, SessionService, $state, OfferService) {
  
  var checkLogIn = function() {
        if(!SessionService.isSet()) {
            $state.go("login");
        }
  };
  checkLogIn();

  $scope.formData = {};
  $scope.cards    = [];
  $scope.retailer = {};
  $scope.user = {};
  $scope.cardsTitlePortfolioToggle = false;

  var toggleCardsHeaderTiltle = function(cards){
    if(cards.length > 0){
      $scope.cardsTitlePortfolioToggle  = true;
    }
  };

  UserService.getUser(function(User) {
    $scope.user = User.profile;
    $scope.cards = CardsService.getCards();
    toggleCardsHeaderTiltle($scope.cards);

    $scope.retailers = RetailersService.getRetailers();
    //$scope.retailer = RetailersService.getSelectedRetailer();

    OfferService.getOffers()
    .then(function(data) {
        $scope.offers = data.objects;

        $scope.cards.forEach(function(card) {
            $scope.offers.forEach(function(offer) {
                if(card.retailer == offer.retailer_name) {
                    if(!card.offers) {
                        card.offers = [];
                    }
                    card.offers.push(offer);
                }
            });
        });

    }, function(error) {
        
    });
  });

  var filterCards = function(cards){
        var uniqueCards = [];
        var visitedCards = {};
        for(var i = 0; i < cards.length ; i++){
          var vCard = visitedCards[cards[i].card_profile.name];
          if(vCard === undefined ){
            visitedCards[cards[i].card_profile.name] = cards[i].balance;
            uniqueCards.push(cards[i]);
          } else {
            visitedCards[cards[i].card_profile.name] += cards[i].balance;
          }
        }      
        for (var j = 0 ; j<uniqueCards.length ; j++){
          var vCard = visitedCards[uniqueCards[j].card_profile.name];
          if(vCard !==undefined){
            uniqueCards[j].totalBalance = vCard;
          }
        }
        return uniqueCards;
  };

  $scope.selectCard = function(card) {
    CardsService.setSelectedCard(card);
    $state.go("tab.card-detail", { cardId : card.id });
  };
 
  $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            $scope.formData.number = imageData.text;
            console.log("imageData ",imageData);
            console.log("Barcode Format -> " + imageData.format);
            console.log("Cancelled -> " + imageData.cancelled);
        }, function(error) {
            console.log("An error happened -> " + error);
        });
  };
    
  $ionicModal.fromTemplateUrl('select-retailer.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.selectRetailerModal = modal;
  });

  $scope.refreshData = function() {
    Retailers.all(function(retailers) {
      $scope.retailers = retailers;
      $scope.retailer  = $scope.retailers[0];
      $scope.cards = CardsService.getCards();
      $scope.$broadcast('scroll.refreshComplete');
      toggleCardsHeaderTiltle(cards);      
    });    
  };

  $scope.processForm = function() {
    $scope.formData.retailer = $scope.retailer.name;
    $scope.formData.user = $scope.user.username;
    if(!$scope.formData.number) {
      $ionicPopup.alert({title: 'Invalid Card #', content : 'Please enter a card number to proceed'}).then(function(res){});
    } else if(!$scope.formData.pin) {
      $ionicPopup.alert({title: 'Invalid Pin', content : 'Please enter a pin to proceed'}).then(function(res){});
    } else {
      LoaderService.show("Checking card");
  	  CardsService.add($scope.formData, function(card) {
  	  	if(card.balance <= 0) {
          $ionicPopup.alert({title: 'Card not found', content : 'Please check card # and pin'}).then(function(res){});
          CardsService.delete(card.id, function() {
            LoaderService.hide();            
          });
  	  	} else {
          card.card_profile = {
            image_file : $scope.retailer.logo
          };
          LoaderService.hide();

          top.location = "#/tab/dash/" + card.number;
  	  	}
  	  });
    } 
  };

  $scope.closeSelectRetailer = function() {
    $scope.selectRetailerModal.hide();
  };  

  $scope.openSelectRetailer = function() {
    console.log($scope.retailers);
  	$scope.selectRetailerModal.show();
  };

  $scope.setRetailer = function(retailer) {
  	$scope.retailer = retailer;
  	$scope.selectRetailerModal.hide();
  };
});