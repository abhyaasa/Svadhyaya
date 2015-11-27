'use strict';

angular.module('app')

.controller('DeckController', function ($scope, Deck) {

    $scope.Deck = Deck;
    // TODO manage filter controls
})

.controller('DeckHelpController', function () {})

.service('Deck', function ($log, $state, $rootScope, getData, _) {
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
        return _.range(0, questions.length);
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
                activeCardIndex: undefined // current card ref. into active index list
            };
            Deck.data.outcomes = new Array(Deck.data.active.length);
            $state.go('tabs.card');
        });
    };

    var multiset = function (array) {
        var ms = {};
        array.map(function (value) {
            if (_.has(ms, value)) {
                ms[value] += 1;
            } else {
                ms[value] = 1;
            }
        });
        return ms;
    };
    this.setCount = function () {
        if (Deck.data) {
            Deck.count = multiset(Deck.data.outcomes);
            Deck.count.remaining = Deck.data.active.length - Deck.data.outcomes.length;
        }
    };
    this.getCount = function (key) {
        return key in Deck.count ? Deck.count[key] : 0;
    };
})
;
