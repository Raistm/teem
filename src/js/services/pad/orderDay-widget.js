'use strict';

angular.module('Teem')
  .factory('orderdayWidget', [
  '$compile', '$timeout',
  function($compile, $timeout) {

    function getWidget (scope) {

      return {
        onInit: function(parent, orderdayId) {
          var element = angular.element(document.createElement('orderday-widget')),
              compiled = $compile(element)(scope),
              orderday = scope.project.findorderday(orderdayId),
              stopEvents = ['keypress', 'keyup', 'keydown', 'paste'],
              isolateScope;

          // Cancel widget contenteditable attributes
          element.attr('contenteditable', 'false');

          function stopEvent (e) { e.stopPropagation(); }

          stopEvents.forEach(function (eventName) {
            parent.addEventListener(eventName, stopEvent);
          });

          $timeout(() => {
            isolateScope = element.isolateScope();

            isolateScope.project = scope.project;
            isolateScope.orderday = orderday;
          });

          // Wait for the directive to be compiled before adding it
          $timeout(() => {
            angular.element(parent).append(compiled);
            // on blur, bump orderday version to generate SwellRT event
            compiled[0].querySelector('textarea').addEventListener('blur', function(){
              orderday.version =
                ((parseInt(orderday.version) || 0) + 1).toString();
            });
          });

        },
        //If we want to deactivate the order when we mark it
        /*onDeactivated: function(element) {
          scope.project.removeorderday(element.dataset.orderday);
        }*/
      };
    }

    function add (editor, scope) {
      var orderday = {
            text: ''
          },
          selection = editor.getSelection(),
          widget;

      if (selection.text) {
        orderday.text = selection.text;
        editor.deleteText(selection);
      }

      orderday = scope.project.addorderday(orderday);


      // To generate orderday added event after all the info is available
      $timeout();

      if (selection.text) {
            orderday.version = '1';
      }

      $timeout(() => {
        widget = editor.addWidget('orderday', orderday._id);
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
