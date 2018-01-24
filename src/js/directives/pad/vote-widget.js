
'use strict';

angular.module('Teem')
  .directive('voteWidget', function() {
    return {
      scope: {},
      controller: [
      '$scope',
      function($scope) {
        $scope.sendVote = function (vote, event) {
          event.stopPropagation();
          // Needed by the magic of material design
          event.preventDefault();
          vote.thumbDown = Number(vote.thumbDown);
          vote.thumbsUpDown = Number(vote.thumbsUpDown);
          vote.thumbUp = Number(vote.thumbUp); $scope.project.sendVote(vote);
        };
      }],
      templateUrl: 'pad/vote-widget.html'
    };
  });
