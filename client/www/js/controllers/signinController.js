angular.module('amblr.signin', [])
.controller('signinCtrl', function($scope, $ionicModal, $http, $location, $ionicPopup) {
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
      if (res.data === '') {
        // if res.data is an empty string, sign up was successful, so send user to private menu
        $location.path('/menu-private/home');
      }
    }, function(err) {
      console.log('Error during signin with username: ', $scope.signinData.username);  
      console.dir(err);
      $scope.onError();
      return err;
    });

  };

  $scope.onError = function() {
    $ionicPopup.alert({
      title: 'Oops there was a problem signing in :(',
      template: 'Would you like to try again?',
      buttons: [
      { text: 'Cancel'},
      { text: 'Try Again',
        type: 'button-dark',
        onTap: function(e) {
          $scope.signin(); 
        }
      }]
    });
  };
});
