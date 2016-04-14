angular.module ('amblr.services', [])

.factory('POIs', function($http) {
  var POIs = {};

  POIs.getPOIs = function() {
    return $http.get('http://127.0.0.1:3000/api/pois/')
    .then(function(pois) {
      console.log('returning pois are: ', pois);
      return pois;
    })
    .catch(function(err) {
      console.log('error in getting pois in services.js: ', err);
    });
  };

  POIs.savePOI = function(POI) {
    console.log('in save poi', POI);
    return $http({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/pois/',
      data: JSON.stringify(POI)
    }).then(function(res) {
      return res;
    })
    .catch(function(err) {
      console.log('error in saving poi to databse', err);
    });
  };
  return POIs;
});

// .factory('Maps', function($cordovaGeolocation, POIs, $ionicLoading){
 
//   // var apiKey = false;
//   // var map = null;
//   var map = {};
//   map.initMap = function(){
//     console.log('map initialized');
//     var options = {timeout: 10000, enableHighAccuracy: true};
//     $cordovaGeolocation.getCurrentPosition(options).then(function(position){
//       var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
//       var mapOptions = {
//         center: latLng,
//         zoom: 15,
//         mapTypeId: google.maps.MapTypeId.ROADMAP
//       };
//       var newMap = new google.maps.Map(document.getElementById("map"), mapOptions);
 
//       //Wait until the map is loaded
//       google.maps.event.addListenerOnce(newMap, 'idle', function(){
 
//         //Load the pois
//         map.addPOIs();
 
//       });
//       console.log(map);
//     }, function(error){
//       console.log("Could not get location");

//         //Load the markers
//         map.addPOIs()
//     });
 
//   }
 
//   map.addPOIs = function() {
 
//       //Get all of the markers from our Markers factory
//       POIs.getPOIs().then(function(pois){
 
//         console.log("pois: ", pois);
 
//         var markers = pois.data.result;
 
//         for (var i = 0; i < markers.length; i++) {
 
//           var marker = markers[i];   
//           var markerPos = new google.maps.LatLng(marker.lat, marker.lng);
 
//           // Add the markerto the map
//           var newPOI = new google.maps.Marker({
//               map: map,
//               animation: google.maps.Animation.DROP,
//               position: markerPos
//           });
 
//           var infoWindowContent = "<h4>" + record.name + "</h4>";          
 
//           addInfoWindow(newPOI, infoWindowContent, record);
 
//         }
 
//       }); 
 
//   }
 
//   map.addInfoWindow = function(marker, message, record) {
 
//       var infoWindow = new google.maps.InfoWindow({
//           content: message
//       });
 
//       google.maps.event.addListener(marker, 'click', function () {
//           infoWindow.open(map, marker);
//       });
 
//   }

//   return map;
 
// });