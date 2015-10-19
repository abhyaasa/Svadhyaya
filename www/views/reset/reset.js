'use strict';

angular.module('app')

.controller('ResetController', function ($log, $scope, $state, restoreSettings) {
    $scope.hideConfirm = true;
    $scope.hideWarning = true;
    $scope.selection = undefined;
    $scope.options = [
        { text: 'Reset current deck', value: 'deck' },
        { text: 'Reset all decks', value: 'all decks' },
        { text: 'Reset settings to defaults', value: 'settings' }
    ];
    $scope.selected = function(item) {
        $scope.selection = item.value;
        $scope.hideWarning = $scope.selection.indexOf('deck') === -1;
        $scope.hideConfirm = false;
    };
    $scope.confirmed = function () {
        if ($scope.selection === 'settings') {
            restoreSettings(true);
        }
        // TODO reset deck(s)
        $state.go('tabs.settings');
    };
});
