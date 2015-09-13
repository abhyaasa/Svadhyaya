'use strict';

// Jasmine unit tests

// TODO need to create mock for $hhtp.
// See http://stackoverflow.com/questions/26612156
// and https://www.airpair.com/angularjs/posts/unit-testing-angularjs-applications
// and http://gonehybrid.com/how-to-write-automated-tests-for-your-ionic-app-part-2/
xdescribe('getData', function () {
    var scope;
    var getData;
    beforeEach(module('utils'));
    beforeEach(function () {
        inject(function ($rootScope, $provider) {
            scope = $rootScope.$new();
            // getData = $provider('getData', ... TODO finish
        });
    });

    it('invokes success handler with object represented in json file',
        // FIXME fails, if success, test failure also
        inject(function (getData) {
            var handler = jasmine.createSpy('success');
            getData('test/test.json').then(handler);
            scope.$digest();
            expect(handler).toHaveBeenCalledWith(['data', 'for unit test']);
        }));

    it('invokes fail handler when local json file does not exist',
        // FIXME fails, if success, test failure also
        inject(function ($log, getData) {
            var handler = jasmine.createSpy('success');
            getData('bogus.json', handler);
            scope.$digest();
            expect(handler).toHaveBeenCalledWith('XX');
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
