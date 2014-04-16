(function () {
  'use strict';

  // create the angular app
  var myApp = angular.module('myApp', [
    'ngRoute',
    'myApp.controllers',
    'myApp.directives',
    'myApp.services',
    'ui.bootstrap'
    ]);

  // setup dependency injection
  angular.module('d3', []);
  angular.module('myApp.controllers', []);
  angular.module('myApp.directives', ['d3']);
  angular.module('myApp.services', []);

  myApp.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/linie', {
                    templateUrl: 'views/main.html',
                    controller: 'LineListCtrl'
                }).
                when('/linie/:lineId', {
                    templateUrl: 'views/line-detail.html',
                    controller: 'LineDetailCtrl'
                }).
                otherwise({
                    redirectTo: '/linie'
                });
        }]);
}());