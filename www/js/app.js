'use strict';

angular.module('app', ['ionic'])

.config(function ($stateProvider, $urlRouterProvider) {

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
          templateUrl: 'views/decks.html',
          controller: 'DecksController'
        }
      }
    })
    .state('tabs.study', {
      url: '/study',
      views: {
        'study-tab': {
          templateUrl: 'views/study.html',
          controller: 'StudyController'
        }
      }
    })
    .state('tabs.settings', {
      url: '/settings',
      views: {
        'settings-tab': {
          templateUrl: 'views/settings.html',
          controller: 'SettingsController'
        }
      }
    })
    .state('tabs.filter', {
      url: '/filter',
      views: {
        'filter-tab': {
          templateUrl: 'views/filter.html',
          controller: 'FilterController'
        }
      }
    });

  $urlRouterProvider.otherwise('/tabs/decks');
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
