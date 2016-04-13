angular.module('amblr.map', [])

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, POIs, $ionicLoading) {

  $scope.POIs = [];

  //
  POIs.getPOIs()
  .then(function(response) {
    $scope.POIs = response.data;
    console.log('pois received in map controller.js');
  })
  .catch(function(err) {
    console.log('err getting pois in map controller.js: ', err);
  });

  $scope.mapCreated = function(map) {
    $scope.map = map;
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

      //creat a function that calls the POIs that are in teh database
      //iterate through our POIs
      // for (var i=0; i < $scope.POIs.length; i++) {
      //   //create a new latLng object
      //   console.log($scope.POIs[i].long, $scope.POIs[i].lat);
      //   latLng2 = new google.maps.LatLng($scope.POIs[i].lat, $scope.POIs[i].long);
      //   //var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      //   //create a new marker with latLng
      //   new google.maps.Marker({
      //     map: $scope.map,
      //     animation: google.maps.Animation.DROP,
      //     position: latLng2
      //   }); 
      // }
      //     infoWindow.open($scope.map, marker);
      // });

    // });
  //     var infoBubble = new InfoBubble({
  //       content: '<div class="phoneytext">' + 'Add a POI!' + '<div class="left-col2"></div></div>',
  //       boxClass: 'info-box',
  //       pixelOffset: new google.maps.Size(-150, -40),
  //       borderColor: '#ffffff',
  //       borderRadius: '0',
  //       // maxWidth: 535,
  //       // disableAutoPan: false,
  //       // hideCloseButton: false,
  //       shadowStyle: 1,
  //       padding: 0,
  //       backgroundColor: 'rgb(57,57,57)',
  //       borderRadius: 4,
  //       arrowSize: 10,
  //       borderWidth: 1,
  //       borderColor: '#2c2c2c',
  //       disableAutoPan: true,
  //       hideCloseButton: true,
  //       arrowPosition: 30,
  //       backgroundClassName: 'phoney',
  //       arrowStyle: 2
  //     });
  //     console.log(infoBubble);
  //     infoBubble.open($scope.map, $scope.CurrentMarker);
  //     console.log('content of infobubble', infoBubble.content);

  //     google.maps.event.addListener($scope.CurrentMarker, 'click', function () { 
  //     });
  //   });
  // };
});
