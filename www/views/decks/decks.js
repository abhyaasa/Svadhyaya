'use strict';

angular.module('app')

.controller('DecksSearchController', function ($scope, $http) {
    $scope.model = {searchText: ''};
    $scope.search = function () {
        // TODO implement search, Ionic in action p 140
        // $scope.deckNames = <some search result from $scope.allDeckNames>;
    };
})

.controller('DecksController', function ($scope, getData, _) {
    getData('deck_files.json').success(function (fileNames) {
        $scope.allDeckNames = _.map(fileNames, function (name) {
            return { // android does not display
                fullName: name,
                root: name.match(/.*(?=\.)/)[0]
            };
        });
        $scope.deckNames = $scope.allDeckNames;
    });
    // TODO implement deck button handler
});
