
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
          vote.thumbDown = vote.thumbDown.toString();
          vote.thumbsUpDown = vote.thumbsUpDown.toString();
          vote.thumbUp = vote.thumbUp.toString();
          $scope.project.sendVote(vote);
        };
      }],
      templateUrl: 'pad/vote-widget.html'
    };
  });
