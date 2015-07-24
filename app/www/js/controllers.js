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
  })
  .controller('DashCtrl', function() {
  })