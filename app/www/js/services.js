angular.module('starter')

  .service('AuthService', function($q, $http, USER_ROLES) {

    //init
    var LOCAL_TOKEN_KEY = 'yourTokenKey';
    var username = '';
    var isAuthenticated = false;
    var role = '';
    var authToken;

    //private
    function storeCredentials(token) {
      // when using  rememberMe option
      // rememberMe = true,  use localStorage
      // rememberMe = false , use sessionStorage

      window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
      useCredentials(token);
    }

    // public
    var login = function(name, pw) {
      return $q(function(resolve, reject) {
        if ((name === 'admin' && pw === '1')
            || (name === 'user' && pw === '1')) {
          // make request to server and receive auth token
          storeCredentials(name + '.yourServerToken');
          resolve('Login success.')
        } else {
          reject('Login Failed.');
        }
      })
    }

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