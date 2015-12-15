'use strict';

angular.module('app')

.controller('DeckController', function ($scope, Deck) {
    $scope.Deck = Deck;

    $scope.getCount = function (key) {
        return key in Deck.count ? Deck.count[key] : 0;
    };
    // TODO manage filter controls
})

.controller('DeckHelpController', function () {})

.service('Deck', function ($log, $state, $rootScope, settings, getData, _) {
    var Deck = this;
    this.count = undefined; // maintained by this.setCount()

    var initialFilterSettings = {
        max: 50,
        min: 50,
        required: [],
        exclude: [],
        include: []
    };
    var copy = function (obj) {
        return _.mapObject(obj, function (val) { return _.clone(val); });
    };
    var filter = function (questions) {
        // returns list of indices of questions that pass filter
        // TODO use filter settings
        var indices = _.range(0, questions.length);
        if (settings.randomQuestions) {
            indices = _.sample(indices, indices.length);
        }
        return indices;
    };

    this.setup = function (deckName) {
        $log.debug('Deck setup', JSON.stringify(deckName));
        getData('flavors/' + $rootScope.config.flavor + '/library/' + deckName.full)
        .then(function (promise) {
            Deck.questions = promise.data;
            Deck.data = {
                name: deckName,
                history: _.map(Deck.questions, function () { return []; }),
                filter: copy(initialFilterSettings),
                active: filter(Deck.questions), // indices of active quesitons
                activeCardIndex: undefined, // current card ref. into active index list
                done: false
            };
            Deck.data.outcomes = new Array(Deck.data.active.length);
            $state.go('tabs.card');
        });
    };

    this.restart = function (restoreRemoved) {
        if (restoreRemoved) {
            Deck.data.outcomes = new Array(Deck.data.active.length);
        } else {
            Deck.data.outcomes = _.map(Deck.data.outcomes, function (outcome) {
                return outcome === 'removed' ? 'removed' : undefined;
            });
        }
        Deck.data.activeCardIndex = 0;
        Deck.data.done = false;
        $state.go('tabs.card');
    };

    var multiset = function (array) {
        var ms = {remaining: 0};
        array.map(function (value) {
            if (_.has(ms, value)) {
                ms[value] += 1;
            } else {
                ms[value] = 1;
            }
        });
        return ms;
    };
    var isUndefined = function(value) {
        return value === undefined;
    };
    this.enterTab = function () {
        // TODO deck restart
        if (Deck.data) {
            Deck.count = multiset(Deck.data.outcomes);
            Deck.count.remaining = _.filter(Deck.data.outcomes, isUndefined).length;
        }
    };
})
;
