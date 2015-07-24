'use strict';

angular.module('app')

.controller('SettingsController', function ($scope) {})

.service('settings', function () {
    return {
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
    };
})

.service('restoreSettings', function (settings, localStorage, _) {
    var s = localStorage.getObject('settings');
    if (s !== undefined) {
        _.extendOwn(settings, s);
    }
})

.service('saveSettings', function (settings, _) {
    var s = {};
    _.extendOwn(s, settings);
    localStorage.setObject('settings', s);
});
