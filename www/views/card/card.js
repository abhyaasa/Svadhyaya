'use strict';

angular.module('app')

.controller('CardController', function ($rootScope, $scope, $log, _, nextCard,
  $ionicGesture) {
    $log.debug('CardController');
    var element = angular.element(document.querySelector('#content'));
    $ionicGesture.on('swipeleft', nextCard, element);

    var isRight = function (response) {
        return response[0];
    };

    $scope.response = function (index) {
        var card = $rootScope.card;
        var items = card.responseItems;
        if (_.contains(card.tags, '.ma')) {
            $log.debug('multiple answer');
            if (card.responses[index][0]) {
                items[index].style = 'right-response';
            } else {
                items[index].style = 'wrong-response';
            }
        } else {
            var rightIndex = _.findIndex(card.responses, isRight);
            items[rightIndex].style = 'right-response';
            if (index !== rightIndex) {
                items[index].style = 'wrong-response';
            }
            // TODO score
        }
        $log.debug('response items', JSON.stringify(items));
    };

    $scope.maDone = function () {
        // TODO score and nextcard
    };
})

.controller('CardHelpController', function () {})

.service('nextCard', function ($log, $rootScope, $state, _) {
    var makeItem = function (response) {
        return { text: response[1], style: 'no-response' };
    };
    return function () {
        var remaining = $rootScope.deck.remaining;
        if (remaining.length === 0) { $state.go('tabs.deck'); }
        var card = $rootScope.questions[remaining.shift()];
        if (card.type === 'multiple-choice') {
            card.responseItems = _.map(card.responses, makeItem);
            card.isMA = _.contains(card.tags, '.ma');
        }
        $rootScope.card = card;
        $log.debug('nextCard', JSON.stringify($rootScope.card));
        $state.go('tabs.card');
    };
});
