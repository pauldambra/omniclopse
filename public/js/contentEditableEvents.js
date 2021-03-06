(function(omniclopse, $, ckedit) {
    'use strict';

    //shamelessly borrowed from http://stackoverflow.com/a/14027188/222163
    omniclopse.bindEvents = function() {

        var before;
        var timer;
        $('*[contenteditable]').on('focus', function() {
          before = $(this).html();
        }).on('keyup paste', function() { 
          if (before != $(this).html()) { 
            clearTimeout(timer);
            var el = $(this)[0];
            timer = setTimeout(function() {
              omniclopse.onContentEdited(el);
            }, 500);
          }
        });

        //ckeditor replaces content when it inits against an element - yay
        ckedit.on('instanceReady', function(e) {
          $(e.editor.element.$).append('<i class="fa fa-pencil editable-affordance"></i>');
        });

    };    
}(window.omniclopse = window.omniclopse || {}, $, CKEDITOR));