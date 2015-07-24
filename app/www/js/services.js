angular.module('starter')

  .service('AuthService', function($q, $http, USER_ROLES) {

    //init
    var LOCAL_TOKEN_KEY = 'yourTokenKey';
    var username = '';
    var isAuthenticated = false;
    var authToken;
    var role = '';
    loadCredentials();

    //private
    function loadCredentials()  {
      var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
      if (token) {
        useCredentials(token);
      }
    }

    function storeCredentials(token) {
      // when using  rememberMe option
      // rememberMe = true,  use localStorage
      // rememberMe = false , use sessionStorage

      window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
      useCredentials(token);
    }

    function useCredentials(token) {
      username = token.split('.')[0];
      isAuthenticated = true;
      authToken = token;

      //set role
      if (username === 'admin') {
        role = USER_ROLES.admin;
      }
      if (username === 'user') {
        role = USER_ROLES.public
      }

      //add token to header of all requests
      $http.defaults.headers.common['X-Auth-Token'] = token;
    }

    function destroyCredentials() {
      username = '';
      isAuthenticated = true;
      authToken = undefined;
      role = '';
      $http.defaults.headers.common['X-Auth-Token'] = undefined;
      window.localStorage.removeItem(LOCAL_TOKEN_KEY);
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
    };

    var logout = function() {
      destroyCredentials();
    };

    var isAuthorized = function(authorizedRoles) {
     // make sure argument authorizedRoles is always an array
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      // true if
      // 1. user is logged in
      // 2. user role part of the authorizedRoles
      return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
    };

    return {
      login          : login,
      logout         : logout,
      isAuthorized   : isAuthorized,
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