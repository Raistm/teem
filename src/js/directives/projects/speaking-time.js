'use strict';

angular.module('Teem')
  .directive('speakingTime', function() {
    return {
      scope: true,
      templateUrl: 'projects/speaking-time.html'
    };
  });
