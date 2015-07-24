'use strict';

angular.module('app')

.controller('DecksController', function ($scope, getData) {
    $scope.decks = JSON.parse(getData('deck_names.json'));
    // TODO implement search
    // TODO implement deck button handler
});
