angular.module('amblr.directives', [])
  //setting directive on <map></map> element
.directive('map', function() {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&'
    },
    link: function ($scope, $element, $attr, $cordovaGeolocation, $ionicLoading) {
      var initialize = function() {
        //create google maps from home coordinates upon loading
        var latLng = new google.maps.LatLng(37.7938494, -122.41923439999999);
        var mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        //this creates map on the first <map></map> element in map.html
        var map = new google.maps.Map($element[0], mapOptions);
        
        $scope.onCreate({map: map});
        // Stop the side bar from dragging when mousedown/tapdown on the map
        google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
          e.preventDefault();
          return false;
        });
        google.maps.event.addListenerOnce(map, 'idle', function() {
        //recenter the map to current location
          navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
              position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
              map: map,
              draggable: true
            });
          });
        });
      };
      if (document.readyState === 'complete') {
        initialize();
      } else {
        google.maps.event.addDomListener(window, 'load', initialize);
      }
    }
  };
});
