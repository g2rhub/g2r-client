angular.module('starter.services')
.factory('LocationService', function($http, $q) {

  var Countries = [];

  var getCountryCode = function(lat, lon) {
    return $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=12.9816015,80.2206925&sensor=true')
    .then(function(res) {
          return res.data.results[0].address_components[5].short_name;
    });
  };

  var getCountryCodes = function() {
    return $http.get('modules/location/country-codes.json')
    .then(function(res) {
          Countries = res.data.countries.country;
          return Countries;
    });
  };

  var getCountryFor = function(countryCode, callback) {
     console.log("called");
      Countries.forEach(function(country) {
          if(countryCode.toUpperCase()===country._code.toUpperCase()) {
              if(callback) callback(country);
              return country;
          }
      });
  };

  return {
      getCountryCode : getCountryCode,
      getCountryCodes : getCountryCodes,
      getCountryFor : getCountryFor  
  }

});