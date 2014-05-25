var express = require('express');
var passport = require('passport');
var flash = require('connect-flash');

module.exports.initApp = function(dir) {
    var app = express();
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.cookieParser('omniclopse cookie'));
    app.use(express.session({ 
        secret: 'ilovescotchscotchyscotchscotch',
        cookie: {maxAge: new Date(Date.now() + 3600000)}, // 1 hour
        maxAge: new Date(Date.now() + 3600000) // 1 hour 
    }));
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use('/libs', express.static(dir + '/bower_components'));
    app.use(express.static(dir + '/public'));
    app.use(flash());
    app.set('view engine', 'html');
    app.set('views', dir + '/views');
    app.locals({
        user:null
    });
    return app;
}