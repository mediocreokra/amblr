angular.module('amblr.centerMap', [])
.controller('centerMapController', function($scope, CenterMap) {
  $scope.recenter = function() {
    CenterMap.recenter();
  };
});