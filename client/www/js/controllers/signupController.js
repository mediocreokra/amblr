angular.module('amblr.signup', [])
.controller('signupCtrl', function($scope, $ionicModal, $http, $location, $ionicPopup) {
  // Form data for the signup modal
  $scope.signupData = {};

  // Create the signup modal that we will use later
  $ionicModal.fromTemplateUrl('../../templates/signup.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the signup modal to close it
  $scope.closeSignup = function() {
    $scope.modal.hide();
  };

  // Open the signup modal
  $scope.signup = function() {
    $scope.modal.show();
  };

  $scope.showAlert = function() {
    $ionicPopup.alert({
      title: 'Error',
      template: 'Oops! There was a problem with your sign up form. Please try again.'
    });
  };

  // Perform the signup action when the user submits the signup form
  $scope.doSignup = function() {
    console.log('Doing signup with username: ', $scope.signupData.username);
    $http({
      method: 'POST',
      url: '/api/users/signup',
      data: $scope.signupData
    })
    .then(function(res) {
      $scope.closeSignup();
      if (res.status === 200) { // if sign up is successful, go to private menu
        $location.path('/menu-private/home');
      } 
    }, function(err) {
      $scope.showAlert(); // if sign up is not successful, show alert message
      throw new Error ('Error signing up user: ' + $scope.signupData.username + ', error: ' + err);
    });
    
  };
});
