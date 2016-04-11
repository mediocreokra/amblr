angular.module('amblr.map', [])

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, POIs) {
  var options = {timeout: 10000, enableHighAccuracy: true};

  $scope.POIs=[];
  // $scope.currentPOI = null;

  POIs.getPOIs()
  .then(function(response){
    $scope.POIs=response.data;
    console.log('pois received in map controller.js');
  })
  .catch(function(err){
    console.log('err getting pois in map controller.js: ', err);
  });

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    console.log(position.coords.latitude, position.coords.longitude);

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    $scope.currentpos = latLng;
    console.log('current pos on load', $scope.currentpos);
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){


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

      // google.maps.event.addListener(marker, 'click', function () {
      //     infoWindow.open($scope.map, marker);
      // });

    });

  }, function(error){
    console.log("Could not get location");
  });

  $scope.getCurrentPOI = function() {
    // google.maps.event.addListenerOnce($scope.map, 'idle', function(){
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    $scope.currentpos = latLng;

    console.log('getting currentPOI from click', $scope.currentpos);

    if ($scope.currentMarker) {
      $scope.currentMarker = null;
    }
    $scope.CurrentMarker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: $scope.currentpos,
      draggable: true
    });      

    var infoBubble = new InfoBubble({
      content: '<div class="phoneytext">' + 'Add a POI!' + '<div class="left-col2"></div></div>',
      boxClass: 'info-box',
      pixelOffset: new google.maps.Size(-150, -40),
      borderColor: '#ffffff',
      borderRadius: '0',
      // maxWidth: 535,
      // disableAutoPan: false,
      // hideCloseButton: false,
      shadowStyle: 1,
      padding: 0,
      backgroundColor: 'rgb(57,57,57)',
      borderRadius: 4,
      arrowSize: 10,
      borderWidth: 1,
      borderColor: '#2c2c2c',
      disableAutoPan: true,
      hideCloseButton: true,
      arrowPosition: 30,
      backgroundClassName: 'phoney',
      arrowStyle: 2
    });
      console.log(infoBubble);
      infoBubble.open($scope.map, $scope.CurrentMarker);
      console.log('content of infobubble', infoBubble.content);

      google.maps.event.addListener($scope.CurrentMarker, 'click', function () { 
      });
    });
  };


  $scope.savePOI = function() {

  };
});
