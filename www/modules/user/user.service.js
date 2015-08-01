
angular.module('starter.services')
.factory('UserService', function($http, $q, SessionService, RetailersService, CardsService, URLs) {

  var stubbedResponse = {'data': {'profile': {'username': 'michale', 'lastName': 'Nielarshi', 'email': 'nielarshi@gmail.com', 'firstName': 'Kumar'}, 'cards': '[{"fields": {"updated": "2015-05-16T19:21:54.938Z", "pin": "1234", "created": "2015-05-13T16:10:47.838Z", "expiration_date": "2015-06-26", "retailer": 1, "number": "12345678", "is_active": true, "original_balance": null, "user": 2, "balance": "100.00"}, "model": "retailers.retailercard", "pk": 1}, {"fields": {"updated": "2015-05-19T16:02:53.586Z", "pin": "4321", "created": "2015-05-16T19:26:34.372Z", "expiration_date": "2015-06-19", "retailer": 2, "number": "87654321", "is_active": true, "original_balance": null, "user": 2, "balance": "400.00"}, "model": "retailers.retailercard", "pk": 2}]', 'session_id': 'fkjsfh34', 'retailers': '[{"fields": {"name": "Target", "slick_deals_url": "http://slickdeals.net/newsearch.php?daysprune=-1&forumchoice%5B%5D=9&forumchoice%5B%5D=4&q=target&rss=1", "is_active": true, "site_url": "http://www.target.com/", "balance_check_function": "http://localhost:8000/api/v1/retailer/1/?api_key=d", "logo": "http://upload.wikimedia.org/wikipedia/commons/0/03/Target_Logo.svg", "description": "Target Corporation is an American retailing company, founded in 1902 and headquartered in Minneapolis, Minnesota. It is the second-largest discount retailer in the United States, Walmart being the largest."}, "model": "retailers.retailer", "pk": 1}, {"fields": {"name": "Amazon", "slick_deals_url": "", "is_active": true, "site_url": "http://www.amazon.com/", "balance_check_function": "", "logo": "http://images.fonearena.com/blog/wp-content/uploads/2014/11/Amazon-logo-700x433.jpg", "description": "Amazon details"}, "model": "retailers.retailer", "pk": 2}, {"fields": {"name": "Amazon1", "slick_deals_url": "", "is_active": true, "site_url": "http://amazon.com/", "balance_check_function": "", "logo": "http://images.fonearena.com/blog/wp-content/uploads/2014/11/Amazon-logo-700x433.jpg", "description": "Amazon"}, "model": "retailers.retailer", "pk": 3}]'}};
  
  var User = {};

  var updateUserData = function(user) {
      console.log("Updating");
      return $http.post(URLs.updateUser, user)
               .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        return $q.reject(response.data);
                    }
                }, function(response) {
                    return $q.reject(response.data);
                });
  };

  var setAllUserData = function(user) {
        console.log(user);
        if(user) {
            User.loggedIn  = true;
            var retailers = JSON.parse(user.retailers);
            RetailersService.setRetailers(retailers);
            var cards = JSON.parse(user.cards);
            CardsService.setCards(JSON.parse(user.cards));
            console.log("After", user);
            if(retailers.length>0)
              removeFieldsProperty(RetailersService.getRetailers());
            if(cards.length>0)
              removeFieldsProperty(CardsService.getCards());
            User.profile   = user.profile || {};
        }
       
  }

  var setUserData = function(user, callback, isUpdate) {
    console.log(isUpdate);
    if(isUpdate==undefined || !isUpdate) {
        window.localStorage.setItem("sessionid", stubbedResponse.data.session_id);
        setAllUserData(user);
        if(callback) {
            callback(true);
        };
    } else {
        updateUserData(user)
        .then(function(userData) {
            console.log("user updated", userData);
            if(callback) {
                setAllUserData(userData);
                callback(true);
            };
        }, function() {
            if(callback) {
                callback(false);
            };
        })
    }
    
  };

  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
  }

  var loggedIn = false;
  var csrf = getCookie('csrftoken');
  $http.defaults.headers.post['X-CSRFToken']=csrf;
  
  var removeFieldsProperty = function(array) {
    angular.forEach(array, function(element, index) {
          console.log("asd", element);
          if(!element || element==null) return;
          var keys = Object.keys(element.fields);
          angular.forEach(keys, function(key, keyIndex) {
            element[key] = element.fields[key];
          });
          if(element.fields.hasOwnProperty('number')) {
            element.id = element.fields.number;
            element.offers = [];
            element.card_profile = {
              name : element.retailer,
              image_file : retailers[Number(element.retailer)-1] ? retailers[Number(element.retailer)-1].logo : ""
            }
            element.retailer = retailers[Number(element.retailer)-1] ? retailers[Number(element.retailer)-1].name : "Target";
          }        
          delete element.fields;
        });
  };

  var getUserData = function(userId, callback) {
      $http.post(URLs.userData, {
        "userId" : userId 
      })
      .success(function(response){
          console.log(response);
          retailers = JSON.parse(response.data.retailers);
          cards     = JSON.parse(response.data.cards);
          removeFieldsProperty(retailers);
          removeFieldsProperty(cards);
          callback(true);
      }).error(function(error) {
          console.log(error);
          callback(false);
      });
  };

  var resetPassword = function(user) {
      return $http.post(URLs.resetPassword, user)
               .then(function(response) {
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
    resetPassword : resetPassword,

    getUser : function(callback) {
      callback(User);
    },

    setUser : function(user, callback, isUpdate) {
      setUserData(user, callback, isUpdate);
    },

    is_logged_in : function() {
      return loggedIn;
    }
  }
});

