'use strict';

angular.module('app')

.controller('LibraryController', function ($rootScope, $scope, $state, $log, _, mode,
  Library, Deck, indexPromise) {
    $scope.selectClosedDeck = function(deckName) {
        Deck.setup(deckName);
    };

    $scope.selectOpenDeck = function (displayNanme) {
        
    };

    Library.provideIndex(indexPromise);
    $scope.deckList = Library.deckNames; // TODO filtering here

    if ($scope.deckList.length === 1 && mode !== 'debug') {
        $rootScope.config.hideLibrary = true;
        $rootScope.hideTabs = false;
        Deck.setup($scope.deckList[0]);
    } else {
        $rootScope.hideTabs = false;
    }
    // TODO implement search, Ionic in action 6.3, p 140
    // try AngularJS cookbook p 64 http://jsfiddle.net/msfrisbie/ghsa3nym/
    // angular.extend($scope, {
    //     model: {searchText: ''}, // used in itest
    //     search: function () {
    //         $scope.deckList = _.filter(allDeckNames, function(deckName) {
    //             var name = deckName.display.toLowerCase;
    //             return name.indexOf($scope.model.searchText.toLowerCase) !== -1;
    //         });
    //     },
    //     clearSearch: function () {
    //         $scope.deckList = allDeckNames;
    //         $scope.model.searchText = '';
    //     }
    // });
})

.controller('LibraryHelpController', function () {})
// FIXME open decks not displaying
.service('Library', function ($log, $state, getData, LocalStorage, _) {
    var Library = this;

    var openDecks = LocalStorage.getObject('*openDecks*');
    if (openDecks.length === undefined) {
        openDecks = [];
    }
    $log.debug('openDecks', openDecks);

    var fileDecks;
    this.provideIndex = function (indexPromise) {
        var indexNames = indexPromise.data;
        $log.debug('indexNames', indexNames);
        fileDecks =_.map(indexNames, function (name) {
            return {
                file: name,
                // discard suffix and replace _ characters with spaces
                display: name.match(/.*(?=\.)/)[0].replace(/_/g, ' '),
                open: false
            };
        });
        updateDeckNames();
    };

    var updateDeckNames = function () {
        var isOpen = function (fd) {
            return _.contains(openDecks, fd.display);
        };
        Library.deckNames = {
            open: openDecks.sort(),
            closed: _.reject(fileDecks, isOpen).sort()
        };
    };

    this.saveDeck = function (displayName, data) {
        if (!_.contains(openDecks, displayName)) {
            openDecks.push(displayName);
            LocalStorage.setObject('*openDecks*', openDecks);
        }
        LocalStorage.setObject(displayName, data);
    };

    this.resetDeck = function (deckName) {
        openDecks = _.without(openDecks, deckName.display);
        LocalStorage.setObject('*openDecks*', openDecks);
        LocalStorage.remove(deckName.display);
    };

    this.resetAllDecks = function () {
        _.forEach(openDecks, function (deckName) {
            LocalStorage.remove(deckName.display);
        });
        openDecks = [];
        LocalStorage.setObject('*openDecks*', openDecks);
    };
})
;
