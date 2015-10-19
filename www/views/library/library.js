'use strict';

angular.module('app')

.controller('LibraryController', function ($rootScope, $scope, $state, config,
  debug, getData, deckSetup, _) {
    debug('in LibraryController'); // PUBLISH remove all $log.debug and debug calls
    var indexFile = 'flavors/' + $rootScope.config.flavor + '/library/index.json';

    $scope.deckSetup = deckSetup;

    getData(indexFile).then(function (promise) {
        var fileNames = promise.data;
        debug('fileNames', fileNames);
        $scope.allDeckNames = _.map(fileNames, function (name) {
            return {
                fullName: name,
                // discard suffix and replace _ characters with spaces
                displayName: name.match(/.*(?=\.)/)[0].replace(/_/g, ' ')
            };
        });
        $scope.deckList = $scope.allDeckNames; // TODO filtering here
        if ($scope.deckList.length === 1) {
            $rootScope.config.hideLibrary = true;
            $rootScope.hideTabs = false;
            deckSetup($scope.deckList[0]);
        } else {
            $rootScope.hideTabs = false;
        }
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
})

.controller('LibraryHelpController', function ($scope, $rootScope) {});
