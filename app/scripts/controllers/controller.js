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
                $('#modalWIN .modal-body')
                    .html("<div class='alert alert-warning'>"
                        + "<span class='glyphicon glyphicon-hand-right'></span>"
                        + "  port: <span class='badge'>" + item.adresrtu[0].port + "</span>"
                        + "  adres: <a href='http://" + item.adresrtu[0].adres + "'><span class='badge'>" + item.adresrtu[0].adres + "</span></a>"
                        + "  prędkość: <span class='badge'>" + item.adresrtu[0].pred + "</span>"
                        + "</div>"
                    );
                $('#modalWIN').modal();
            };
        }]);

}());
