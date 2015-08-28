'use strict';

// Jasmine unit tests

// TODO flush this
describe('getData bugus success', function () {
    beforeEach(module('utils'));
    xit('should return object defined in local json file',
        inject(function (getData) {
            getData('test/test.json', function (data) {
                expect(JSON.stringify(data))
                    .toEqual('["data", "for unit testxxx"]');
            });
        }));
});

describe('getData', function () {
    var scope;

    beforeEach(function () {
        module('utils');
        inject(function ($rootScope) {
            scope = $rootScope.$new();
        });
    });

    xit('should return object represented in local json file',
        inject(function (getData) {
            var handler = jasmine.createSpy('success');
            getData('test/test.json', handler);
            // FIXME TypeError: $browser.cookies is not a function
            scope.$digest();
            expect(handler).toHaveBeenCalledWith(['data', 'for unit test']);
        }));

    it('should return object represented in local json file',
        inject(function (getData) {
            var data;
            getData('test/test.json', function (data_) {
                data = data_;
            });
            scope.$digest();
            expect(JSON.stringify(data))
                .toEqual('["data", "for unit test"]');
            // CHECK this error
        }));

    xit('should do something if indicated local json file does not exist',
        // TODO false success
        inject(function ($log, getData) {
            getData('bogus.json', undefined, function (error) {
                console.log(error);
                expect('Error: ' + error)
                    .toEqual(''); // FIXME this reported error
            });
        }));
});

describe('localStorage', function () {
    beforeEach(module('utils'));
    it('should store and retrieve the same thing',
        inject(function (localStorage) {
            localStorage.set('test key', 'test value');
            expect(localStorage.get('test key')).toEqual('test value');
            expect(localStorage.get('bogus key')).not.toBeDefined();
        }));
});
