'use strict';

angular.module('tests', ['utils'])

.service('testAll', function (testGetData, testLocalStorage) {
    return function () {
        testGetData();
        testLocalStorage();
    };
})

.service('testGetData', function (getData) {
    return function () {
        getData('test.json')
            .success(function (data) {
                console.log(JSON.stringify(data));
            });
    };
})

.service('testLocalStorage', function (localStorage) {
    return function () {
        localStorage.set('a', 3);
        console.log('localStorage: ' + localStorage.get('a'));
    };
});
