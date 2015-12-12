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

    var finish = function () {
        if (!$scope.done) {
            Card.outcome('skipped');
        }
        $scope.done = false;
    };
    var next = function () {
        finish();
        Card.nextCard();
    };
    var previous = function () {
        finish();
        Card.previousCard();
    };
    var discard = function () {
        $scope.done = false;
        Card.outcome('discarded');
        Card.discardCard();
    };
    var element = angular.element(document.querySelector('#content'));
    $ionicGesture.on('swipeleft', next, element);
    $ionicGesture.on('swiperight', previous, element);
    $ionicGesture.on('swipeup', discard, element);

    $scope.hint = function () {
        // TODO add mc and auto mind hints using settings.hintPercent
        Card.hint = Card.question.hints[Card.hintIndex];
        Card.hintIndex++;
        Card.haveHint = Card.hintIndex < Card.question.hints.length;
    };

    $scope.setOutcome = function (outcome) {
        Card.outcome(outcome);
        $scope.done = false;
        Card.nextCard();
    };

    $scope.showAnswer = function () {
        if (Card.question.type === 'mind') {
            $scope.done = true;
        }
    };

    $scope.isText = function () {
        Card.outcome('text');
        $scope.done = true;
    };

    var isRight = function (response) {
            return response[0];
        };
    $scope.response = function (index) {
        var q = Card.question;
        var items = Card.responseItems;
        if (_.contains(q.tags, '.ma')) {
            $log.debug('multiple answer', index, JSON.stringify(q.responses));
            if (q.responses[index][0]) {
                items[index].style = 'right-response';
            } else {
                items[index].style = 'wrong-response';
                Card.numWrong += 1;
            }
        } else {
            var rightIndex = _.findIndex(q.responses, isRight);
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

    $scope.submitAnswer = function (submittedAnswer) {
        var answer = Card.question.answer;
        if (_.contains(Card.question.tags, '.ci')) {
            answer = answer.toUpperCase();
            submittedAnswer = submittedAnswer.toUpperCase();
        }
        if (answer === submittedAnswer) {
            Card.outcome('right');
        } else {
            Card.outcome('wrong');
        }
        $scope.done = true;
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
        // FIXME score and nextcard
    };
})

.controller('CardHelpController', function () {})

// http://creative-punch.net/2014/04/preserve-html-text-output-angularjs/
// FIXME May generate Error: [$sce:itype] Attempted to trust a non-string value in a
//   content requiring a string: Context: html
.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
})

.service('Card', function ($sce, $log, $state, Deck, settings, _) {
    var Card = this;

    var makeItem = function (response) {
        return { text: response[1], style: 'no-response' };
    };
    this.setup = function (activeCardIndex) {
        Deck.data.activeCardIndex = activeCardIndex;
        Card.question = Deck.questions[Deck.data.active[activeCardIndex]];
        Card.isMA = _.contains(Card.question.tags, '.ma');
        Card.answerClass = 'answer';
        Card.isInput = (_.contains(Card.question.tags, '.cs') ||
            _.contains(Card.question.tags, '.ci'));
        Card.text = Card.question.text;
        var responses = Card.question.responses;
        if (_.isArray(Card.text)) {
            Card.text = Card.text[settings.devanagari ? 1 : 0];
        }
        Card.hintIndex = Card.question.hints ? 0 : undefined;
        if (Card.question.type === 'true-false') {
            // Rewrite true-false as multiple-choice
            Card.question.responses = [[false, 'True'], [false, 'False']];
            Card.question.responses[Card.question.answer ? 0 : 1][0] = true;
            Card.question.type = 'multiple-choice';
        } else if (Card.question.type === 'mind' && !Card.question.answer) {
            // Sequence question
            var answerIndex = Card.question.id + 1;
            if (answerIndex === Deck.questions.length) {
                $state.go('tab.deck'); // card is last in sequence at end of deck
            } else {
                Card.question.answer = Deck.questions[answerIndex].text;
            }
        } else if (Card.question.type === 'matching') {
            // Rewrite matching as multiple-choice, including random order, this
            // question's answer with a random selection of other answers in this
            // random sequence.
            var q = Card.question;
            if (!q.matchingEnd) {
                $log.error('No matchingEnd attribute with type matching');
            }
            responses = [];
            for (var i = q.matchingBegin; i <= q.matchingEnd; i++) {
                if (i !== q.id) {
                    responses.push([false, Deck.questions[i].answer]);
                }
            }
            var numResponses = 5;
            responses = _.sample(responses, numResponses - 1).concat([[true, q.answer]]);
            Card.question.responses = responses;
            Card.question.type = 'multiple-choice';
        }
        if (Card.question.type === 'multiple-choice') {
            if (settings.randomResponses) {
                responses = _.sample(responses, responses.length);
            }
            Card.responseItems = _.map(responses, makeItem);
            Card.numWrong = 0;
        }
        Card.haveHint = Card.question.hints !== undefined;
        Card.hint = null;
        $log.debug('Card.setup', JSON.stringify(Card));
    };

    this.outcome = function (outcome) {
        if (outcome === 'wrong') {
            Card.answerClass = 'wrong-response';
        }
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
