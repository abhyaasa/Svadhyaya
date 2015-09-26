'use strict';

angular.module('app')

.controller('SettingsController', function ($scope, $rootScope, $state, settings) {
    $scope.settings = settings;
})

.controller('SettingsHelpController', function ($scope, $rootScope) {})

.value('settings', {})

.service('restoreSettings', function ($log, settings, localStorage, _) {
    var defaultSettings = {
        intro: true,
        randomQuestions: false,
        randomResponses: false,
        devanagari: false,
        hintPercent: 10
    };
    return function (reset) {
        _.extendOwn(settings, defaultSettings);
        if (!reset) {
            var s = localStorage.getObject('settings');
            if (s !== undefined) {
                _.extendOwn(settings, s);
            }
        }
        $log.debug('restored settings', JSON.stringify(settings));
    };
});
