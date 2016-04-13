angular.module ('amblr.services', [])

.factory('POIs', function($http) {
  var POIs = {};

  POIs.getPOIs = function() {
    return $http.get('http://127.0.0.1:3000/api/allPOI')
    .then(function(pois) {
      console.log('returning pois are: ', pois);
      return pois;
    })
    .catch(function(err) {
      console.log('error in getting pois in services.js: ', err);
    });
  };

  return POIs;
});

// .factory('Map', function($cordovaGeolocation, Markers) {

//     // var map = null;
//   var map = {};

//   map.initMap = function() {
//     var options = { timeout: 10000, enableHighAccuracy : true};

//     var latLng = new google.maps.LatLng(37.7938494, -122.41923439999999);
//     var mapOptions = {
//     center: latLng,
//     zoom: 15,
//     mapTypeId: google.maps.MapTypeId.ROADMAP
//     };
//     map = new google.maps.Map(document.getElementById("map"), mapOptions);

//     //Wait until the map is loaded
//     google.maps.event.addListenerOnce(map, 'idle', function(){
 
//         //Load the markers
//       loadMarkers();
 
//       });
 
//   }, function(error){
//     console.log("Could not get location");
 
//         //Load the markers
//         loadMarkers();
//   });
 
//   }
 
//   };
  //       var initialize = function() {
  //         //create google maps from home coordinates upon loading
  //         var mapOptions = {
  //           center: latLng,
  //           zoom: 15,
  //           mapTypeId: google.maps.MapTypeId.ROADMAP
  //         };
  //         //this creates map on the first <map></map> element in map.html
  //         var map = new google.maps.Map($element[0], mapOptions);
          
  //         $scope.onCreate({map: map});
  //         console.log('map created from directive', map);
  //         // Stop the side bar from dragging when mousedown/tapdown on the map
  //         google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
  //           e.preventDefault();
  //           return false;
  //         });
          
  //         google.maps.event.addListenerOnce(map, 'idle', function() {
  //         //recenter the map to current location
  //           navigator.geolocation.getCurrentPosition(function(pos) {
  //             map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
  //             var myLocation = new google.maps.Marker({
  //               position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
  //               map: map,
  //               draggable: true
  //             });
  //           });
  //         });
  //       };
  //       if (document.readyState === 'complete') {
  //         initialize();
  //       } else {
  //         google.maps.event.addDomListener(window, 'load', initialize);
  //       }
  //     }
  //   };
  // });

//   return map;
// });