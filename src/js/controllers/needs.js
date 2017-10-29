'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:NeedsCtrl
 * @description
 * # Needs Ctrl
 * Show Needs for a given project
 */

angular.module('Teem')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/communities/:comId/teems/:id/needs', {
        templateUrl: 'needs/index.html',
        controller: 'NeedsCtrl'
      });
  }])
  .directive(
    'needDisplay',
    function(SessionSvc, ProjectsSvc, $route, Selector){
      return {
        require: '^needList',
        scope: {
          need: '='
        },
        link: function (scope, element, attrs, needsCtrl) {

          // LF : creamos la variable invite con una lista de miembros de teem para invitar y la lista de seleccionados
          scope.invite = {
            list : [],
            selected : []
          };

          scope.toggleCompleted = function (need, event) {
            // Needed by the magic of material design
            event.preventDefault();

            scope.project.toggleNeedCompleted(need);
          };

          scope.updateNeed = function(need) {
            if (need.completed === 'add'){
              if (need.text) {
                scope.project.addNeed(need);

                scope.need = {completed: 'add', text: ''};
              }
            }
            else if (need.text === ''){

              scope.project.removeNeed(need);
            }
          };

          scope.focusNeed = function(event) {
            angular.element(event.target).parent().find('textarea').focus();
          };

          SessionSvc.onLoad(function(){
            ProjectsSvc.findByUrlId($route.current.params.id).then(
              function(project){
                scope.project = project;
                Selector.populateUserSelector(scope.invite.list, scope.project.communities);
              }
            );
          });

          scope.keyEventsHandler = function(event){
            if (event.which === 13) { // enter
              event.target.blur();
            }
            if ((event.which === 8) && (scope.need.text === '')) { // backspace
              event.preventDefault();
              scope.updateNeed(scope.need);
            }
          };

          scope.keyDown = function(event){
            if (event.which === 13) { // enter
              if ( scope.newComment.text !== '') {
                scope.sendComment();
              }
              if (scope.assignUserToTask.name !== '') {
                scope.addUser();
              }

              // Do not add new line to comment input
              event.preventDefault();
            }
          };

          scope.focusElem = function(event){
            event.target.parentNode.parentNode.children[1].children[0].focus();
          };

          scope.toggleCommentsVisibility = function(n){
            needsCtrl.toggleCommentsVisibility(n);
          };

          scope.toggleAssigTaskToUserVisibility = function(n){
            needsCtrl.toggleAssigTaskToUserVisibility(n);
          };

          scope.newComment = {
            text: ''
          };

          scope.areCommentsVisible = needsCtrl.areCommentsVisible;
          scope.areAssigTaskToUserVisible = needsCtrl.areAssigTaskToUserVisible;

          scope.sendComment = function(){
            SessionSvc.loginRequired(scope, function() {
              scope.project.addNeedComment(scope.need, scope.newComment.text);
              scope.newComment.text = '';
            }, undefined, scope.project.synchPromise());
          };

          scope.hour = needsCtrl.hour;

          scope.newComments = function(need){
            if (!need.comments || !scope.project || !scope.project.isParticipant()){
              return false;
            }

            var prevAccess = new Date(scope.project.getTimestampAccess().needs.prev);
            var lastComment = new Date(need.comments[need.comments.length -1].time);
            return prevAccess < lastComment;
          };

          scope.assignTaskToUser = function(need){
            if (!need.userAssigned || !scope.project || !scope.project.isParticipant()){
              return false;
            }

            var prevAccess = new Date(scope.project.getTimestampAccess().needs.prev);
            var lastComment = new Date(need.userAssigned[need.userAssigned.length -1].time);
            return prevAccess < lastComment;
          };

          scope.userSelectorConfig = Selector.config.userToTask;

          scope.addUser = function(){
            var result;
            SessionSvc.loginRequired(scope, function() {
              result = Selector.assignTask(scope.invite.selected, scope.project);
              scope.invite.selected = [];
              console.log(result);
              scope.project.addUserToTask(scope.need, result.users, result.names);
            }, undefined, scope.project.synchPromise());
          };

          scope.isNewNeed = function(need){
            if (!scope.project || !scope.project.isParticipant() ||
            !scope.project.getTimestampAccess() || !scope.project.getTimestampAccess().needs){
              return false;
            }
            var prevAccess = new Date(scope.project.getTimestampAccess().needs.prev);
            var needTime = new Date(need.time);
            return prevAccess < needTime;
          };
        },
        templateUrl: 'needs/need.html',
        transclude: true
      };
    }
  ).directive(
    'needList',
    function () {
      return {
        templateUrl: function(elem, attrs) {
          return attrs.display !== 'panel' ? 'needs/list.html' : 'needs/panel.html';
        },
        transclude: true,
        scope: {
          project: '=',
          needs: '='
        },
        controller: function($scope, $route, SessionSvc, ProjectsSvc, time) {


          this.comments = {};
          this.userAssigned = {};

          var comments = this.comments;

          var userAssigned = this.userAssigned;

          this.toggleCommentsVisibility = function toggleCommentsVisibility(need) {
            comments.visible = (comments.visible === need) ? null : need;
            userAssigned.visible = null;
          };

          this.toggleAssigTaskToUserVisibility = function toggleAssigTaskToUserVisibility(need) {
            comments.visible = null;
            userAssigned.visible  = (userAssigned.visible  === need) ? null : need;
          };


          this.areCommentsVisible = function areCommentsVisible(need) {
            return comments.visible === need;
          };

          this.areAssigTaskToUserVisible = function areAssigTaskToUserVisible(need) {
            return userAssigned.visible === need;
          };

          this.hour = function(comment) {
            return time.hour(new Date(comment.time));
          };

          $scope.orderByTime = (need) => {
            return -Date.parse(need.time);
          };
        }
      };
    });
