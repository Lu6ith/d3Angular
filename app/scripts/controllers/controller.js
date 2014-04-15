(function () {
    'use strict';

/* Controllers */

    angular.module('myApp.controllers')
        .controller('LineListCtrl', ['$scope', 'Line',
        function($scope, Line) {
            $scope.lines = Line.query();
            $scope.orderProp = 'typ';
            $scope.d3OnClick = function(item){
                //alert(item.typ + ' - ' + item.opis + '#modal' + item.stacja);
                $('#modal' + item.stacja + ' .modal-body').html("OPIS: " + item.opis);
                $('#modal' + item.stacja).modal();
            };
        }]);

}());
