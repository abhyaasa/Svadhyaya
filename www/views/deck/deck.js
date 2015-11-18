'use strict';

angular.module('app')

.controller('DeckController', function ($scope, Deck) {
    $scope.deck = Deck;
})

.controller('DeckHelpController', function () {})

.service('Deck', function ($log, config, getData, Card, _) {
    var initialSettings = {
        right: [],
        wrong: [],
        close: [],
        hints: 0,
        skipped: [],
        filter: {
            max: 50,
            min: 50,
            required: [],
            exclude: [],
            include: []
        }
    };
    var deckFilter = function (questions) {
        // TODO use filter settings
        return _.range(0, questions.length);
    };
    this.setup = function (deckNames) {
        $log.debug('Deck setup', JSON.stringify(deckNames));
        getData('flavors/' + config.flavor + '/library/' + deckNames.fullName)
        .then(function (promise) {
            this.questions = promise.data;
            this.fullName = deckNames.fullName;
            this.displayName = deckNames.displayName;
            this.remaining = deckFilter(this.questions);
            _.extend(this, initialSettings);
            Card.next();
        });
    };
});
