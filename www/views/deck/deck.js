'use strict';

angular.module('app')

.controller('DeckController', function ($stateParams, $rootScope, $scope, $state, debug,
    getData, config, _, nextCard) {
    var fullName = $stateParams.fullName;
    var displayName = $stateParams.displayName;
    debug('DeckController', JSON.stringify($stateParams), fullName);
    var filter_settings = {
        max: 50,
        min: 50,
        required: [],
        exclude: [],
        include: []
    };
    var filter = function (questions) {
        // TODO use filter settings
        return _.range(0, questions.length);
    };
    $scope.haveDeck = !!fullName;
    if ($scope.haveDeck) {
        getData('flavors/' + config.flavor + '/library/' + fullName)
        .then(function (promise) {
            $rootScope.questions = promise.data;
            $rootScope.deck = {
                fullName: fullName,
                displayName: displayName,
                right: [],
                wrong: [],
                close: [],
                hints: 0,
                skipped: [],
                remaining: filter($rootScope.questions),
                filter_settings: filter_settings
            };
            debug('deck questions', JSON.stringify($rootScope.questions));
            nextCard();
        });
    }
})

.controller('DeckHelpController', function ($scope, $rootScope) {});
