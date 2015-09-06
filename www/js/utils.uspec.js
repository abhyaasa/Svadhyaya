'use strict';

// Jasmine unit tests

// TODO need to create mock for $hhtp.
// See http://stackoverflow.com/questions/26612156
xdescribe('getData', function () {
    var scope;

    beforeEach(function () {
        module('utils');
        inject(function ($rootScope) {
            scope = $rootScope.$new();
        });
    });

    it('invokes success handler with object represented in json file',
        inject(function (getData) {
            var handler = jasmine.createSpy('success');
            getData('test/test.json', handler);
            scope.$digest();
            expect(handler).toHaveBeenCalledWith(['data', 'for unit testXXX']);
            // FIXME this XXX
        }));

    it('invokes fail handler when local json file does not exist',
        inject(function ($log, getData) {
            getData('bogus.json', undefined, function (error) {
                console.log(error);
                expect('Error: ' + error)
                    .toEqual('XXX'); // FIXME this XXX
            });
        }));
});

describe('localStorage', function () {
    beforeEach(module('utils'));
    it('stores and retrieves the same thing using the same test key',
        inject(function (localStorage) {
            localStorage.set('test key', 'test value');
            expect(localStorage.get('test key')).toEqual('test value');
            expect(localStorage.get('bogus key')).not.toBeDefined();
        }));
});
