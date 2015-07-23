'use strict';

angular.module('utils', ['ionic'])

// based on http://learn.ionicframework.com/formulas/localstorage/
.service('localStorage', ['$window', function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    };
}])

.constant('_', window._) // underscore.js access

.service('getData', function ($http) {
    var appPath = '/data/';
    if (ionic.Platform.isAndroid()) {
        appPath = '/android_asset/www' + appPath;
    }
    return function (path) { // path relative to app www/data
        return $http.get(appPath + path);
    };
});
