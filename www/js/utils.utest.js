'use strict';

describe('getData', function () {
    beforeEach(module('utils'));
    it('should return object defined in local json file',
        inject(function (getData) {
            getData('test.json')
                .success(function (data) {
                    expect(JSON.stringify(data))
                        .toEqual('["data", "for unit test"]');
                });
        }));
    xit('should do something if indicated local json file does not exist',
        inject(function (getData) {
            expect(getData('xx.json')
                .success(function (data) {
                    return data; // xx identity fn
                })).toThrow('');
        }));
});
