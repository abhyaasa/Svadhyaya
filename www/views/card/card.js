'use strict';

angular.module('app')

.controller('CardController', function ($rootScope, $scope, debug, _, nextCard) {
    var responses;
    debug('in CardController');
    // $scope.multipleChoice = function () {
    //     responses = $rootScope.card.responses;
    //     this.style = _.map(_.constant(undefined), _.range(responses.length));
    // };
    $scope.response = function (item) {
        nextCard(); // XXX
        return;
        if (responses[item.index][0]) {
            this.style[item.index] = 'right-response';
        } else {
            this.style[item.index] = 'wrong-response';
            // TODO this.style[??] = 'right-response';
        }
    };
    debug('Card');
})

.controller('CardHelpController', function () {})

.service('nextCard', function (debug, $rootScope, $state) {
    return function () {
        var remaining = $rootScope.deck.remaining;
        if (remaining.length === 0) { $state.go('tabs.deck'); }
        $rootScope.card = $rootScope.questions[remaining.shift()];
        debug('nextCard', JSON.stringify($rootScope.card));
        $state.go('tabs.card');
    };
});
