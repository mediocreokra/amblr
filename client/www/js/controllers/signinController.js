angular.module('amblr.signin', [])
.controller('signinCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the signin modal
  $scope.signinData = {};

  // Create the signin modal that we will use later
  $ionicModal.fromTemplateUrl('../../templates/signin.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the signin modal to close it
  $scope.closeSignin = function() {
    $scope.modal.hide();
  };

  // Open the signin modal
  $scope.signin = function() {
    console.log('in signin controller');
    $scope.modal.show();
  };

  // Perform the signin action when the user submits the signin form
  $scope.doSignin = function() {
    console.log('Doing signin', $scope.signinData);

    // Simulate a signin delay. Remove this and replace with your signin
    // code if using a signin system
    $timeout(function() {
      $scope.closeSignin();
    }, 1000);
  };
});
