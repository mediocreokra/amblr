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
  beforeEach(inject(function($controller, $q, $rootScope, Location, POIs, $location, $http, $injector, $ionicModal) {
    deferred = $q.defer();
    spyPromise = deferred.promise;
    $scope = $rootScope.$new();

    //inject fake httpbackend to ignore template get requests
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', /\.html$/).respond(200);

    //set up mocks for services passed in
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

    //TODO: set up ionicModal mock
    //set up fake template
    var fakeTemplate = function () {
      return { 
        then: function(modal) {
          $scope.modal = modal; 
        }
      }; 
    };
    
    ionicModalMock = {
      fromTemplateUrl: jasmine.createSpy('$ionicModal.fromTemplateUrl').and.returnValue(deferred.promise)
    };

    modalMock = jasmine.createSpyObj('modal', ['show', 'hide', 'isShown']);
    ionicModalMock.fromTemplateUrl.and.callFake(fakeTemplate);


    //initialize the controller, passing spy service instance
    controller = $controller('addPOIController', {
      $scope: $scope,
      $location: location,
      POIs: POIsMock, //service mock
      Location: LocationMock, //service mock
      $ionicModal: ionicModalMock
    });
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('scope variable exists', function() {
    it('should have the correct scope', function() {

      $httpBackend.flush();

      expect($scope).toBeDefined();
      expect($scope.savePOI).toBeDefined();
      expect($scope.onError).toBeDefined();
      expect($scope.openForm).toBeDefined();
    });
  });

  describe('#savePOI', function() {
    beforeEach(inject(function(_$rootScope_, $injector, $q, $location) {
        //set up data we want to return for the .then function in controller
      var fakePOI = { lat: 37, long: -122, title: 'POI', description: 'Testing POI', type: 'bad'};
      $scope.currentPOI = fakePOI;
      $rootScope = _$rootScope_;
      //spy on methods that happen when savePOI is called
      spyOn($scope, 'closeForm');
      spyOn($scope, 'onSuccess');

      spyOn(POIsMock, 'savePOI').and.callThrough();
      //call the method savePOI
      $scope.savePOI();

      // deferred.resolve($scope.currentPOI);
      deferred.resolve($scope.currentPOI);
      $scope.$root.$digest();
      $httpBackend.flush();
    }));

    describe('when savePOI is executed', function() {
      it('should call POI service method #savePOI', function() {
        //spy on POIs mock service
        var fakePOI = { lat: 37, long: -122, title: 'POI', description: 'Testing POI', type: 'bad'};

        expect(POIsMock.savePOI).toHaveBeenCalledWith(fakePOI);
        expect(POIsMock.savePOI.calls.count()).toEqual(1);

      });
      it('if successful, should save the POI and reset currentPOI to default type: good', function() {
        //make assertions
        expect($scope.poiSaved.type).toBe('bad');
        //expect currentPOI to be empty except type: good
        expect($scope.currentPOI).toEqual({type: 'good' });
      });

      it('if sucessful, should close POI form', function() {

        // $ionicModal.fromTemplateURL(fakeTemplate);

        expect($scope.closeForm).toHaveBeenCalled();
        expect($scope.modal.close).toHaveBeenCalled();
      });

      it('if successful, should relocate the page to home', function() {
        
        expect(location.path).toHaveBeenCalledWith('/menu/home');
      });

      it('if not successful, should show a popup', function() {
        deferred.reject();
        $scope.$root.$digest();

        expect($scope.closeForm).toHaveBeenCalled();

      });
    });
  });

  describe('should ', function() {

  });


});
