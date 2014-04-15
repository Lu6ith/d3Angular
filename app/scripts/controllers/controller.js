(function () {
    'use strict';

/* Controllers */

    angular.module('myApp.controllers')
        .controller('LineListCtrl', ['$scope', 'Line',
        function($scope, Line) {
            $scope.lines = Line.query();
            $scope.orderProp = 'typ';
        }]);

}());
