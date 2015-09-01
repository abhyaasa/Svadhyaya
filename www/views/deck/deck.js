'use strict';

angular.module('app')

.controller('DeckController', function ($scope, $stateParams, $log) {
    $log.debug('DeckController');
    var id = $stateParams.deckId;
});
