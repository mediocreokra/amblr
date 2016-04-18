// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('amblr', [
  'ionic', 
  'ngCordova',
  'amblr.config',
  'amblr.map', 
  'amblr.addPOI',
  'amblr.leftnav',
  'amblr.services',
  'amblr.signin',
  'amblr.signup',
  'amblr.centerMap',
  'ngCookies'
])
.run(function($ionicPlatform, $rootScope, $location, $cookies, $state) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });  
  
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
  // when changing states, check if authentication is required
    if (toState.authenticate === true && !$cookies.get('connect.sid')) {
      // If logged out and transitioning to a logged in page, go home instead
      event.preventDefault();
      $state.go('menu.home');
    } 
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {

  //force android to keep tabs at bottom
  $ionicConfigProvider.platform.android.tabs.position('bottom');
  
  $stateProvider
  .state('menu', {
    url: '/menu',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })
  .state('menu.home', {
    url: '/home',
    views: {
      'view-content': {
        templateUrl: 'templates/map.html'
        // controller: 'MapCtrl'
      }
    }
  })

  .state('menu-private', {
    authenticate: true,
    url: '/menu-private',
    abstract: true,
    templateUrl: 'templates/menu-private.html',
  })
  .state('menu-private.home', {
    authenticate: true,
    url: '/home',
    views: {
      'view-content-private': {
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl'
      }
    }
  })
  .state('menu.addPOI', {
    url: '/addPOI',
    views: {
      'view-content': {
        templateUrl: 'templates/addPOI.html',
        controller: 'addPOIController'
      }
    }
  })
  //to delete after testing.  use for data point entry
  .state('dataEntry', {
    url: '/test',
    templateUrl: 'testIndex.html',
    controller: 'testCtrl'
  });
  $urlRouterProvider.otherwise('/menu/home');
});
