'use strict';

angular.module('tests', ['utils'])

<<<<<<< HEAD
.service('testAll', function (testGetData, testLocalStorage) {
    return function () {
        testGetData();
        testLocalStorage();
=======
.service('testAll', function (testGetData, testLocalStorage, _) {
    return function () {
        testGetData();
        testLocalStorage();
        // test underscore
        console.log('test underscore: ' + _([1, 2, 3]).map(function (n) {
            return n * 2;
        }));
>>>>>>> settings
    };
})

.service('testGetData', function (getData) {
    return function () {
        getData('test.json')
            .success(function (data) {
                console.log('test getData: ' + JSON.stringify(data));
            });
    };
})

.service('testLocalStorage', function (localStorage) {
    return function () {
<<<<<<< HEAD
        localStorage.set('a', 3);
        console.log('localStorage: ' + localStorage.get('a'));
=======
        localStorage.set('key', 3);
        console.log('test localStorage: ' + localStorage.get('key'));
        console.log('test localStorage undefined: ' +
            (localStorage.get('x') === undefined));
>>>>>>> settings
    };
});
