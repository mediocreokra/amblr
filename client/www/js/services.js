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
})

.factory('Location', function($cordovaGeolocation, $ionicLoading) {

  var location = {};

  location.getCurrentPos = function() {
    var position = {};
    $ionicLoading.show({
      template: 'Getting current location...',
      noBackdrop: true
    });

    var options = {timeout: 10000, enableHighAccuracy: true};
    return $cordovaGeolocation.getCurrentPosition(options).then(function (pos) {
      console.log('Got pos', pos);
      position.lat = pos.coords.latitude;
      position.long = pos.coords.longitude;

      $ionicLoading.hide();
      return position;
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };

  return location;

});