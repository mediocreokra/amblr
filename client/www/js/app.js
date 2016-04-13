// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('amblr', [
  'ionic', 
  'ngCordova',
  'uiGmapgoogle-maps', 
  'amblr.map', 
  'amblr.leftnav',
  'amblr.services',
  'amblr.signin'
])
.run(function($ionicPlatform) {
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
})
.config(function($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyBceRLiJZrDWlQiK3vu2Mc6-gzp84ZQX5U',
    v: '3.20', //defaults to latest 3.X anyhow
    libraries: 'weather,geometry,visualization'
  });
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
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl'
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


