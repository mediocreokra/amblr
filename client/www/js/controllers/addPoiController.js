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
  });
  // .catch(function(err) {
  //   console.log('error in getting modal ', err);
  // });

  //current POI is an object with properties: lat, long, type, description, title
  //set default of type to good
  $scope.selected='good';
  $scope.currentPOI = { type: 'good'};

  //save POI upon user save
  $scope.savePOI = function() {
    console.log('current POI ', $scope.currentPOI);
    //post currentPOI to the database
    POIs.savePOI($scope.currentPOI)
    .then(function(poi) {
      console.log('poi saved', poi);
      //clear out currentPOI
      $scope.poiSaved = poi;
      $scope.currentPOI = {type: 'good'};
      console.log($scope.currentPOI, 'after');
      $scope.closeForm();
      // redirect to home page (may not need this)
      $scope.onSuccess();
      $location.path('/menu/home');
    })
    .catch(function(err) {
      console.log('error in saving poi to database', err);
      $scope.onError();
    });
  };
  //cancel POI 

  $scope.onError = function() {
    $ionicPopup.alert({
      title: 'Oops there as was Problem :(',
      template: 'Would you like to try again?',
      buttons: [
      { text: 'Cancel'},
      { text: 'Try Again',
        type: 'button-dark',
        onTap: function(e) {
          $scope.openForm(); 
        }
      }]
    });
  };

  $scope.onSuccess = function() {
    $ionicPopup.alert({
      title: 'POI Saved!',
      template: 'Yay! You\'ve successfully added a POI to amblr!'
    });
  };

  $scope.cancelPOI = function() {
    $scope.currentPOI = { type: 'good'};
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
      $ionicPopup.alert({
        title: 'Error in getting current location',
        template: 'Please Try again later'
      });
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