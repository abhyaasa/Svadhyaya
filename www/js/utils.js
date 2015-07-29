'use strict';

angular.module('utils', ['ionic'])

// based on http://learn.ionicframework.com/formulas/localstorage/
.service('localStorage', ['$window', function ($window) {
    this.set = function (key, value) {
        $window.localStorage[key] = value;
    };
    this.get = function (key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
    };
    this.setObject = function (key, value) {
        $window.localStorage[key] = JSON.stringify(value);
    };
    this.getObject = function (key) {
        return JSON.parse($window.localStorage[key] || '{}');
    };
}])

.constant('_', window._) // underscore.js access

.service('getData', function ($http) {
    return function (path) { // path is relative to app www/data/
        // returns promise
        return $http.get('/data/' + path);
    };
});
