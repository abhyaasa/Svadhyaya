'use strict';

angular.module('app')

.controller('AboutController', function ($scope, $rootScope) {
    $scope.version = $rootScope.version;
});
