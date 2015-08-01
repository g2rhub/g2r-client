angular.module('starter.services')
.factory('AdService', function($rootScope, $ionicLoading) {

 /* var adMobAvail = false;
  
  /*
  try {
    if(admob) {
      adMobAvail = true;
    }
  } catch(e) {
    adMobAvail = false;
  }
  */
/*
  if(adMobAvail) {
    var successCreateBannerView = function() { console.log("addBanner Success"); admob.requestAd({'isTesting': true},success,error); };
    var success                 = function() { console.log("requestAd Success"); };
    var error                   = function(message) { console.log("Oopsie! " + message); };  
    return {
      banner : function() {
        admob.createBannerView(
           {
            'publisherId' : ADMOB_PUBLISHER_ID,
            'adSize'      : admob.AD_SIZE.BANNER
           },
           successCreateBannerView,
           error
        );        
      }
    }
  } else {
    return {
      banner : function() {}
    }
  } 
*/
})