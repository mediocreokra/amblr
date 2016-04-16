// 4/12/16: This test is not yet functional.
// See this tutorial to finish writing the tests: http://gonehybrid.com/how-to-write-automated-tests-for-your-ionic-app-part-2/

describe('signinCtrl', function() {
  //dependencies of signinctrl =
    // $scope, $ionicModal, $http, $location
  //create variables for dependencies, mock, and controller
  var controller, 
    scope,
    signInDefer,
    ionicModalMock,
    httpMock,
    locationMock,
    ionicPopupMock,
    $httpBackend;

  // TODO: Load the App Module
  beforeEach(module('amblr'));
  beforeEach(angular.mock.module('amblr'));

  //create a fake template for which ionicModal will load from
  var fakeTemplate = function () {
    return { 
      then: function(modal) {
          scope.modal = modal; 
          }
      }; 
    };

  //disable template caching
  beforeEach(module(function($provide, $urlRouterProvider) {
    $provide.value('$ionicTemplateCache', function() {
      $urlRouterProvider.deferIntercept();
    });
  }));

  // Instantiate the Controller and Mocks
  beforeEach(inject(function($controller, $q, $rootScope, $http, $ionicModal) {
    //use $q.defer to create own promise
    var signInDefer = $q.defer();
    spyPromise = signInDefer.promise;
    scope = $rootScope.$new();
    // $controller = _$controller_;
    // $rootScope = _$rootScope_;
    // scope = _$rootScope_.$new();

    locationMock = { 'path': jasmine.createSpy('location spy').and.returnValue(signInDefer.promise)};
    //mock ionicModal
    // ionicModalMock = jasmine.createSpy('$ionicModal', ['fromTemplateUrl']);
    // var successCallback = {
    //    then: function(callback){
    //        callback.apply(arguments);
    //    }
    // };
    ionicModalMock = 
    {
      fromTemplateUrl: jasmine.createSpy('modal spy').and.returnValue(signInDefer.promise)
    }; 

    var modalMock = jasmine.createSpyObj('modal', ['show', 'hide']);
    // ionicModalMock.fromTemplateUrl.and.returnValue(successCallback);
    // ionicModalMock = jasmine.createSpyObj('modal', ['show', 'hide']);
    ionicModalMock.fromTemplateUrl.and.callFake(function() {
      return $q.when(modalMock);
    });

    ionicPopupMock = jasmine.createSpyObj('popup', ['alert']);
    // var $ionicModal = jasmine.createSpy('$ionicModal', ['fromTemplateUrl']);
    // ionicModalMock = jasmine.createSpyObj('modal', ['show', 'hide']);
    // $ionicModal.fromTemplateUrl.and.callFake(function() {
    //   return $q.when(modalMock);
    // });
    var controller = $controller('signinCtrl', 
      { $scope: scope, $location: locationMock, $ionicPopup: ionicPopupMock});
  }));

  describe('scope variable', function() {
    it('should have a $scope variable', function() {
      expect(scope).toBeDefined();
      expect(scope.signinData).toBeDefined();
      expect(scope.closeSignin).toBeDefined();
    });
  });

  describe('#doSignin', function() {
    beforeEach(inject(function(_$rootScope_, $injector) {
      var user = {username: 'trini', password: 'hello'};
      var url = '/api/users/signin';
      
      //use httpbackend mock
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('POST', url)
        .respond(200, { username: user.username, password: user.password });
      
      //ignore get requests of templates
      $httpBackend.expect('GET', '../../templates/signin.html').respond(200);
      $httpBackend.when('GET', /\.html$/).respond(200);

      $rootScope = _$rootScope_;
      scope.signinData = { username: 'trini', password: 'hello'};
      scope.doSignin();
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have a $scope.doSignin function', function() {
      expect(scope.doSignin).toBeDefined();
      expect(typeof scope.doSignin).toEqual('function');
      $httpBackend.flush();
    });

    it('should have sent a POST request to api', function() {
      url = '/api/users/signin';
      $httpBackend.expectPOST(url);
      $httpBackend.flush();
    });

    describe('when the signin is executed,', function() {
      it('if successful, should close modal and redirect to home page', function() {
        
        signInDefer.resolve();
        $rootScope.$digest();
        
        expect(scope.closeSignin).toHaveBeenCalledWith();
        expect(locationMock.path).toHaveBeenCalledWith('/menu-private/home');
      });
      
      it('if unsuccessful, should show a popup', function() {
        
        signInDefer.reject();
        $rootScope.$digest();
        
        expect(ionicPopupMock.alert).toHaveBeenCalled();
        expect(scope.signin).toHaveBeenCalled();
      });
    });
  });

    //should close the modal


  //   //should redirect user to home
  // });
  describe('modal tests', function() {

    beforeEach(function() {
      scope.signin();
      ionicModalMock.fromTemplateUrl(fakeTemplate);
      spyOn(scope.modal, 'show');
      spyOn(scope.modal, 'hide');

      //create a user
      var user = {
        username: 'trini',
        password: 'hello'
      };
      scope.signinData = user;
    });


    // it('should open signin modal', function() 
    // { 
    //   expect(scope.signin).toHaveBeenCalled();
    //   scope.$digest();
    //   expect(modalMock.show).toHaveBeenCalled();
    //   expect(ionicModalMock.fromTemplateUrl).toHaveBeenCalled(); // OK
    //   expect(scope.modal.show().toHaveBeenCalled()); // NOT PASS
    // });

  //   it('should close login modal', function() 
  //   {
  //       scope.digest();
  //       scope.closeSignin;     
  //       expect($scope.modal_login.hide()).toHaveBeenCalled(); // NOT PASS
  //   });
  });

  // describe('#doSignin', function() {

  //   // TODO: Call doSignin on the Controller
  //     beforeEach(function() {
  //       scope.doSignin();
  //       var user = {
  //         username: 'trini',
  //         password: 'hello'
  //       };
  //       scope.signinData = user;
  //       console.log(scope.signinData);
  //     });
  //   it('should call POST on http', function() {
  //     expect(httpMock).toHaveBeenCalledWith({
  //       method: 'POST',
  //       url: '/api/users/signin',
  //       data: scope.signinData
  //       }); 
  //   });

    // describe('when signin is executed,', function() {
    //   it('if successful, should change state to my-dinners', function() {

    //     // TODO: Mock the login response from DinnerService

    //     expect(stateMock.go).toHaveBeenCalledWith('my-dinners');
    //   });

    //   it('if unsuccessful, should show a popup', function() {

    //     // TODO: Mock the login response from DinnerService

    //     expect(ionicPopupMock.alert).toHaveBeenCalled();
    //   });
    // });
  // });

  // describe('#closeSignin', function() {
  //   //TODO: modal closes

  // });










});
