angular.module('amblr.signin', [])
.controller('signinCtrl', function($scope, $ionicModal, $http, $location) {
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
    console.log('Doing signin with username: ', $scope.signinData.username);    
    $http({
      method: 'POST',
      url: '/api/users/signin',
      data: $scope.signinData
    })
    .then(function(res) {
      $scope.closeSignin();
      // signin successful, redirect to private page
      $location.path('/menu-private/home');
    }, function(err) {
      console.log('Error during signin with username: ', $scope.signinData.username);  
      console.dir(err);
    });

  };
});
