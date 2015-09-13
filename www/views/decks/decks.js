'use strict';

angular.module('app')

.controller('DecksController', function ($rootScope, $scope, $log, getData, _) {
    $log.debug('in DecksController'); // PUBLISH remove all $log.debug calls
    var indexFile = $rootScope.config.flavor + '/decks/index.json';
    getData(indexFile).then(function (promise) {
        var fileNames = promise.data;
        $scope.allDeckNames = _.map(fileNames, function (name) {
            return {
                fullName: name,
                // discard suffix and replace _ characters with spaces
                displayName: name.match(/.*(?=\.)/)[0].replace(/_/g, ' ')
            };
        });
        $scope.deckNames = $scope.allDeckNames;

        // TODO implement search, Ionic in action 6.3, p 140
        // try AngularJS cookbook p 64 http://jsfiddle.net/msfrisbie/ghsa3nym/
        angular.extend($scope, {
            model: {searchText: ''}, // used in itest
            search: function () {
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
});
