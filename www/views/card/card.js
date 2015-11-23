'use strict';

angular.module('app')

.controller('CardController', function ($scope, $log, _, Deck, $ionicGesture) {

    $scope.done = false;
    $scope.Deck = Deck;

    var next = function () {
        if ($scope.done) {
            $scope.done = false;
            if (Deck.card.type === 'mind') {
                Deck.outcome('right');
            }
        } else {
            Deck.outcome('skipped');
        }
        Deck.next();
    };
    var showAnswer = function () {
        if (Deck.card.type === 'mind') {
            $scope.done = true;
            $scope.$apply();
        }
    };
    var wrong = function () {
        if (Deck.card.type === 'mind') {
            $scope.done = true;
            Deck.outcome('wrong');
        }
        Deck.next();
    };
    var element = angular.element(document.querySelector('#content'));
    $ionicGesture.on('swipeleft', next, element);
    $ionicGesture.on('swipedown', wrong, element);
    $ionicGesture.on('tap', showAnswer, element);

    var isRight = function (response) {
        return response[0];
    };

    $scope.response = function (index) {
        var card = Deck.card;
        var items = card.responseItems;
        if (_.contains(card.tags, '.ma')) {
            $log.debug('multiple answer', index, JSON.stringify(card.responses));
            if (card.responses[index][0]) {
                items[index].style = 'right-response';
            } else {
                items[index].style = 'wrong-response';
                card.numWrong++;
            }
        } else {
            var rightIndex = _.findIndex(card.responses, isRight);
            items[rightIndex].style = 'right-response';
            if (index !== rightIndex) {
                items[index].style = 'wrong-response';
                Deck.outcome('wrong');
            } else {
                Deck.outcome('right');
            }
            $scope.done = true;
        }
        $log.debug('response items', JSON.stringify(items));
    };

    $scope.maDone = function () {
        var items = Deck.card.responseItems;
        var responses = Deck.card.responses;
        for (var i = 0; i < items.length; i++) {
            if (items[i].style === 'no-response' && responses[i][0]) {
                items[i].style = 'missed-response';
                Deck.card.numWrong++;
            }
        }
        if (Deck.card.numWrong > items.length / 5) {
            Deck.outcome('close');
        } else if (Deck.card.numWrong > 0) {
            Deck.outcome('wrong');
        } else {
            Deck.outcome('right');
        }
        $scope.done = true;
        $log.debug('Done items', JSON.stringify(items));
        // TODO score and nextcard
    };
})

.controller('CardHelpController', function () {})
;
