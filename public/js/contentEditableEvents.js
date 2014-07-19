(function(omniclopse, $, ckedit) {
    'use strict';
    var startEdit = function(element) {
      omniclopse.onContentEdited(element);
    }
    //shamelessly borrowed from http://stackoverflow.com/a/14027188/222163
    omniclopse.bindEvents = function() {

        var before;
        var timer;
        $('*[contenteditable]').on('focus', function() {
          before = $(this).html();
        }).on('keyup paste', function() { 
          if (before != $(this).html()) { 
            clearTimeout(timer);
            timer = setTimeout(startEdit($(this)[0]), 500);
          }
        });

        //ckeditor replaces content when it inits against an element - yay
        ckedit.on('instanceReady', function(e) {
          $(e.editor.element.$).append('<i class="fa fa-pencil editable-affordance"></i>');
        });

    };    
}(window.omniclopse = window.omniclopse || {}, $, CKEDITOR));