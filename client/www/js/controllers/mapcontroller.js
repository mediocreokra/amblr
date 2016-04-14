angular.module('amblr.map', ['uiGmapgoogle-maps'])
.config(function($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyBceRLiJZrDWlQiK3vu2Mc6-gzp84ZQX5U',
    v: '3.20', //defaults to latest 3.X anyhow
    libraries: 'weather,geometry,visualization'
  });
})
.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, POIs,
  $ionicLoading, uiGmapGoogleMapApi, uiGmapIsReady, $location) {
  
  $scope.POIs = [];

  var lat = 37.7938494;
  var long = -122.419234;
  
  $scope.map = { 
    center: { 
      latitude: lat, 
      longitude: long 
    }, 
    zoom: 15,
    control: {},
    POIMarkers: []
  };

  $scope.options = {scrollwheel: false};

  //use a promise to tell when the map is ready to be interacted with
  uiGmapIsReady.promise()
  .then(function (instances) {

    console.log('equals = ' + (instances[0].map === $scope.map.control.getGMap()));

    // service call to retrieve all POIs stored in the database
    // TODO: need to limit the POIs to a radius search around a lat/long

    POIs.getPOIs()
    .then(function(response) {
      $scope.POIs = response.data;
      console.log('pois received in map controller.js: ' + $scope.POIs);

      var markers = [];
     
      // TODO: abstract the creation of markers into a function
      for (var i=0; i < $scope.POIs.length; i++) {
        
        /*

          Create a marker object for each one retrieved from the db.

          Example marker model:
          {
            id: 1,
            icon: '../../img/poi.png',
            latitude: 37.7938494,
            longitude: -122.419234,
            showWindow: false,
            options: {
              labelContent: '[46,-77]',
              labelAnchor: "22 0",
              labelClass: "marker-labels"
            }
          }

          Documentation: https://angular-ui.github.io/angular-google-maps/#!/api/markers

          This is connected to the google map through the ui-gmap-markers models attribute in maps.html

        */
        
        markers.push({
          id: i,
          latitude: $scope.POIs[i].lat,
          longitude: $scope.POIs[i].long,
          title: $scope.POIs[i].description
        });

        console.log($scope.POIs[i].long, $scope.POIs[i].lat); 
      }

      $scope.map.POIMarkers = markers;

    })
    .catch(function(err) {
      console.log('err getting pois in map controller.js: ', err);
    });

  })
  .catch(function(err) {
    console.log('error in doing things when map is ready', err);
  });


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
