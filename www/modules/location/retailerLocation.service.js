angular.module('starter.services')
.factory('RetailerLocationService', ['$http', function($http) {
  return {
    get_closest_locations : function(retailer_id, cb) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        var lat = pos.coords.latitude.toFixed(6);
        var lng = pos.coords.longitude.toFixed(6);
        $http.post(API_BASE + '/retailer-locations/', prep_data({"retailer_id" : retailer_id, "client_lat" : lat, "client_lng" : lng, "client_radius" : client_radius})).success(function(response) {
          var locs = response.data.locations;
          for(var i=0; i < locs.length; i++) {
            if(getPlatform() == "Android") {
              locs[i]["href"] = "geo:" + locs[i].lat + "," + locs[i].lng + "?q=" + locs[i].lat + "," + locs[i].lng + "()";
            } else {
              locs[i]["href"] = "maps:q=" + locs[i].lat + "," + locs[i].lng;
            }
          } 
          cb(locs);
        }).error(function(response) {
          console.log(response);
        }); 
      });
    }
  }
}])