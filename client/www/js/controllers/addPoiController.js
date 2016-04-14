angular.module('addPOI', ['uiGmapgoogle-maps'])
.controller('addPOIController', function($scope, $ionicModal, POIs,$log, $timeout) {

  //current POI that is selected
  $scope.currentPOI = {};

  $scope.getCurrentPOI = function(POI) {
    $scope.currentPOI = POI;

  };
});