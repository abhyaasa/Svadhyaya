'use strict';

angular.module('tests', ['utils'])

.service('tests', function (getData) {
    return function () {
        getData('test.json')
            .success(function (data) {
                console.log(JSON.stringify(data));
            });
    };
});
