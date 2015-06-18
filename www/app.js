'use strict';

angular.module('app', ['ionic'])

.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('tabs', {
            url: '/tabs',
            abstract: true,
            templateUrl: 'views/tabs/tabs.html'
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
        .state('tabs.qanda', {
            url: '/qanda',
            views: {
                'qanda-tab': {
                    templateUrl: 'views/qanda/qanda.html',
                    controller: 'QandAController'
                }
            }
        })
        .state('tabs.answer', {
            url: '/qanda',
            views: {
                'qanda-tab': {
                    templateUrl: 'views/qanda/qanda.html',
                    controller: 'QandAController'
                }
            }
        })
        .state('tabs.question', {
            url: '/qanda',
            views: {
                'qanda-tab': {
                    templateUrl: 'views/qanda/qanda.html',
                    controller: 'QandAController'
                }
            }
        })
        .state('tabs.score', {
            url: '/qanda',
            views: {
                'study-tab': {
                    templateUrl: 'views/score.html',
                    controller: 'ScoreController'
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
        .state('tabs.filter', {
            url: '/filter',
            views: {
                'filter-tab': {
                    templateUrl: 'views/filter/filter.html',
                    controller: 'FilterController'
                }
            }
        });

    $urlRouterProvider.otherwise('/tabs/decks');
})

.factory('Settings', function () {
    var Settings = {
        qrandom: false,
        arandom: false,
        devanagari: false,
        transliteration: 'IAST',
        hintPercent: 10
    };
    return Settings;
})

.factory('Decks', function () {
    var Decks = {};
    return Decks;
})

.directive('x', function () {
    return {
        restrict: 'AE',
        compile: function (el) {
            el.remove();
        }
    };
})

.run(function ($ionicPlatform, $rootScope) {
    // replaced with app version if device is defined
    $rootScope.version = '0.0.0';

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
    });
});
