'use strict';

angular.module('app')

.controller('LibraryController', function ($rootScope, $scope, $state, configPromise,
  $log, mode, getData, Deck, Card, _) {
    // PUBLISH remove all $log.debug calls
    $log.debug('LibraryController', JSON.stringify(configPromise.data));
    var indexFile = 'flavors/' + configPromise.data.flavor + '/library/index.json';
    var allDeckNames;

    $scope.selectDeck = function(deckName) {
        Deck.setup(deckName);
    };

    Deck.Card = Card;

    getData(indexFile).then(function (promise) {
        var fileNames = promise.data;
        $log.debug('fileNames', fileNames);
        allDeckNames = _.map(fileNames, function (name) {
            return {
                full: name,
                // discard suffix and replace _ characters with spaces
                display: name.match(/.*(?=\.)/)[0].replace(/_/g, ' ')
            };
        });
        $scope.deckList = allDeckNames; // TODO filtering here
        if ($scope.deckList.length === 1 && mode !== 'debug') {
            $rootScope.config.hideLibrary = true;
            $rootScope.hideTabs = false;
            Deck.setup($scope.deckList[0]);
        } else {
            $rootScope.hideTabs = false;
        }
        // TODO implement search, Ionic in action 6.3, p 140
        // try AngularJS cookbook p 64 http://jsfiddle.net/msfrisbie/ghsa3nym/
        angular.extend($scope, {
            model: {searchText: ''}, // used in itest
            search: function () {
                $scope.deckList = _.filter(allDeckNames, function(deckName) {
                    var name = deckName.display.toLowerCase;
                    return name.indexOf($scope.model.searchText.toLowerCase) !== -1;
                });
            },
            clearSearch: function () {
                $scope.deckList = allDeckNames;
                $scope.model.searchText = '';
            }
        });
        // TODO implement deck button handler using state navigation, as in
        // http://learn.ionicframework.com/formulas/navigation-and-routing-part-2/
        // or Ionic book 5.2
    });
})

.controller('LibraryHelpController', function () {})
;
