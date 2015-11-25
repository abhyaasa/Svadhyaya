'use strict';

angular.module('app')

.controller('DeckController', function ($scope, Deck) {
    $scope.Deck = Deck;
    // TODO manage filter controls
})

.controller('DeckHelpController', function () {})

.service('Deck', function ($log, $state, config, getData, _) {
    var Deck = this;
    var initialFilterSettings = {
        max: 50,
        min: 50,
        required: [],
        exclude: [],
        include: []
    };
        // TODO use filter settings
        return _.range(0, questions.length);
    };
    Deck.setup = function (deckName) {
        $log.debug('Deck setup', JSON.stringify(deckName));
        getData('flavors/' + config.flavor + '/library/' + deckName.full)
        .then(function (promise) {
            Deck.questions = promise.data;
        });
    };

    this.next = function () {
            $state.go('tabs.deck');
        }
        Deck.cardIndex = Deck.remaining.shift();
        Deck.card = Deck.questions[Deck.cardIndex];
        if (Deck.card.type === 'multiple-choice') {
            Deck.card.isMA = _.contains(Deck.card.tags, '.ma');
            Deck.card.responseItems = _.map(Deck.card.responses, makeItem);
            Deck.card.numWrong = 0;
        }
        $log.debug('next', JSON.stringify(Deck.card));
        $state.go('tabs.card');
    };

    this.outcome = function (outcomeName) {
        if (!_.contains(['right', 'wrong', 'close', 'skipped'], outcomeName)) {
            $log.error('Bad outcome', outcomeName);
        }
        Deck[outcomeName].push(Deck.cardIndex);
    };
})
;
