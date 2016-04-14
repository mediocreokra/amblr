angular.module('amblr.addPOI', [])
.controller('addPOIController', function($scope, $ionicModal, POIs, $location) {

  $ionicModal.fromTemplateUrl('../../templates/addPOI.html', {
    scope: $scope,
    animation: 'slide-in-up',
    // backdropClickToClose: true,
    // hardwareBackButtonClose: true
  })
  .then(function(modal) {
    $scope.modal = modal;
    console.log($scope.modal);
  })
  .catch(function(err) {
    console.log('error in getting modal ', err);
  });

  $scope.currentPOI = {
    //lat : TODO: figure out how to get lat and long of currentPOI from MapCtrl
    //long :
    //type: bad or good
    //description: 
    //title: 
  };
  //add POI
  $scope.savePOI = function() {
    console.log($scope.currentPOI);
    //clear out currentPOI info
    //TODO: post currentPOI to the database
    $scope.currentPOI = {};
    POIs.savePOI($scope.currentPOI)
    .then(function(poi) {
      //close modal
      $scope.closeForm();
      // redirect to home page (may not need this)
      $location.path('/menu/home');
    })
    .catch(function(err) {
      console.log('error in saving poi to database', err);
      alert('error in saving to database');
      $scope.closeForm();
    });
  };
  //cancel POI 
  $scope.cancelPOI = function() {
    console.log($scope.currentPOI);
    $scope.currentPOI = {};
    $scope.closeForm();
    $location.path('/menu/home');
  };

  $scope.openForm = function() {
    //returns a promise which is resolved when modal is finished animating in.
    $scope.modal.show();
  };

  //close POI form
  $scope.closeForm = function() {
    console.log('closing form');
    console.log($scope.modal);
    $scope.modal.hide();
  };

  //clean up modal when done
  $scope.$on('$destroy', function() {
    $scope.modal.hide();
  });
});