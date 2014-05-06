(function () {
    'use strict';

/* Controllers */

    angular.module('myApp.controllers')
        .controller('LineListCtrl', ['$scope', 'Line',
        function($scope, Line) {
            $scope.lines = Line.query();
            $scope.orderProp = ['typ', 'id'];
            $scope.orderTyp = 'typ';
            //$scope.stacja = "@";
            $scope.d3OnClick = function(item, st){
                //alert(item.typ + ' - ' + item.opis + '#modal' + item.stacja);
                $('#modalWIN .modal-body')
                    .html("<h4 class='text-primary'>" + st + ' - ' + item.opis + "</h3>"
                        + "<div class='alert alert-warning'>"
                        + "<span class='glyphicon glyphicon-hand-right'></span>"
                        + "  port: <span class='badge'>" + item.adresrtu[0].port + "</span>"
                        + "  adres: <a href='http://" + item.adresrtu[0].adres + "'><span class='badge'>" + item.adresrtu[0].adres + "</span></a>"
                        + "  prędkość: <span class='badge'>" + item.adresrtu[0].pred + "</span>"
                        + "</div>"
                    );
                $('#modalWIN').modal();
            };
            $scope.d3OnClick2 = function(item){
                //$('#popoverWIN').html("To jest test" + item.opis);
                $('#popoverWIN').popover('destroy');
                //$('#popoverWIN').popover('hide');
                $('#popoverWIN').popover({
                    'html': true,
                    'content': "port: <span class='badge'>" + item.adresrtu[0].port + "</span>",
                    'title': item.opis
                });
                $('#popoverWIN').popover('toggle');
            };
        }]);

}());
