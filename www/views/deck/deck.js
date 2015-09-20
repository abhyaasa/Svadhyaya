'use strict';

angular.module('app')

.controller('DeckController', function ($stateParams, $rootScope, $scope, $log,
  getData, config) {
    var id = $stateParams.deckId;
    if (!id) {
        $log.debug('deck no id');
        return;
    }
    $rootScope.deckEnabled = true;
    getData(config.flavor + '/library/' + id).then(function (promise) {
        var questions = promise.data;
        $scope.deck = {
            right: 0,
            wrong: 0,
            close: 0,
            hints: 0,
            skipped: 0,
            remaining: questions.length,
            filter: {
                max: 50,
                min: 50,
                required: [],
                exclude: [],
                include: []
            }
        };
        $log.debug('deck questions', JSON.stringify(questions));
    });
});
