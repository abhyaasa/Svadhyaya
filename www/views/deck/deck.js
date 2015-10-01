'use strict';

angular.module('app')

.controller('DeckController', function ($stateParams, $rootScope, $scope, $state, $log,
    getData, config, _) {
    var fullName = $stateParams.fullName;
    var displayName = $stateParams.displayName;
    $log.debug('DeckController', JSON.stringify($stateParams), fullName);
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
            var questions = promise.data;
            $rootScope.deck = {
                fullName: fullName,
                displayName: displayName,
                questions: questions,
                right: [],
                wrong: [],
                close: [],
                hints: 0,
                skipped: [],
                remaining: filter(questions),
                filter_settings: filter_settings
            };
            $log.debug('deck questions', JSON.stringify(questions));
        });
    }
})

.controller('DeckHelpController', function ($scope, $rootScope) {});
