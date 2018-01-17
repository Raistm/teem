'use strict';

angular.module('Teem')
  .factory('voteWidget', [
  '$compile', '$timeout',
  function($compile, $timeout) {

    function getWidget (scope) {

      return {
        onInit: function(parent, voteId) {
          var element = angular.element(document.createElement('vote-widget')),
              compiled = $compile(element)(scope),
              vote = scope.project.findvote(voteId),
              stopEvents = ['keypress', 'keyup', 'keydown', 'paste'],
              isolateScope;
          vote.thumbDown = Number(vote.thumbDown);
          vote.thumbsUpDown = Number(vote.thumbsUpDown);
          vote.thumbUp = Number(vote.thumbUp);
          // Cancel widget contenteditable attributes
          element.attr('contenteditable', 'false');

          function stopEvent (e) { e.stopPropagation(); }

          stopEvents.forEach(function (eventName) {
            parent.addEventListener(eventName, stopEvent);
          });

          $timeout(() => {
            isolateScope = element.isolateScope();

            isolateScope.project = scope.project;
            isolateScope.vote = vote;
          });

          // Wait for the directive to be compiled before adding it
          $timeout(() => {
            angular.element(parent).append(compiled);
            // on blur, bump vote version to generate SwellRT event
            compiled[0].querySelector('textarea').addEventListener('blur', function(){
              vote.version =
                ((parseInt(vote.version) || 0) + 1).toString();
            });
          });

        }

      };
    }

    function add (editor, scope) {
      var vote = {
            text: '',
            thumbUp: '0',
            thumbDown: '0',
            thumbsUpDown: '0'
          },
          selection = editor.getSelection(),
          widget;

      if (selection.text) {
        vote.text = selection.text;
        editor.deleteText(selection);
      }

      vote = scope.project.addVote(vote);


      // To generate vote added event after all the info is available
      $timeout();

      if (selection.text) {
            vote.version = '1';
      }

      $timeout(() => {
        widget = editor.addWidget('vote', vote._id);
      });

      $timeout(() => {
          var textarea = angular.element(widget).find('textarea');

        if (textarea) {
          textarea.focus();
        }
      }, 500);
    }

    return {
      getWidget,
      add
    };
  }]);
