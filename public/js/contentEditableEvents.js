(function(omniclopse, $) {
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
            timer = setTimeout(omniclopse.onContentEdited, 500);
          }
        });
    };    
}(window.omniclopse = window.omniclopse || {}, $));