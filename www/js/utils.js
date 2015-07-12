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
    };
}])

// TODO complete this
.service('getData', function ($http) {
    // from http://forum.ionicframework.com/t/\
    // reading-json-file-from-local-for-android-ios/10648
    // TODO test if this is needed
    var appPath = '';
    if (ionic.Platform.isAndroid()) {
        appPath = '/android_asset/www/';
    }

    this.text = function (path) { // path relative to app www/
        $http.get(appPath + path).success(function (data) {
            return data;
        });
    };

    this.json = function (path) { // path relative to app www/
        return JSON.parse(this.text(path));
    };
});