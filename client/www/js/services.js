angular.module ('amblr.services', [])

.factory('POIs', function($http) {
  var POIs = {};

  POIs.getPOIs = function(){
    return $http.get('http://127.0.0.1:3000/api/allPOI')
    .then(function(pois){
      console.log('returning pois are: ', pois);
      return pois;
    })
    .catch(function(err) {
      console.log('error in getting pois in services.js: ', err);
    });
  };

  return POIs;
});