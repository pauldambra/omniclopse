
module.exports.init = function(handlebars, appLocals) {
    handlebars.registerHelper('markActiveWhenMatchesCarouselStartIndex', 
                        function(index) {
                            return index == 2 ? 'active' : '';
                        });
    handlebars.registerHelper('loginBlock', 
                        function(user) {
                            return user
                                ? '<a href="/logout">Logged in as ' + user + ' - Log out</a>'
                                : '<a href="/login">Login</a>';
                        });
    handlebars.registerHelper('elementShouldBeEditable', 
                        function(user) {
                            if (appLocals.user) {
                                return "contenteditable=true";
                            }
                        });
    handlebars.registerHelper("debug", function(optionalValue) {
      console.log("Current Context");
      console.log("====================");
      console.log(this);
     
      if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
      }
    });
    handlebars.registerHelper("safeString", function(value) {
        return new Handlebars.SafeString(value);
    });
    //handlebars helper stolen from project examples to allow ASP.net MVC style sections
    var blocks = {};

    handlebars.registerHelper('extend', function(name, context) {
        var block = blocks[name];
        if (!block) {
            block = blocks[name] = [];
        }

        block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
    });

    handlebars.registerHelper('block', function(name) {
        var val = (blocks[name] || []).join('\n');
        // clear the block
        blocks[name] = [];
        return val;
    });
}