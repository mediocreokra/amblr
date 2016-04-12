angular.module('amblr.leftnav', [])
.controller('LeftMenuNav', function($scope, $ionicSideMenuDelegate) {
  $scope.showMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
});