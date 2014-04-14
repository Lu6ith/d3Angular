(function () {
  'use strict';

  angular.module('myApp.controllers')
    .controller('TreeCtrl', ['$scope', function($scope){
      $scope.title = "TreeCtrl";
      $scope.d3OnClick = function(item){
        alert(item.opis);
      };
    }]);

}());
