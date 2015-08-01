angular.module('starter.services')
.factory('LoaderService', function($rootScope, $ionicLoading) {
  return {
    show : function(message) {
      $ionicLoading.show({
        content      : '<i class="icon ion-looping"></i> ' + (message ? message : 'Loading'),
        animation    : 'fade-in',
        showBackdrop : true,
        maxWidth     : 400,
      });
    },

    hide : function(){
      $ionicLoading.hide();
    }
  }
})

.factory('ImageService', function($ionicPopup) {
  return {
    takePic : function(callBack, cancelCallback, errorCallback, retailer_card_profile_id) {
      var options = {
        quality         : 75,
        destinationType : navigator.camera.DestinationType.FILE_URI,
        sourceType      : 1, // 0=Photo Library, 1=Camera, 2=Saved Photo ALbum
        encodingType    : 0, // 0=JPG, 1=PNG
        allowEdit       : false
      }

      var onSuccess = function(FILE_URI) {
        var options      = new FileUploadOptions();
        options.fileKey  = "card_image";
        options.fileName = "card_image.jpg";
        options.mimeType = "image/jpeg";
        options.params   = prep_data({"retailer_card_profile_id" : retailer_card_profile_id});

        var ft = new FileTransfer();
        ft.upload(FILE_URI, encodeURI(API_BASE + '/get-card-number/'), uploadSuccess, uploadError, options);
        function uploadSuccess(r) {
          var resp   = angular.fromJson(r.response);
          var data   = resp["data"];
          var number = data["number"]
          var pin    = data["pin"]
          callBack(number, pin);
        }
        function uploadError(error) {
          errorCallback(error);
        }
      };

      var onFail = function(error){
        alert(error);
        cancelCallback(error);
      };

      navigator.camera.getPicture(onSuccess, onFail, options);

    }
  }  
})

.factory('ComparisonService', ['$http', function($http) {
  return {
    all : function(searchQuery, triggerBalance,callback) {
      var comparisonDeals = [];

      if(searchQuery.length > 10) {
         var in1 = searchQuery.indexOf("(")
        var in2 = searchQuery.indexOf(")")
        var resultString = searchQuery.substring(0,in1)

        var resultString1 = searchQuery.substring(in2+1,searchQuery.length)
        var finalString = resultString+resultString1
        var pattern = /^([^$]*)/// find the string untill first occurence of $
        var result = pattern.exec(finalString)
        searchQuery = result[0].replace(/[^\w\s]/gi,' ') // remove special character
      }

      $http.get(INVISIBLE_HAND_API_BASE + '?query=' + searchQuery + "&app_id=" + INVISIBLE_HAND_APP_ID + "&app_key=" + INVISIBLE_HAND_APP_KEY+'&size=10').success(function(response) {
        var results = response["results"];
        triggerBalance = triggerBalance *1.5
       
        for(var i=0; i < results.length; i++) {
          if(!results[i]["best_page"]) continue;
          var offer = results[i]["best_page"];
          var desc  = offer["description"];

          if(!desc) {
            desc = "";
          }

          if(desc.length > 30) {
            desc = desc.substring(0, 30);
          } 
          
          if(!offer["price"] || offer["price"] > triggerBalance) {
            continue;
          }

          comparisonDeals.push({
            "retailer"    : offer["retailer_name"],
            "price"       : offer["price"],
            "description" : desc + "...",
            "link"        : offer["deeplink"]
          });
        }

        callback(comparisonDeals);
      });          
    }
  }
}]);