// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving
// Angular modules 'starter' is the name of this angular module example (also
// set in a <body> attribute in index.html) the 2nd parameter is an array of
// 'requires'
angular.module('starter', ['ionic', 'ngMockE2E'])
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory
      // bar above the keyboard for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

  .config(function($stateProvider, $urlRouterProvider, USER_ROLES) {
    $stateProvider
      .state('login', {
        url        : '/login',
        templateUrl: 'templates/login.html',
        controller : 'LoginCtrl'
      })
      .state('main', {
        url        : '/',
        abstract   : true,
        templateUrl: 'templates/main.html'
      })
      .state('main.dash', {
        url  : 'main/dash',
        views: {
          'dash-tab': {
            templateUrl: 'templates/dashboard.html',
            controller : 'DashCtrl'
          }
        }
      })
      .state('main.public', {
        url  : 'main/public',
        views: {
          'public-tab': {
            templateUrl: 'templates/public.html'
          }
        }
      })
      .state('main.admin', {
        url  : 'main/admin',
        views: {
          'admin-tab': {
            templateUrl: 'templates/admin.html'
          }
        },
        data : {
          authorizedRoles: [USER_ROLES.admin]
        }
      });
    $urlRouterProvider.otherwise('/main/dash');
  })

  .run(function($httpBackend) {
    $httpBackend.whenGET('http://localhost:8100/valid')
      .respond({message: 'This is my valid response!'});
    $httpBackend.whenGET('http://localhost:8100/notauthenticated')
      .respond(401, {message: "Not Authenticated"});
    $httpBackend.whenGET('http://localhost:8100/notauthorized')
      .respond(403, {message: "Not Authorized"});
    $httpBackend.whenGET(/templates\/\w+.*/).passThrough();
  })

  // check each url state for authorization
  .run(function($rootScope, $state, AuthService, AUTH_EVENTS) {
    // state event
    $rootScope.$on('$stateChangeStart',
      function(event, next, nextParams, fromState) {
        //if authorizedRoles has info
        if ('data' in next && 'authorizedRoles' in next.data) {
          var authorizedRoles = next.data.authorizedRoles;
          // if not authorized
          if (!AuthService.isAuthorized(authorizedRoles)) {
            event.preventDefault();
            // >>>> go back to previous state
            $state.go($state.current, {}, {reload: true});
            // broadcast triggers popup message
            $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
          }
        }
        // if not logged in
        if (!AuthService.isAuthenticated()) {
          // >>>> goto login form
          if (next.name !== 'login') {
            event.preventDefault();
            $state.go('login');
          }
        }
      });
  });