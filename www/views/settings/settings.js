'use strict';

angular.module('app')

.controller('SettingsController', function ($scope, settings) {
    $scope.settings = settings;
})

.value('settings', {
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
    }
})

.service('restoreSettings', function (settings, localStorage, _) {
    return function () {
        var s = localStorage.getObject('settings');
        if (s !== undefined) {
            _.extendOwn(settings, s);
        }
    };
})

.service('saveSettings', function ($state, settings, localStorage, _) {
    var f = function () {
        var s = {};
        _.extendOwn(s, settings);
        localStorage.setObject('settings', s);
    };
    $state.onExit = f;
    return f;
});
