(function(omniclopse) {
  'use strict';

  var switchIcons = function(element, oldClass, newClass) {
    element.classList.remove(oldClass);
    element.classList.add(newClass);
  };

  omniclopse.ux = omniclopse.ux || {};
  omniclopse.ux.saveContentStarted = function(element) {
    switchIcons(element, 'fa-pencil', 'fa-save');
  };

  omniclopse.ux.saveContentCompleted = function(element) {
    switchIcons(element, 'fa-save', 'fa-check');
    setTimeout(function() {
      switchIcons(element, 'fa-check', 'fa-pencil');
    }, 3000);
  };

  omniclopse.ux.saveContentFailed = function(element) {
    switchIcons(element, 'fa-save', 'fa-times');
  };
}(window.omniclopse = window.omniclopse || {}));

(function(omniclopse, $) {
    'use strict';
    
    omniclopse.onContentEdited = function(element) {
      var icon = $(element).find("i")[0];
      
      omniclopse.ux.saveContentStarted(icon);

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
        omniclopse.ux.saveContentFailed(icon);
      }).done(function(){
        omniclopse.ux.saveContentCompleted(icon);
      });
    };

}(window.omniclopse = window.omniclopse || {}, $));