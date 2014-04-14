'use strict';

/* Services */

var LineServices = angular.module('myApp.services', ['ngResource']);

LineServices.factory('Line', ['$resource',
    function($resource){
        return $resource('lines/:lineId.json', {}, {
            query: {method:'GET', params:{lineId:'lines'}, isArray:true}
        });
    }]);