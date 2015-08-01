// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

//document.addEventListener('focusout', function(e) {window.scrollTo(0, 0)});

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngOpenFB', 'ngCordova'], function($httpProvider) {
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

 
  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */ 
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
      
    for(name in obj) {
      value = obj[name];
        
      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
      
    return query.length ? query.substr(0, query.length - 1) : query;
  };
 
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }]; 
})

.run(function($ionicPlatform, ngFB) {
  
  $ionicPlatform.ready(function() {
      ngFB.init({appId: '409628302579539'});
  (function () {
    var po = document.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src = 'https://apis.google.com/js/client.js?onload=onLoadCallback';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
  })();
 
  function onLoadCallback() {
    gapi.client.setApiKey('AIzaSyBi98eJXO_oJrAqxBrmo_E-8qA0RKtQ35g');
    gapi.client.load('plus', 'v1', function () {
    });
  }
  });
})

.config(function($stateProvider, $urlRouterProvider, $compileProvider, $httpProvider) {

  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|tel|geo|maps):/);

  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('landing', {
      url: '/',
          templateUrl: 'modules/landing/landingpage.html',
          controller: 'LandingPageCtrl'
      }
    )
    .state('register', {
      url: '/register',
          templateUrl: 'modules/signup/signup.html',
          controller: 'SignUpCtrl'
      }
    )
    .state('register_social', {
      url: '/register_social/:email',
          templateUrl: 'modules/signup/signup.html',
          controller: 'SignUpCtrl'
      }
    )

    .state('login', {
      url: '/login',
          templateUrl: 'modules/login/login.html',
          controller: 'LoginCtrl'
      }
    )

    .state('reset', {
      url: '/reset',
          templateUrl: 'modules/login/reset.html',
          controller: 'LoginCtrl'
      }
    )

    .state('tab.profile', {
      url: '/account/profile',
      views: {
        'tab-account': {
          templateUrl: 'modules/settings/profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })
    .state('tab.reset', {
      url: '/account/reset',
      views: {
        'tab-account' : {
          templateUrl: 'modules/settings/profile.reset.html',
          controller: 'ProfileCtrl'
        }
      }
    })

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "modules/app/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'modules/dashboard/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('tab.card-detail', {
      url: '/dash/:cardId',
      views: {
        'tab-dash': {
          templateUrl: 'modules/card/card-detail.html',
          controller: 'CardDetailCtrl'
        }
      }
    })

    .state('tab.offer-detail', {
      url: '/dash/:cardId/:offerId',
      views: {
        'tab-dash': {
          templateUrl: 'modules/offer/offer-detail.html',
          controller: 'OfferCtrl'
        }
      }
    })

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'modules/settings/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

});

