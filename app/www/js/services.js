angular.module('starter')

  .service('AuthService', function($q, $http, USER_ROLES) {

    //init
    var LOCAL_TOKEN_KEY = 'yourTokenKey';
    var username = '';
    var isAuthenticated = false;
    var role = '';
    var authToken;



    return {
      login          : login,
      logout         : logout,
      username       : function() {
        return username;
      },
      isAuthenticated: function() {
        return isAuthenticated;
      },
      role           : function() {
        return role
      }
    }
  });