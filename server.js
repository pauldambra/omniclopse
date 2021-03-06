var express = require('express');
var app;
var passport = require('passport');

var hbs = require('hbs');
var login = require('./server/login');
var db = require('./server/db').db;
var users = require('./server/users')(db);

passport.use(login.localStrategy);
passport.serializeUser(users.serializeUser);
passport.deserializeUser(users.deserializeUser);

var app = require('./server/config').initApp(__dirname);

require('./server/handlebars').init(hbs, app.locals);
hbs.registerPartials(__dirname + '/views/partials');
app.engine('html', hbs.__express);

app.get('/', function(req, res, next) {
    db.pages.findOne({ name: 'home' }, function(err, doc) {
        if (err) {
            return next(err);
        } 
        app.locals.user = req.user ? req.user.username : undefined;
        if (doc) {
            console.info(doc);
            res.render('home', doc);
        } else {
            res.render('404');
        }
    });
});

//don't use POST as we're not add a new page to /pages
//rather we're idempotently creating or updating the specific page
//at /page/foo
app.put('/pages/:page', users.ensureAuthenticatedAsJSON, function(req, res, next) {
    setTimeout(function() {

    var pageName = req.params.page;
    if(!req.body || Object.getOwnPropertyNames(req.body).length === 0) {
        return res.json(400, 'must provide a body for the page');
    }
    var page = req.body;
    page.name = pageName;

    db.pages.findAndModify({
        query: { name: pageName },
        update: { $set: page },
        upsert: true,
        new: true
    }, function(err, doc, lastErrorObject) {
        if(err) {
            console.error(lastErrorObject);
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
    }, 1500);
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
    console.error('catching error');
    console.error(err);
    res.render('500');
});

app.listen(process.env.PORT || 1337);

exports.app = app;