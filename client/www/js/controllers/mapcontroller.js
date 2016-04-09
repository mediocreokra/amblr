angular.module('amblr.map', [])

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, POIs) {
  var options = {timeout: 10000, enableHighAccuracy: true};

  $scope.POIs=[];
  
  POIs.getPOIs()
  .then(function(response){
    $scope.POIs=response.data;
    console.log('pois received in map controller.js');
  })
  .catch(function(err){
    console.log('err getting pois in map controller.js: ', err);
  })


  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    console.log(position.coords.latitude, position.coords.longitude);

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

      //iterate through our POIs
      for (var i=0; i < $scope.POIs.length; i++) {
        //create a new latLng object
        console.log($scope.POIs[i].long, $scope.POIs[i].lat);
        latLng2 = new google.maps.LatLng($scope.POIs[i].lat, $scope.POIs[i].long);
        //var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        //create a new marker with latLng
        new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng2
        }); 
      }

      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
      });

    });



  }, function(error){
    console.log("Could not get location");
  });
});
