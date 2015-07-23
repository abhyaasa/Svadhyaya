'use strict';

angular.module('utils', ['ionic'])

<<<<<<< HEAD
// based on http://learn.ionicframework.com/formulas/localstorage/
.service('localStorage', ['$window', function ($window) {
=======
// from http://learn.ionicframework.com/formulas/localstorage/
.factory('localStorage', ['$window', function ($window) {
>>>>>>> settings
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

<<<<<<< HEAD
// based on http://forum.ionicframework.com/t/\
// reading-json-file-from-local-for-android-ios/10648
=======
.constant('_', window._) // underscore.js access

>>>>>>> settings
.service('getData', function ($http) {
    var appPath = '/data/';
    if (ionic.Platform.isAndroid()) {
        appPath = '/android_asset/www' + appPath;
    }
    return function (path) { // path relative to app www/data
        return $http.get(appPath + path);
    };
});
