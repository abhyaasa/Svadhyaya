'use strict';

angular.module('app', ['ionic', 'utils'])

.config(function ($stateProvider, $urlRouterProvider, $logProvider) {
    $logProvider.debugEnabled(true);

    $stateProvider
        .state('tabs', {
            url: '/tabs',
            abstract: true,
            templateUrl: 'views/tabs.html'
        })
        .state('tabs.decks', {
            url: '/decks',
            views: {
                'decks-tab': {
                    templateUrl: 'views/decks/decks.html',
                    controller: 'DecksController'
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
        .state('tabs.deck', {
            url: '/deck/:deckId',
            views: {
                'card-tab': {
                    templateUrl: 'views/deck/deck.html',
                    controller: 'DeckController'
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
            }
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
        .state('tabs.help', {
            url: '/help',
            views: {
                'settings-tab': {
                    templateUrl: 'views/help/help.html',
                    controller: 'HelpController'
                }
            }
        })
        .state('tabs.reset', {
            url: '/about',
            views: {
                'settings-tab': {
                    templateUrl: 'views/reset/reset.html',
                    controller: 'ResetController'
                }
            }
        })
        .state('tabs.filter', {
            url: '/deck',
            views: {
                'filter-tab': {
                    templateUrl: 'views/filter/filter.html',
                    controller: 'FilterController'
                }
            }
        });

    $urlRouterProvider.otherwise('/tabs/decks');
})

.factory('decks', function () {
    var Decks = {};
    return Decks;
})

/*
  Use directive name as tag, attribute, class name, or after directive: in comment.
  The associated element is removed.
*/
.directive('x', function () {
    return {
        restrict: 'AE',
        compile: function (el) {
            el.remove();
        }
    };
})

.run(function ($ionicPlatform, $rootScope, restoreSettings, $state) {
    $rootScope.dattaDeepam = true;

    // from http://www.thekuroko.com/using-angulars-log-provider/
    // $logProvider.debugEnabled(false);
    // $log.debug('DEBUG-------------');

    // replaced with app version if device is defined
    $rootScope.version = '0.0.0';

    // https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#issue\
    // -im-getting-a-blank-screen-and-there-are-no-errors
    $rootScope.$on('$stateChangeError', console.log.bind(console));

    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the
        // accessory bar above the keyboard for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        if (ionic.Platform.device()[0] !== undefined) {
            cordova.getAppVersion(function (version) {
                $rootScope.version = version;
            });
        }
        // xxx $state.go('tabs.decks');
    });
    restoreSettings();
});
