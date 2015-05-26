'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:ChatCtrl
 * @description
 * # Chat Ctrl
 * Show Pad for a given project
 */

angular.module('Pear2Pear')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/projects/:id/pad', {
        templateUrl: 'pad/show.html',
        controller: 'PadCtrl'
      });
  }])
  .controller('PadCtrl', ['pear', '$scope', '$route', function(pear, $scope, $route){
    $scope.project = pear.projects.find($route.current.params.id);

    // Should use activeLinks, but https://github.com/mcasimir/mobile-angular-ui/issues/262 
    $scope.nav = function(id) {
      return id === 'pad' ? 'active' : '';
    };
  }]);
