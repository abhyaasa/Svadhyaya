'use strict';

angular.module('app')

// return filename w/o suffic, e.g. 'foo.json' | stripSuffix ==> foo
.filter('stripSuffix', function () {
    return function (input) {
        return input.match(/.*(?=\.)/)[0];
    };
})

.controller('DecksController', function ($scope, getData) {
    getData('deck_files.json').success(function (data) {
        $scope.deckFiles = data;
    });
    // TODO implement search
    // TODO implement deck button handler
});
