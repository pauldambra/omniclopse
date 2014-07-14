(function(omniclopse) {
  'use strict';
  omniclopse.ux = omniclopse.ux || {};
  omniclopse.ux.saveContentStarted = function(element) {

  };
}(window.omniclopse = window.omniclopse || {}));

(function(omniclopse, $) {
    'use strict';
    function alertTimeout(wait){
        setTimeout(function(){
            $('#messageHolder').children('.alert:first-child').alert().alert('close');
        }, wait);
    }

    var addMessage = function(message, bootstrapType) {
      var outer = $('<div/>', {
        class: 'alert alert-dismissable ' + bootstrapType
      });
      var button = $('<button/>',{
        type:'button',
        class:'close',
        'data-dismiss':'alert',
        'aria-hidden':'true',
      });
      button.append('&times;');
      outer.append(button);
      outer.append(message);
      $('#messageHolder').append(outer);
      alertTimeout(3000);
    }; 

    
    omniclopse.onContentEdited = function() {
      var panels = $('.panel').map(function(index, el) {
        var title = $(el).find('h1');
        var body = $(el).find('.panel-body');
        return {
          title: title ? title.text() : '',
          body: body? body.html() : ''
        };
      }).get();

      var putData = {'panels': panels};
      $.ajax({
        url:'/pages/home',
        dataType:'json',
        contentType:'application/json',
        data:JSON.stringify(putData),
        type:'PUT'
      }).fail(function(xhr,status){
        addMessage('could not save your changes', 'alert-danger');
      }).done(function(){
        addMessage('saved changes', 'alert-success');
      });
    };

}(window.omniclopse = window.omniclopse || {}, $));