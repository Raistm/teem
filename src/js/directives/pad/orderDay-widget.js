
'use strict';

angular.module('Teem')
  .directive('orderdayWidget', function() {
    return {
      scope: {},
      controller: [
      '$scope',
      function($scope) {
        $scope.toggleorderdayCompleted = function (orderday, event) {
          event.stopPropagation();
          // Needed by the magic of material design
          event.preventDefault();

          $scope.project.toggleorderdayCompleted(orderday);
        };
      }],
      templateUrl: 'pad/orderday-widget.html'
    };
  });
