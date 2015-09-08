'use strict';

angular.module('app')

.controller('DeckController', function ($scope, $stateParams, $log) {
    $log.debug('in DeckController');
    var id = $stateParams.deckId;
});
