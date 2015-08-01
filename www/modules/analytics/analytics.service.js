angular.module('starter.services')
.factory('AnalyticsService', ['$http', function($http) {
  return {
    add_impression : function(card_id, offer_id) {
      $http.post(API_BASE + '/impressions/' + card_id + '/' + offer_id, prep_data({})).success(function(response) {
      }).error(function(response) {
        console.log(response);
      });
    }
  }
}])