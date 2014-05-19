var express = require('express');
var app = express();
var partials = require('express-partials');
var passport = require('passport');
var flash = require('connect-flash');

var login = require('./server/login');
var db = require('./server/db').db;

passport.use(login.localStrategy);
passport.serializeUser(login.serializeUser);
passport.deserializeUser(login.deserializeUser);

app.locals({
        user:null
    });

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
app.use('/libs', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));
app.use(partials());
app.use(flash());

app.set('view engine', 'ejs');

app.get('/', function(req, res, next) {
    db.pages.findOne({ name: 'home' }, function(err, doc) {
        if (err) {
            return next(err);
        } 
        app.locals.user = req.user;
        console.log(app.locals);
        if (doc) {
            res.render('home', doc);
        } else {
            res.render('404');
        }
    });
});

//don't use POST as we're not add a new page to /pages
//rather we're idempotently creating or updating the specific page
//at /page/foo
app.put('/pages/:page', function(req, res, next) {
    var pageName = req.params.page;
    if(!req.body || Object.getOwnPropertyNames(req.body).length === 0) {
        return res.json(400, {});
    }
    db.pages.findAndModify({
        query: { name: pageName },
        update: { $set: req.body },
        upsert: true,
        new: true
    }, function(err, doc, lastErrorObject) {
        if(err) {
            next(err);
        } else {
            res.location(doc.url || '/');
            if(lastErrorObject.updatedExisting) {
                res.json(200, {}); 
            } else {
                res.json(201,{}); 
            }
        }
    });
});

var extractMessage = function(req) {
    var flash = req.flash();
    if (flash && flash.hasOwnProperty('error')) {
        return {flash: flash.error};
    }
    else {
        return {};
    }
};

app.get('/login', function(req, res) {
    res.render('login', extractMessage(req));
})

app.post('/login',
    passport.authenticate('local', 
                        { 
                            successReturnToOrRedirect: '/',
                            failureRedirect: '/login',
                            failureFlash: true
                        })
);
 
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.use(function(err, req, res, next){
    console.log('handling error');
    console.log(err);
    res.render('500');
});

app.listen(process.env.PORT || 1337);

exports.app = app;