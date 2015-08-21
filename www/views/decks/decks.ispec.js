'use strict';
// TODO ibook 235 itest
describe('Decks View', function () {
    return;
    browser.get('http://localhost:8100/');
    var searchText = element(by.model('model.searchText'));

    it('should open to the decks view', function () {
        expect(searchText.getText()).toBe('');
    });
});
