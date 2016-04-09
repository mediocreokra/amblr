angular.module('amblr.map', [])

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {
  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    var holdLat = [];
    var holdLong = [];
    holdLat.push(position.coords.latitude); 
    holdLat.push(position.coords.latitude+.001); 
    holdLong.push(position.coords.longitude);
    holdLong.push(position.coords.longitude+.001);
    var latLng2 = new google.maps.LatLng(holdLat[1], holdLong[1]);

    console.log(position.coords.latitude, position.coords.longitude);
    console.log(holdLat[1], holdLong[1]);

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){

      var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
      });      

      var infoWindow = new google.maps.InfoWindow({
          content: "Here I am!"
      });

      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
      });

      var marker2 = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng2
      }); 
      google.maps.event.addListener(marker2, 'click', function () {
          infoWindow.open($scope.map, marker2);
      });

    });

  }, function(error){
    console.log("Could not get location");
  });
});
