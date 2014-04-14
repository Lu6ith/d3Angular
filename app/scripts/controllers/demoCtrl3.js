(function () {
  'use strict';

  angular.module('myApp.controllers')
    .controller('DemoCtrl3', ['$scope', function($scope){
      $scope.title = "DemoCtrl3";
      $scope.d3Data = [
        {name: "Greg", score:78, arrlabel: "KDM B1 16/4"},
        {name: "Ari", score:66, arrlabel: "KDM C4 6/6"},
        {name: "Loser", score: 48, arrlabel: "KDM D2 1/5"}
      ];
      $scope.d3OnClick = function(item){
        alert(item.name + item.arrlabel);
      };
    }]);

}());
