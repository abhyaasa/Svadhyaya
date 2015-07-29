'use strict';

angular.module('tests', ['utils'])

.service('testAll', function (testGetData, testLocalStorage, $log, _) {
    return function () {
        testGetData();
        testLocalStorage();
        // test underscore
        $log.debug('test underscore: ' + _([1, 2, 3]).map(function (n) {
            return n * 2;
        }));
    };
})

.service('testGetData', function (getData, $log) {
    return function () {
        getData('deck_files.json')
            .success(function (data) {
                $log.debug('test getData: ' + JSON.stringify(data));
            });
    };
})

.service('testLocalStorage', function (localStorage, $log) {
    return function () {
        localStorage.set('key', 4);
        $log.debug('test localStorage: ' + localStorage.get('key'));
        $log.debug('test localStorage undefined: ' +
            (localStorage.get('x') === undefined));
    };
});
