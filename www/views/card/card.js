'use strict';

angular.module('app')

.controller('CardController', function ($scope, $log, _, Deck, Card, $ionicGesture) {

    $scope.done = false;
    $scope.Card = Card;
    $scope.Deck = Deck;
    $scope.$on('$ionicView.enter', function() {
        if (!Card.question) {
            Card.setup(0);
        }
    });

    $scope.hint = function () {
        Card.hint = Card.question.hints[Card.hintIndex];
        Card.hintIndex++;
        Card.haveHint = Card.hintIndex < Card.question.hints.length;
    };

    var finish = function () {
        if ($scope.done) {
            $scope.done = false;
            if (Card.question.type === 'mind') {
                Card.outcome('right');
            }
        } else {
            Card.outcome('skipped');
        }
    };
    var next = function () {
        finish();
        Card.nextCard();
    };
    var previous = function () {
        finish();
        Card.previousCard();
    };
    var showAnswer = function () {
        if (Card.question.type === 'mind') {
            $scope.done = true;
            $scope.$apply();
        }
    };
    var wrong = function () {
        if (Card.question.type === 'mind') {
            $scope.done = true;
            Card.outcome('wrong');
        }
        Card.next();
    };
    // #question element fetch works, but gestures with it don't
    var element = angular.element(document.querySelector('#content'));
    $ionicGesture.on('swipeleft', next, element);
    $ionicGesture.on('swiperight', previous, element);
    $ionicGesture.on('swipedown', wrong, element);
    $ionicGesture.on('tap', showAnswer, element);

    var isRight = function (response) {
        return response[0];
    };

    $scope.isText = function () {
        Card.outcome('text');
        $scope.done = true;
    };

    $scope.response = function (index) {
        var card = Card.question;
        var items = Card.responseItems;
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
                Card.outcome('wrong');
            } else {
                Card.outcome('right');
            }
            $scope.done = true;
        }
        $log.debug('response items', JSON.stringify(items));
    };

    $scope.maDone = function () {
        var items = Card.responseItems;
        var responses = Card.question.responses;
        for (var i = 0; i < items.length; i++) {
            if (items[i].style === 'no-response' && responses[i][0]) {
                items[i].style = 'missed-response';
                Card.numWrong += 1;
            }
        }
        if (Card.numWrong > items.length / 5) {
            Card.outcome('close');
        } else if (Card.numWrong > 0) {
            Card.outcome('wrong');
        } else {
            Card.outcome('right');
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
        Card.hintIndex = Card.question.hints ? 0 : undefined;
        if (Card.question.type === 'true-false') {
            Card.question.responses = [[false, 'True'], [false, 'False']];
            Card.question.responses[Card.question.answer ? 0 : 1][0] = true;
            Card.question.type = 'multiple-choice';
        }
        if (Card.question.type === 'multiple-choice') {
            Card.isMA = _.contains(Card.question.tags, '.ma');
            Card.responseItems = _.map(Card.question.responses, makeItem);
            Card.numWrong = 0;
        } else if (Card.question.type === 'mind' && !Card.question.answer) {
            // sequence question
            var answerIndex = Card.question.id + 1;
            if (answerIndex === Deck.questions.length) {
                $state.go('tab.deck'); // card is last in sequence at end of deck
            } else {
                Card.question.answer = Deck.questions[answerIndex].text;
            }
        }
        Card.haveHint = Card.question.hints !== undefined;
        Card.hint = null;
        $log.debug('Card.setup', JSON.stringify(Card));
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
