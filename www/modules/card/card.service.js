angular.module('starter.services')
.factory('CardsService', function($http, URLs) {
  var currentCard = undefined;

  var Cards = [];
  
  var setCards = function(cards) {
    Cards = cards;
  };

  var getCards = function() {
    return Cards;
  };

  return {
    add : function(cardData, callback, location) {
      console.log(cardData);
      $http.post(
        URLs.addcard,
        {
          "retailer"                 : cardData.retailer,
          "user"                     : cardData.user,
          "number"                   : cardData.number,
          "pin"                      : cardData.pin,
          "expiration_date"          : cardData.expdate,
          "original_balance"         : 1000,
          "balance"                  : cardData.balance
          
        }
      ).success(function(response) {
        response.result.id = response.result.number[0];
        response.result.retailer = response.result.retailer[0];
        response.result.number = response.result.number[0];
        response.result.user = response.result.user[0];
        response.result.pin = response.result.pin[0];
        response.result.expiration_date = response.result.expiration_date[0];
        response.result.balance = response.result.balance[0];
        response.result.offers = [];
        Cards.push(response.result);
        currentCard = response.result;
        callback(response.result);
      }).error(function(response) {
        callback("error", response);
      });
    },

    setCards : setCards,
    getCards : getCards,

    getSelectedCard : function() {
      return currentCard;
    },

    setSelectedCard : function(card) {
      currentCard = card;
    },

    getCurrentMaxOffer : function(card_id) {
      var max = 0;
      for(var i=0; i < currentCard.offers.length; i++) {
        var trigger_balance = parseInt(currentCard.offers[i].trigger_balance);

        if(trigger_balance > max) {
          max = trigger_balance;
        }
      }
      return max;
    }
  }
});