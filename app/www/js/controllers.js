angular.module('starter')
  .controller('AppCtrl',
  function($state, $scope, $ionicPopup, AuthService, AUTH_EVENTS) {
    $scope.username = AuthService.username();

    // when rootScope broadcasts bad request, its picked up here
    $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
      var alertPopup = $ionicPopup.alert({
        title   : 'Unauthorized!',
        template: 'You are not allowed to access this resource.'
      })
    });
    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
      AuthService.logout();
      $state.go('login');
      var alertPopup = $ionicPopup.alert({
        title   : 'Session Lost!',
        template: 'Sorry, You have to login again.'
      })
    });
    $scope.setCurrentUsername = function(name) {
      $scope.username = name;
    }
  })
  .controller('LoginCtrl', function() {
    // form object
    $scope.data = {};

    $scope.login = function(data) {
      AuthService.login(data.username, data.password)
        .then(function(authenticated) {
          $state.go('main.dash', {}, {reload: true});
          $scope.setCurrentUsername(data.username);
        }, function(err) {
          var alertPopup = $ionicPopup.alert({
            title   : 'Login failed!',
            template: 'Please check your credentials!'
          });
        });
    };
  })
  .controller('DashCtrl', function() {
  })