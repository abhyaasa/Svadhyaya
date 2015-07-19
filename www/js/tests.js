'use strict';

angular.module('tests', ['utils'])

.service('testAll', function (testGetData) {
    return function () {
        testGetData();
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

.service('testLocalStorage', function (getData) {
    // xx
});
