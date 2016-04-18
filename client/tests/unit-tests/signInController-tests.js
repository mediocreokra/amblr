// // 4/12/16: This test is not yet functional.
// // See this tutorial to finish writing the tests: http://gonehybrid.com/how-to-write-automated-tests-for-your-ionic-app-part-2/

//TODO:::::::::: NO LONGER FUNCTIONAL
// describe('signinCtrl', function() {
//   //dependencies of signinctrl =
//     // $scope, $ionicModal, $http, $location
//   //create variables for dependencies, mock, and controller
//   var controller, 
//     scope,
//     signInDefer,
//     ionicModalMock,
//     httpMock,
//     locationMock,
//     ionicPopupMock,
//     $httpBackend;

//   // TODO: Load the App Module
//   beforeEach(module('amblr'));
//   beforeEach(angular.mock.module('amblr'));

//   //create a fake template for which ionicModal will load from
//   var fakeTemplate = function () {
//     return { 
//       then: function(modal) {
//           scope.modal = modal; 
//           }
//       }; 
//     };

//   //disable template caching
//   beforeEach(module(function($provide, $urlRouterProvider) {
//     $provide.value('$ionicTemplateCache', function() {
//       $urlRouterProvider.deferIntercept();
//     });
//   }));

//   // Instantiate the Controller and Mocks
//   beforeEach(inject(function($controller, $q, $rootScope, $http, $ionicModal) {
//     //use $q.defer to create own promise
//     var signInDefer = $q.defer();
//     spyPromise = signInDefer.promise;
//     scope = $rootScope.$new();
//     // $controller = _$controller_;
//     // $rootScope = _$rootScope_;
//     // scope = _$rootScope_.$new();

//     locationMock = { 'path': jasmine.createSpy('location spy').and.returnValue(signInDefer.promise)};
//     //mock ionicModal
//     // ionicModalMock = jasmine.createSpy('$ionicModal', ['fromTemplateUrl']);
//     // var successCallback = {
//     //    then: function(callback){
//     //        callback.apply(arguments);
//     //    }
//     // };
//     ionicModalMock = 
//     {
//       fromTemplateUrl: jasmine.createSpy('modal spy').and.returnValue(signInDefer.promise)
//     }; 

//     var modalMock = jasmine.createSpyObj('modal', ['show', 'hide']);
//     // ionicModalMock.fromTemplateUrl.and.returnValue(successCallback);
//     // ionicModalMock = jasmine.createSpyObj('modal', ['show', 'hide']);
//     ionicModalMock.fromTemplateUrl.and.callFake(function() {
//       return $q.when(modalMock);
//     });

//     //mockup of ionicPopuups
//     ionicPopupMock = jasmine.createSpyObj('popup', ['alert']);
//     // var $ionicModal = jasmine.createSpy('$ionicModal', ['fromTemplateUrl']);
//     // ionicModalMock = jasmine.createSpyObj('modal', ['show', 'hide']);
//     // $ionicModal.fromTemplateUrl.and.callFake(function() {
//     //   return $q.when(modalMock);
//     // });
//     var controller = $controller('signinCtrl', 
//       { $scope: scope, $location: locationMock, $ionicPopup: ionicPopupMock});
//   }));
//   //simple testing that we have the right $scope
//   describe('scope variable', function() {
//     it('should have a $scope variable', function() {
//       expect(scope).toBeDefined();
//       expect(scope.signinData).toBeDefined();
//       expect(scope.closeSignin).toBeDefined();
//     });
//   });

//   describe('#doSignin', function() {
//     beforeEach(inject(function(_$rootScope_, $injector, $http) {

//       var user = {username: 'trini', password: 'hello'};
//       var url = '/api/users/signin';
//       scope.signinData = user;
      
//       //use httpbackend mock
//       $httpBackend = $injector.get('$httpBackend');
//       $httpBackend.when('POST', url)
//         .respond(200, { username: user.username, password: user.password });
      
//       //ignore get requests of templates
//       $httpBackend.expect('GET', '../../templates/signin.html').respond(200);
//       $httpBackend.when('GET', /\.html$/).respond(200);

//       $rootScope = _$rootScope_;
//       scope.doSignin();

      
//     }));

//     afterEach(function() {
//       $httpBackend.verifyNoOutstandingExpectation();
//       $httpBackend.verifyNoOutstandingRequest();
//     });

//     it('should have a $scope.doSignin function', function() {
//       expect(scope.doSignin).toBeDefined();
//       expect(typeof scope.doSignin).toEqual('function');
//       $httpBackend.flush();
//     });

//     it('should have sent a POST request to api', function() {
//       url = '/api/users/signin';
      
//       $httpBackend.expectPOST(url, scope.signinData);
//       $httpBackend.flush();
//     });

//     describe('when the signin is executed,', function() {
//       it('if successful, should close modal and redirect to home page', function() {
        
//         //Any time you resolve or reject a promise you need  
//         // $scope.$digest next because promises are only resolved when
//         // Angular's digest cycle is triggered. (here $rootScope.$digest() called)
//         // signInDefer.resolve();
//         $httpBackend.whenPOST(url, scope.signinData).respond(200, { data: scope.signinData });
//         // $rootScope.$digest();
//         $httpBackend.flush();

//         spyOn(scope, 'closeSignin');
//         expect(scope.closeSignin).toHaveBeenCalled();
//         expect(locationMock.path).toHaveBeenCalledWith('/menu-private/home');
//       });
      
//       it('if unsuccessful, should show a popup', function() {
        
//         // signInDefer.reject();
//         $httpBackend.whenPOST(url, scope.signinData).respond('500', scope.signinData);
//         $rootScope.$digest();
        
//         expect(ionicPopupMock.alert).toHaveBeenCalled();
//         expect(scope.signin).toHaveBeenCalled();
//         $httpBackend.flush();
//       });
//     });
//   });

//     //should close the modal


//   //   //should redirect user to home
//   // });
//   describe('modal tests', function() {

//     beforeEach(function() {
//       scope.signin();
//       ionicModalMock.fromTemplateUrl(fakeTemplate);
//       spyOn(scope.modal, 'show');
//       spyOn(scope.modal, 'hide');

//       //create a user
//       var user = {
//         username: 'trini',
//         password: 'hello'
//       };
//       scope.signinData = user;
//     });


//     // it('should open signin modal', function() 
//     // { 
//     //   expect(scope.signin).toHaveBeenCalled();
//     //   scope.$digest();
//     //   expect(modalMock.show).toHaveBeenCalled();
//     //   expect(ionicModalMock.fromTemplateUrl).toHaveBeenCalled(); // OK
//     //   expect(scope.modal.show().toHaveBeenCalled()); // NOT PASS
//     // });

//   //   it('should close login modal', function() 
//   //   {
//   //       scope.digest();
//   //       scope.closeSignin;     
//   //       expect($scope.modal_login.hide()).toHaveBeenCalled(); // NOT PASS
//   //   });
//   });


// });
