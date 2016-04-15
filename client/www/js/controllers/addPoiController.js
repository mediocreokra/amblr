angular.module('amblr.addPOI', [])
.controller('addPOIController', function($scope, $timeout, $ionicModal, POIs, $location, $ionicPopup, Location) {

  $ionicModal.fromTemplateUrl('../../templates/addPOI.html', {
    scope: $scope,
    animation: 'slide-in-up',
    // backdropClickToClose: true,
    // hardwareBackButtonClose: true
  })
  .then(function(modal) {
    $scope.modal = modal;
  })
  .catch(function(err) {
    console.log('error in getting modal ', err);
  });

  //current POI is an object with properties: lat, long, type, description, title
  //set default of type to good
  $scope.currentPOI = { type: 'good'};

  //save POI upon user save
  $scope.savePOI = function() {
    console.log($scope.currentPOI);
    //post currentPOI to the database
    POIs.savePOI($scope.currentPOI)
    .then(function(poi) {
      console.log('poi saved', poi);
      //clear out currentPOI
      $scope.currentPOI = {};
      // $scope.closeForm();
      // redirect to home page (may not need this)
      $location.path('/menu/home');
    })
    .catch(function(err) {
      console.log('error in saving poi to database', err);
      //TODO: 
      // alert('error in saving to database');
      // $scope.noSave();
      // $scope.closeForm();
    });
  };
  //cancel POI 
  $scope.cancelPOI = function() {
    $scope.currentPOI = {};
    $scope.closeForm();
    $location.path('/menu/home');
  };

  $scope.openForm = function() {
    //get current position from Location factory
    Location.getCurrentPos()
    .then(function(pos) {
      console.log('pos from factory call', pos);
      $scope.currentPOI.lat = pos.lat;
      $scope.currentPOI.long = pos.long;
      //once position is found, open up modal form
      console.log($scope.currentPOI);
      $scope.modal.show();
    })
    .catch(function(err) {
      console.log('error in getting current pos', err);
      alert('unable to get current location');
      $location.path('/menu/home');
    });
    //returns a promise which is resolved when modal is finished animating in.
  };

  //close POI form
  $scope.closeForm = function() {
    $scope.modal.hide();
  };
  //toggles View of modal form depending on state
  $scope.toggleView = function() {
    if ($scope.modal.isShown()) {
      $scope.closeForm();
    } else {
      $scope.openForm();
    }
  };
  //clean up modal when done
  $scope.$on('$destroy', function() {
    $scope.modal.hide();
  });

  //TODO: confirm to user whether POI save was successful for not
  //TODO: would use ionicPopUp
  $scope.confirmSave = function() {
    $scope.popUp = $ionicPopup.show({
      template: 'Saving POI...'
    });
  };

  // $timeout(function() {
  //   $scope.popUp.close();
  // }, 1000);

  $scope.NoSave = function() {
    $scope.popUp = $ionicPopup.show({
      template: '<input type="submit"/>',
      title: 'Oops, looks like there was a problem...',
      template: 'Would you like to try again?',
      scope: $scope,
      buttons: [
      { text: 'Cancel'},
      { text: 'Try Again',
        type: 'button-positive',
        onTap: function(e) {
          $scope.openForm(); 
        }
      }]
    });
  };



});