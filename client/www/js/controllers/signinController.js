angular.module('amblr.signin', [])
.controller('signinCtrl', function($scope, $ionicModal, $http) {
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
    $scope.modal.show();
  };

  // Perform the signin action when the user submits the signin form
  $scope.doSignin = function() {
    console.log('Doing signin', $scope.signinData);

    $http({
      method: 'POST',
      url: '/api/users/signin',
      data: $scope.signinData
    })
    .then(function(res) {
      $scope.closeSignin();
    }, function(err) {
      throw new Error ('Error signing in user: ' + $scope.signinData.username + ', error: ' + err);
    });
    
  };
});
