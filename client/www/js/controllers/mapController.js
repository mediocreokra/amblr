angular.module('amblr.map', ['uiGmapgoogle-maps'])
.config(function($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyBceRLiJZrDWlQiK3vu2Mc6-gzp84ZQX5U',
    v: '3.20', //defaults to latest 3.X anyhow
    libraries: 'weather,geometry,visualization'
  });
})
.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, POIs,
  $ionicLoading, uiGmapGoogleMapApi, uiGmapIsReady, $log, $ionicSideMenuDelegate,
  $window, Location) {

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
 
        $scope.dropMarker.options = {
          draggable: true,
          labelContent: "lat: " + $scope.dropMarker.coords.latitude + ' ' + 'lon: ' + $scope.dropMarker.coords.longitude,
          labelAnchor: "100 0",
          labelClass: "marker-labels",
          icon: '../../img/information.png' 
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
        // debugger;
        //hide any info window that is open
        $scope.map.infoWindow.show = false;

        $scope.$apply();
      }
    },
    options: {
      scrollwheel: false
    },

    /*  used to show popup above pin when it is clicked or on dragend */
    infoWindow: {
        coords: {
          latitude: 37.786439,
          longitude: -122.408199
        },
        options: {
          disableAutoPan: true,
          // use pixelOffset to move the InfoWindow above the marker icon
          pixelOffset: new $window.google.maps.Size(0, -35)
        },
        show: false,
        templateUrl: '../../templates/addPOI.html',
        templateParameter: {
          message: 'passed in from the opener'
        }
    }
  };

  //use a promise to tell when the map is ready to be interacted with
  uiGmapIsReady.promise()
  .then(function (instances) {

    console.log('equals = ' + (instances[0].map === $scope.map.control.getGMap()));

    $scope.addNewPOIs();


  })
  .then(function(){
    //after the map and POIs have loaded, lets set the current position
    $scope.setMapCenterCurrent();
  })
  .catch(function(err) {
    console.log('error in doing things when map is ready', err);
  });

  /*
    Function to set the show property of the infoWindow on markers 
    that is needed when a user clicks the close of the infoWindow.
    This is the closeClick property on the ui-gmap-window element
    in map.html
  */
  $scope.closeInfoWindowClick = function() {
    $scope.map.infoWindow.show = false;
  };
  
  $scope.addNewPOIs = function () {
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

        var icon = '';
        if ($scope.POIs[i].type === 'good') {
           icon = '../../img/information.png'
        } else {
           icon = '../../img/pirates.png'
        }

        markers.push({
          id: i,
          latitude: $scope.POIs[i].lat,
          longitude: $scope.POIs[i].long,
          icon: icon,
          description: $scope.POIs[i].description,
          title: $scope.POIs[i].title,
          type: $scope.POIs[i].type,
          events: {
            click: function (map, eventName, marker) {
                
              var lat = marker.latitude;
              var lon = marker.longitude;
              var infoWindow = $scope.map.infoWindow;

              infoWindow.coords.latitude = lat;
              infoWindow.coords.longitude = lon;
              infoWindow.title = marker.title;
              infoWindow.description = marker.description;
              infoWindow.type = marker.type;
              infoWindow.show = true;
            }
          },
        });

        console.log($scope.POIs[i].long, $scope.POIs[i].lat); 
      }

      $scope.map.POIMarkers = markers;

    })
    .catch(function(err) {
      console.log('err getting pois in map controller.js: ', err);
    });
  };

  $scope.setMapCenterCurrent = function () {
    Location.getCurrentPos()
      .then(function(pos) {
        console.log('pos from factory call', pos);
      //   //once position is found, open up modal form
        $scope.map.center = {
        latitude: pos.lat,
        longitude: pos.long
        };
    
      })
      .catch(function(err) {
        console.log('error in getting current pos', err);
        $ionicPopup.alert({
          title: 'Error in getting current location',
          template: 'Please Try again later'
        });
      });
  }; 

  $scope.$on('centerMap', function () {
    $scope.setMapCenterCurrent();
  });

  $scope.$on('reloadPOIs', function() {
    $scope.addNewPOIs();
  })

});
