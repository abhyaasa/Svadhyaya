'use strict';

angular.module('app', ['ionic', 'utils'])

.config(function ($stateProvider, $urlRouterProvider, $logProvider, getDataProvider) {
    $logProvider.debugEnabled(true); // PUBLISH .debugEnabled(false)

    $stateProvider
    // .state('test', { url: '/test', template: '<h1>Testing</h1>' }) // XXX
    .state('tabs', {
        url: '/tabs',
        abstract: true,
        templateUrl: 'views/tabs.html',
        resolve: {
            configPromise: function ($http, _) {
                return getDataProvider.$get()('config.json');
            }},
        controller: 'TabsController'
    })
    .state('tabs.library', {
        url: '/library',
        views: {
            'library-tab': {
                templateUrl: 'views/library/library.html',
                controller: 'LibraryController'
            }
        }
    })
    .state('tabs.library-help', {
        url: '/libraryHelp',
        views: {
            'settings-tab': {
                templateUrl: 'views/library/help.html',
                controller: 'LibraryHelpController'
            }
        }
    })
    .state('tabs.deck', {
        url: '/deck:deckId',
        views: {
            'deck-tab': {
                templateUrl: 'views/deck/deck.html',
                controller: 'DeckController'
            }
        }
    })
    .state('tabs.card', {
        url: '/card',
        views: {
            'card-tab': {
                templateUrl: 'views/card/card.html',
                controller: 'CardController'
            }
        }
    })
    .state('tabs.answer', {
        url: '/answer',
        views: {
            'card-tab': {
                templateUrl: 'views/answer/answer.html',
                controller: 'AnswerController'
            }
        }
    })
    .state('tabs.settings', {
        url: '/settings',
        views: {
            'settings-tab': {
                templateUrl: 'views/settings/settings.html',
                controller: 'SettingsController'
            }
        },
        onExit: ['settings', 'localStorage', '_', function (settings, localStorage, _) {
            var s = {};
            _.extendOwn(s, settings);
            localStorage.setObject('settings', s);
        }]
    })
    .state('tabs.about', {
        url: '/about',
        views: {
            'settings-tab': {
                templateUrl: 'views/about/about.html',
                controller: 'AboutController'
            }
        }
    })
    .state('tabs.reset', {
        url: '/reset',
        views: {
            'settings-tab': {
                templateUrl: 'views/reset/reset.html',
                controller: 'ResetController'
            }
        }
    })
    .state('tabs.settings-help', {
        url: '/settingsHelp',
        views: {
            'settings-tab': {
                templateUrl: 'views/settings/help.html',
                controller: 'SettingsHelpController'
            }
        }
    });
    // $urlRouterProvider.otherwise('/test'); // XXX
    $urlRouterProvider.otherwise('/tabs/library');
})

.controller('TabsController', function ($rootScope, configPromise, $log, $state) {
    // promise is resolved: https://github.com/angular-ui/ui-router/wiki
    $rootScope.config = configPromise.data;
})

// .service('help', function ($log, $state) { // XXX
//     return function () {
//         $log.debug('HELP', $state);
//     };
// })

.run(function ($ionicPlatform, $rootScope, restoreSettings) {
    // https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions\
    // #issue-im-getting-a-blank-screen-and-there-are-no-errors
    // REVIEW $log.log instead of console?
    $rootScope.$on('$stateChangeError', console.log.bind(console));

    $ionicPlatform.ready(function () {
        // From ionic starter
        // Hide the accessory bar by default (remove this to show the
        // accessory bar above the keyboard for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });

    restoreSettings();
});
