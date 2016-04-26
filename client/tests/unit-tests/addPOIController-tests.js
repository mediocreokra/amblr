describe('addPOIController', function() {

  var controller,
    $scope,
    LocationMock,
    POIsMock,
    location,
    deferred,
    ionicModalMock,
    modalMock,
    ionicPopupMock,
    $httpBackend;

  // Load the App Module
  beforeEach(module('amblr'));
  beforeEach(angular.mock.module('amblr'));

  //ignore get requests of templates
  beforeEach(module(function($provide, $urlRouterProvider) {
    $provide.value('$ionicTemplateCache', function() {
      $urlRouterProvider.deferIntercept();
    });
  }));

  //get services needed
  beforeEach(inject(function($controller, $q, $rootScope, Location, POIs, $location, $http, $injector, $ionicModal, $ionicPopup) {
    deferred = $q.defer();
    spyPromise = deferred.promise;
    $scope = $rootScope.$new();
    //inject fake httpbackend to ignore template get requests
    //this is to prevent errors of 'unexpected get request' as test will load up all templates of app
    //This may not be the correct way to ignore the template requests
    //TODO: research templateCache ****** 
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', /\.html$/).respond(200);

    //set up mocks for services passed in
    //create spy for $location service (returns promise)
    location = { 'path': jasmine.createSpy('location spy').and.returnValue(deferred.promise)};
    
    //set up mock for POIs service
    POIsMock = {
      savePOI: function(POI) {
        deferred = $q.defer();
        return deferred.promise;
      }
    };
    //set up mock for Location service
    LocationMock = {
      getCurrentPos: function() {
        deferred = $q.defer();
        return deferred.promise;
      }
    };

    ionicPopupMock = jasmine.createSpyObj('popup', ['alert']);
    //TODO: set up ionicModal mock    
    ionicModalMock = {
      fromTemplateUrl: jasmine.createSpy('$ionicModal.fromTemplateUrl', ['fromTemplateUrl'])
    };

    //create a mock of the modal you gonna pass and resolve at your fake resolve
    modalMock = jasmine.createSpyObj('$scope.modal', ['show', 'hide', 'isShown']);

    ionicModalMock.fromTemplateUrl.and.callFake(function() {
      return $q.when(modalMock);
      // $q.when wraps an object that might be a value or a (3rd party) then-able promise into a $q promise. 
      // This is useful when you are dealing with an object that might or might not be a promise.
    });

    //initialize the controller, passing spy services instance
    controller = $controller('addPOIController', {
      $scope: $scope,
      $location: location,
      POIs: POIsMock, //service mock
      Location: LocationMock, //service mock
      $ionicModal: ionicModalMock,
      $ionicPopup: ionicPopupMock
    });
    //must flush the backend before doing any 'expect tests'
    //things come back undefined otherwise
    $httpBackend.flush();

  }));

  //after each function call, must check there are no outstanding requests from $httpBackend
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  //simple scope variable check
  describe('scope variable exists', function() {
    it('should have the correct scope', function() {

      expect($scope).toBeDefined();
      expect($scope.savePOI).toBeDefined();
      expect($scope.onError).toBeDefined();
      expect($scope.openForm).toBeDefined();
      expect($scope.modal).toBeDefined();
    });
  });

  describe('close form function', function() {
    it('should close modal upon calling it', function() {
      
      $scope.closeForm();
      expect($scope.modal.hide).toHaveBeenCalled();
    });
  });

  describe('#openForm', function() {
    beforeEach(inject(function(_$rootScope_, $injector, $q) {
      $rootScope = _$rootScope_;

      spyOn(LocationMock, 'getCurrentPos').and.callThrough();
      $scope.openForm();
    }));

    describe('user clicks on addPOI #openForm is executed', function() {
      it('if successful, should set currentPOI to position returned and show modal', function() {
        //set fakePos for LocationMock to return
        var fakePos = { lat: 37, long: -122 };
        //resolve the promise to return fakePos
        deferred.resolve(fakePos);
        //run the lifecycle
        $scope.$root.$digest();

        expect($scope.currentPOI.lat).toBe(37);
        expect($scope.modal.show).toHaveBeenCalled();
      });

      it('if not successful, should popup an alert and redirect to home page', function() {
        
        deferred.reject();
        $scope.$root.$digest();

        expect(ionicPopupMock.alert).toHaveBeenCalled();
        expect(location.path).toHaveBeenCalledWith('/menu/home');
      });
    });
  });

  //test functionality of savePOI
  describe('#savePOI', function() {
    beforeEach(inject(function(_$rootScope_, $injector, $q) {
      //set up data we want to return for the .then function in controller
      var fakePOI = { lat: 37, long: -122, title: 'POI', description: 'Testing POI', type: 'bad'};
      $scope.currentPOI = fakePOI;
      $rootScope = _$rootScope_;

      //spy on methods that happen when savePOI is called
      spyOn($scope, 'closeForm');
      spyOn($scope, 'onSuccess');
      spyOn($scope, 'onError');
      //spy on POIS.savePOI service and call through the function
      spyOn(POIsMock, 'savePOI').and.callThrough();
      //call the method savePOI
      $scope.savePOI();
    }));

    describe('when savePOI is executed', function() {
      it('should call POI service method #savePOI', function() {
        //use fakePOI to call function
        var fakePOI = { lat: 37, long: -122, title: 'POI', description: 'Testing POI', type: 'bad'};
        
        // resolve the promise of the call of savePOI
        deferred.resolve($scope.currentPOI);
        $scope.$root.$digest();

        expect(POIsMock.savePOI).toHaveBeenCalledWith(fakePOI);
        expect(POIsMock.savePOI.calls.count()).toEqual(1);

      });
      it('if successful, should save the POI and reset currentPOI to default type: good', function() {
        
        deferred.resolve($scope.currentPOI);
        $scope.$root.$digest();
        //make assertions
        //poi saved should have the same type as fakePOI
        expect($scope.poiSaved.type).toBe('bad');
        //expect currentPOI to be empty except type: good
        expect($scope.currentPOI).toEqual({type: 'good' });
      });

      it('if successful, should close POI form and confirm success', function() {

        deferred.resolve($scope.currentPOI);
        $scope.$root.$digest();

        expect($scope.closeForm).toHaveBeenCalled();
        expect($scope.onSuccess).toHaveBeenCalled();
      });

      it('if successful, should relocate the page to home', function() {

        deferred.resolve($scope.currentPOI);
        $scope.$root.$digest();

        expect(location.path).toHaveBeenCalledWith('/menu/home');
      });

      it('if not successful, should show a popup', function() {
        //reject condition
        deferred.reject();
        $scope.$root.$digest();

        expect($scope.onError).toHaveBeenCalled();
      });
    });
  });

});
