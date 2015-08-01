'use strict';

// see http://headjs.com/site/api/v1.00.html
head.load(
    // ionic boilerplate
    'lib/ionic/js/ionic.bundle.js',
    'cordova.js',

    'lib/underscore/underscore.js',

    // TODO use or remove: for markdown
    'lib/marked/lib/marked.js',
    'lib/angular-marked/angular-marked.js',

    // this app
    'js/utils.js',
    'js/tests.js', // PUBLISH remove
    'js/app.js',
    'views/decks/decks.js',
    'views/filter/filter.js',
    'views/card/card.js',
    'views/answer/answer.js',
    'views/deck/deck.js',
    'views/settings/settings.js',
    'views/reset/reset.js',
    'views/about/about.js',
    'views/help/help.js'
);
