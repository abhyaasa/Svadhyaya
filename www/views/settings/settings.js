angular.module('app')

.controller('SettingsController', function ($scope) {})

.factory('settings', function () {
    var record = {
        randomQuestions: false,
        randomResponses: false,
        devanagari: false,
        hintPercent: 10,
        filter: {
            max: 50,
            min: 50,
            required: [],
            exclude: [],
            include: []
        },
    };
    return record;
});
