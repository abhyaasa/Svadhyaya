'use strict';

angular.module('app')

.controller('ResetController', function ($log, $scope, $state, restoreSettings) {
    $scope.hideConfirm = true;
    $scope.hideWarning = true;
    $scope.selection = undefined;
    $scope.options = [
        // { text: 'Reset current deck', value: 'deck', warning: 'deck'},
        // { text: 'Reset all decks', value: 'all decks', warning: 'deck' },
        { text: 'Reset settings to defaults', value: 'settings' }
    ];
    $scope.selected = function(item) {
        $scope.selection = item.value;
        $scope.hideWarning = item.warning !== 'deck';
        $scope.hideConfirm = false;
    };
    $scope.confirmed = function () {
        if ($scope.selection === 'settings') {
            restoreSettings(true);
        }
        // TODO add reset deck(s) code, uncomment options above
        $state.go('tabs.settings');
    };
});
