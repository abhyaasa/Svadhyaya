'use strict';

angular.module('ionic.utils', ['ionic'])

/* from http://learn.ionicframework.com/formulas/localstorage/
Usage example:
angular.module('app', ['ionic', 'ionic.utils'])
.run(function($localstorage) {
  $localstorage.set('name', 'Max');
  console.log($localstorage.get('name'));
  $localstorage.setObject('post', {
    name: 'Thoughts',
    text: 'Today was a good day'
  });
  var post = $localstorage.getObject('post');
  console.log(post);
});
*/
.factory('$localstorage', ['$window', function ($window) {
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
    }
}])

.controller('loadController', function ($scope, $http) {
    // from http://forum.ionicframework.com/t/reading-json-file-from-local-for-android-ios/10648
    var app_url = "";
    if (ionic.Platform.isAndroid()) {
        app_url = "/android_asset/www/";
    }
    $http.get(app_url + 'data/file.json')
        .success(function (data) {
            // The json data will now be in scope.
            $scope.myJsonData = data;
        });
});
