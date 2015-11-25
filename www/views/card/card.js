'use strict';

angular.module('app')

.controller('CardController', function ($scope, $log, _, Deck, Card, $ionicGesture) {

    $scope.done = false;
    $scope.Deck = Deck;
    $scope.$on('$ionicView.beforeEnter', function() {
        Card.setup(0);
    });

    var finish = function () {
        if ($scope.done) {
            $scope.done = false;
            if (Deck.card.type === 'mind') {
                Deck.outcome('right');
            }
        } else {
            Deck.outcome('skipped');
        }
    };
    var next = function () {
        finish();
        Deck.nextCard();
    };
    var previous = function () {
        finish();
        Deck.previousCard();
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
    $ionicGesture.on('swiperight', previous, element);
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
                card.numWrong += 1;
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
                Deck.card.numWrong += 1;
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

.service('Card', function ($log, $state, Deck, _) {
    var Card = this;

    var makeItem = function (response) {
        return { text: response[1], style: 'no-response' };
    };
    this.setup = function (activeCardIndex) {
        Deck.data.activeCardIndex = activeCardIndex;
        Card.question = Deck.questions[Deck.data.active[activeCardIndex]];
        if (Card.question.type === 'multiple-choice') {
            Card.isMA = _.contains(Card.question.tags, '.ma');
            Card.responseItems = _.map(Card.question.responses, makeItem);
            Card.numWrong = 0;
        }
    };

    this.outcome = function (outcome) {
        Deck.data.outcomes[Deck.data.activeCardIndex] = outcome;
        Deck.data.history[Card.question.id].push(outcome);
    };

    this.nextCard = function () {
        if (Deck.data.activeCardIndex === Deck.data.active.length - 1) {
            Card.setup(0);
            $state.go('tabs.deck');
        } else {
            Card.setup(Deck.data.activeCardIndex + 1);
            $state.go('tabs.card');
        }
    };

    this.previousCard = function () {
        if (Deck.data.activeCardIndex === 0) {
            Card.setup(Deck.data.active.length - 1);
            $state.go('tabs.deck');
        } else {
            Card.setup(Deck.data.activeCardIndex - 1);
            $state.go('tabs.card');
        }
    };
})
;
