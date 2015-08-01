angular.module('starter.services')
.factory('OfferService', ['$http', 'URLs', '$q', function($http, URLs, $q) {
  var selectedOffer = null;
  var setSelectedOffer = function(offer) {
      selectedOffer = offer;
  };

  var getSelectedOffer = function() {
      return selectedOffer;
  };

  var getOffers = function() {
    return $http.get(URLs.offers(33.394166,-111.785987, '123987123' , 'e6eaa24ff8b610fe1d6ad36361fcdd0c48fae654'))
               .then(function(response) {
                    console.log(response);
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
    getOffers : getOffers,
    getSelectedOffer : getSelectedOffer,
    setSelectedOffer : setSelectedOffer
  }
}])