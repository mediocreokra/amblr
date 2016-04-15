
angular.module('amblr.map', ['uiGmapgoogle-maps'])
.config(function($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyBceRLiJZrDWlQiK3vu2Mc6-gzp84ZQX5U',
    v: '3.20', //defaults to latest 3.X anyhow
    libraries: 'weather,geometry,visualization'
  });
})
.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, POIs,
  $ionicLoading, uiGmapGoogleMapApi, uiGmapIsReady, $log, $ionicSideMenuDelegate) {
  
  $scope.POIs = [];


  var lat = 37.786439;
  var long = -122.408199;

  // dropMarker is the marker when someone clicks on the map
  // if we want to allow user to drag it around, the dragend event
  // would fire once they've stopped, which would be the lat/long
  // we'd want to use 
  $scope.dropMarker = {
    id: 0,
    coords: {
      latitude: 0,
      longitude: 0
    },
    options: { 
      draggable: true,
      icon:'../../img/information.png' 
    },
    events: {
      dragstart: function(marker, eventName, args) {
        $log.log('marker dragend');
        $ionicSideMenuDelegate.canDragContent(false);
      },
      dragend: function (marker, eventName, args) {
        $ionicSideMenuDelegate.canDragContent(true);
        $log.log('marker dragend');
        var lat = marker.getPosition().lat();
        var lon = marker.getPosition().lng();
        $log.log(lat);
        $log.log(lon);
 
        $scope.marker.options = {
          draggable: true,
          labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
          labelAnchor: "100 0",
          labelClass: "marker-labels",
        };
      }
    }
  };

  $scope.map = { 
    center: { 
      latitude: lat, 
      longitude: long 
    }, 
    zoom: 15,
    control: {},
    POIMarkers: [],
    events: {
      click: function (map, eventName, originalEventArgs) {
          
        var e = originalEventArgs[0];
        var lat = e.latLng.lat();
        var lon = e.latLng.lng();
        var drop = $scope.dropMarker;

        drop.id = Date.now();
        drop.coords.latitude = lat;
        drop.coords.longitude = lon;

        $scope.$apply();
      }
    }
  };


  $scope.options = {scrollwheel: false};

  //use a promise to tell when the map is ready to be interacted with
  uiGmapIsReady.promise()
  .then(function (instances) {

    console.log('equals = ' + (instances[0].map === $scope.map.control.getGMap()));

    // service call to retrieve all POIs stored in the database
    // TODO: need to limit the POIs to a radius search around a lat/long
    //       should add a button when map is dragged to update map that
    //       gets POIs in the area its in.  otherwise would need to 
    //       dynamically get them when user dragging which would be difficult
    POIs.getPOIs()
    .then(function(response) {
      $scope.POIs = response.data;

      var markers = [];
     
      // TODO: abstract the creation of markers into a function
      /*

        Create a marker object for each one retrieved from the db.

        Example marker model for markers array:
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
      for (var i=0; i < $scope.POIs.length; i++) {

        markers.push({
          id: i,
          latitude: $scope.POIs[i].lat,
          longitude: $scope.POIs[i].long,
          icon: '../../img/pirates.png',
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