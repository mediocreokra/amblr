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
  $window, Location, $timeout, $location) {

  $scope.POIs = [];

  var lat = 37.786439;
  var long = -122.408199;

  // create dummy dropMarker, will be replaced in placeMarker function when this 
  // didn't exist, would get the following error when attempting to drop marker:
  // gMarker.key undefined and it is REQUIRED!! error 
  $scope.dropMarker = {
    id: 0
  };
  
  // $scope.currentPOI = {
  //   lat: -1,
  //   long: -1,
  //   type: '',
  //   description: '',
  //   title: ''
  // };

  $scope.resetPOI = function () {
    $scope.currentPOI = {
      lat: -1,
      long: -1,
      type: 'good',
      description: '',
      title: ''
    };
  };
  // sets a default POI
  $scope.resetPOI();

  $scope.map = {
    center: {
      latitude: lat,
      longitude: long
    },
    zoom: 15,
    control: {},
    POIMarkers: [], // array of marker models, used by ui-gmap-markers in map.html
    events: {
      mousedown: function (map, eventName, originalEventArgs) {

        var e = originalEventArgs[0];

        if(angular.isUndefined($scope.placeMarkerPromise)) {
          $scope.placeMarkerPromise = $timeout(
            function placeMarkerDelayed() {
              $scope.placeMarker(e.latLng);
            }, 1000);
        }

        $scope.map.infoWindow.show = false;

        $scope.$apply();

      },
      mouseup: function (map, eventName, originalEventArgs) {
        //if user mouses up before marker dropped, cancel it
        $scope.placeMarkerCancel();
      }, 
      dragstart: function (map, eventName, originalEventArgs) {
        //if user starts to drag map before marker is dropped, cancel it
        $scope.placeMarkerCancel();
      }
    },
    options: {
      scrollwheel: false
    },
    /*  
       infoWindow used to show popup above marker pin when it is 
       clicked or on dragend. Used by ui-gmap-window in map.html
    */
    infoWindow: {
        coords: {
          latitude: 37.786439,
          longitude: -122.408199
        },
        options: {
          disableAutoPan: false,
          // use pixelOffset to move the InfoWindow above the marker icon
          pixelOffset: new $window.google.maps.Size(0, -35)
        },
        show: false,
        templateUrl: '../../templates/POIInfoWindow.html',
    },
    droppedInfoWindow: {
        coords: {
          latitude: 37.786439,
          longitude: -122.408199
        },
        options: {
          disableAutoPan: false,
          // use pixelOffset to move the InfoWindow above the marker icon
          pixelOffset: new $window.google.maps.Size(0, -35),
        },
        show: false,
        templateUrl: '../../templates/addPOIInfoWindow.html',
        templateParameter: {
          currentPOI: $scope.currentPOI
        },
    }
  };

  //use a promise to tell when the map is ready to be interacted with
  uiGmapIsReady.promise()
  .then(function (instances) {

    console.log('equals = ' + (instances[0].map === $scope.map.control.getGMap()));

    // retrieve all the POIs from server and place them on map
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
    $scope.map.droppedInfoWindow.show = false;
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
           icon = '../../img/star-3.png'
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

              //these are not getting passed to the POI Info Window template
              infoWindow.title = marker.title;
              infoWindow.description = marker.description;
              infoWindow.type = marker.type;
              

              //the info window only maintains the coords object so I had to store these values in it to pass to the POIInfoWindow template
              infoWindow.coords.title = marker.title;
              infoWindow.coords.type = marker.type;
              infoWindow.coords.description = marker.description;
              infoWindow.show = true;
            }
          },
        });
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

  // Listen for broadcast events fired from within services.js
  $scope.$on('centerMap', function () {
    $scope.setMapCenterCurrent();
  });
  $scope.$on('reloadPOIs', function() {
    $scope.addNewPOIs();
  });

  // delete the user added marker (dropMarker object)
  $scope.removeMarker = function() {
    if (angular.isDefined($scope.dropMarker)) {
      delete $scope.dropMarker;
    }
  };

  /*
    Function to place a marker on the map when a user long clicks 
    on the map.  Called from $timeout callback function defined in
    mousedown event on $scope.map.  
  */
  $scope.placeMarker = function(latLng)  {

    $scope.removeMarker();

    $scope.$apply( function() {
      $scope.dropMarker = {
        id: 1,
        coords: {
          latitude: latLng.lat(),
          longitude: latLng.lng()
        },
        animation: google.maps.Animation.DROP,
        options: {
          draggable: true,
          icon:'../../img/information-grn.png'
        },
        maxWidth: 350,
        events: {
          dragstart: function(marker, eventName, args) {
            // disable dragging for side menu when user is dragging marker
            // if we don't the menu will be dragged open
            $ionicSideMenuDelegate.canDragContent(false);
          },
          dragend: function (marker, eventName, args) {
            // re-enable dragging for side menu 
            $ionicSideMenuDelegate.canDragContent(true);

            var lat = marker.getPosition().lat();
            var lon = marker.getPosition().lng();
     
            $scope.dropMarker.options = {
              draggable: true,
              icon: '../../img/information-grn.png'
            };

            //update droppedInfoWindow lat/long
            $scope.map.droppedInfoWindow.coords.latitude = marker.position.lat();
            $scope.map.droppedInfoWindow.coords.longitude = marker.position.lng();
            $scope.currentPOI.latitude = marker.position.lat();
            $scope.currentPOI.longitude = marker.position.lng();

          },
          click: function(marker, eventName, args) {
            // set the lat/long of the InfoWindow to the marker clicked on
            $scope.map.droppedInfoWindow.coords.latitude = marker.position.lat();
            $scope.map.droppedInfoWindow.coords.longitude = marker.position.lng();
            $scope.currentPOI.lat= marker.position.lat();
            $scope.currentPOI.long = marker.position.lng();
            $scope.map.droppedInfoWindow.show = true;
          }
        }
      };
    });

    // remove the promise that was created by $timeout in onmousedown of map
    delete $scope.placeMarkerPromise;

  };

  // if $timeout is still waiting to be called (i.e. user has mouse downed but the
  // timeout wait time has not elapsed), cancel the $timeout so that it does not
  // create the marker.  Currently called on mouseup and dragstart events on map
  $scope.placeMarkerCancel = function() {
    if(angular.isUndefined($scope.placeMarkerPromise)) {
      return;
    }

    $timeout.cancel($scope.placeMarkerPromise);
    delete $scope.placeMarkerPromise;
  };

  $scope.savePOI = function() {
     console.log('saving POI: ' + JSON.stringify($scope.currentPOI));
     POIs.savePOI($scope.currentPOI)
      .then(function(poi) {
        console.log('poi saved', poi);
        //clear out currentPOI
        $scope.map.droppedInfoWindow.show = false;
        $scope.resetPOI();

        // $window.location.reload();
        $scope.removeMarker();
        $scope.addNewPOIs();
      })
      .catch(function(err) {
        console.log('error in saving poi to database', err);
      });
  };

});

