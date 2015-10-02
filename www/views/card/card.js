'use strict';

angular.module('app')

.controller('CardController', function ($rootScope, $scope, $log) {
    var deck = $rootScope.deck;
    this.next = function () {
        $scope.card = deck.remaining.shift();
    };
    $scope.haveCard = !!deck;
    $log.debug('Card', deck, $scope.haveCard);
    if (haveCard) {
        this.next();
    }
})

.controller('CardHelpController', function ($scope, $rootScope) {});
