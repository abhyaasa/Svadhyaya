'use strict';

angular.module('app')

.controller('DecksController', function ($scope, getData, _) {
    getData('deck_files.json').success(function (fileNames) {
        $scope.allDeckNames = _.map(fileNames, function (name) {
            return { // android does not display
                fullName: name,
                // discard suffix and replace _ characters with spaces
                displayName: name.match(/.*(?=\.)/)[0].replace(/_/g, ' ')
            };
        });
        $scope.deckNames = $scope.allDeckNames;
    });
    angular.extend($scope, {
        model: {searchText: ''},
        search: function () {
            // TODO try AngularJS cookbook p 64 http://jsfiddle.net/msfrisbie/ghsa3nym/
            // TODO implement search, Ionic in action 6.3, p 140
            $scope.deckNames = _.filter($scope.allDeckNames, function(deck) {
                var name = deck.displayName.toLowerCase;
                return name.indexOf($scope.model.searchText.toLowerCase) !== -1;
            });
        },
        clearSearch: function () {
            $scope.deckNames = $scope.allDeckNames;
            $scope.model.searchText = '';
        }
    });
    // TODO implement deck button handler using state navigation, as in
    // http://learn.ionicframework.com/formulas/navigation-and-routing-part-2/
    // or Ionic book 5.2
});
