'use strict';

angular.module('app')

.controller('SettingsController', function ($log, $scope, settings) {
    $scope.settings = settings;
    $log.debug('controller settings', JSON.stringify(settings));
})

// initial values, overridden by localStorage settings
.value('settings', {
    randomQuestions: false,
    randomResponses: false,
    devanagari: false,
    hintPercent: 10
});
