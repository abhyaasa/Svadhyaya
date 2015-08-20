'use strict';

describe('getData', function () {
    beforeEach(module('utils'));
    it('should return object defined in local json file',
        inject(function (getData) {
            getData('data/config.json')
                .success(function (data) {
                    expect(JSON.stringify(data))
                        .toEqual('["data", "for unit test"]');
                });
        }));
    it('should do something if indicated local json file does not exist',
        inject(function (getData) {
            getData('bogus.json')
                .error(function (data, status) {
                    expect('Error: ' + data + status)
                        .toEqual('');
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
