angular.module('amblr.map', ['uiGmapgoogle-maps'])
.config(function($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyBceRLiJZrDWlQiK3vu2Mc6-gzp84ZQX5U',
    v: '3.20', //defaults to latest 3.X anyhow
    libraries: 'weather,geometry,visualization'
  });
})
.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, POIs, $ionicLoading, uiGmapGoogleMapApi) {
  $scope.POIs = [];

  // service call to retrieve all POIs stored in the database
  // TODO: need to limit the POIs to a radius search around a lat/long
  POIs.getPOIs()
  .then(function(response) {
    $scope.POIs = response.data;
    console.log('pois received in map controller.js');
  })
  .catch(function(err) {
    console.log('err getting pois in map controller.js: ', err);
  });

  var lat = 37.7938494;
  var long = -122.419234;

  $scope.map = { center: { latitude: lat, longitude: long }, zoom: 15 };
  $scope.options = {scrollwheel: false};


  // TODO: replace this one marker with all the markers in the db
  // Don't allow draggable either but this can be used for the
  // Add POI marker

  $scope.coordsUpdates = 0;
  $scope.dynamicMoveCtr = 0;
  $scope.marker = {
    id: 0,
    coords: {
      latitude: lat,
      longitude: long
    },
    options: { draggable: true },
    events: {
      dragend: function (marker, eventName, args) {
        $log.log('marker dragend');
        var lat = marker.getPosition().lat();
        var lon = marker.getPosition().lng();
        $log.log(lat);
        $log.log(lon);

        $scope.marker.options = {
          draggable: true,
          labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
          labelAnchor: "100 0",
          labelClass: "marker-labels"
        };
      }
    }
  };

  $scope.getCurrentPosition = function() {
    if (!$scope.map) {
      console.log('scope is undefined');
      return;
    }
    //show loading as we get location
    $ionicLoading.show({
      template: 'Getting current location...',
      noBackdrop: true
    });

    var options = {timeout: 10000, enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(options).then(function (pos) {
      console.log('Got pos', pos);
      var latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      $scope.map.setCenter(latLng);
      google.maps.event.addListenerOnce($scope.map, 'idle', function() {
        var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          draggable: true,
          position: latLng
        });      
     
        var infoWindow = new google.maps.InfoWindow({
          content: 'Add a POI'
        });
     
      // google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open($scope.map, marker);
      });

      $ionicLoading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };


});
