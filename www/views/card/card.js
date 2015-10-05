'use strict';

angular.module('app')

.controller('CardController', function ($rootScope, debug) {
    debug('Card');
})

.controller('CardHelpController', function ($scope, $rootScope) {})

.service('nextCard', function (debug, $rootScope, $state) {
    return function () {
        var remaining = $rootScope.deck.remaining;
        if (remaining.length === 0) { $state.go('tabs.deck'); }
        $rootScope.card = $rootScope.questions[remaining.shift()];
        debug('nextCard', JSON.stringify($rootScope.card));
    };
});
