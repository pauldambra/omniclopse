var express = require('express');
var app = express();
var passport = require('passport');
var flash = require('connect-flash');
var hbs = require('hbs');
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
app.use(flash());

hbs.registerHelper('markActiveWhenMatchesCarouselStartIndex', 
                    function(index) {
                        return index == 2 ? 'active' : '';
                    });
hbs.registerHelper('loginBlock', 
                    function(user) {
                        return user
                            ? '<a href="/logout">Logged in as ' + user + ' - Log out</a>'
                            : '<a href="/login">Login</a>';
                    });
hbs.registerHelper('elementShouldBeEditable', 
                    function(user) {
                        if (app.locals.user) {
                            return "contenteditable=true";
                        }
                    });

var blocks = {};

hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
});

hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');
app.engine('html', hbs.__express);


app.get('/', function(req, res, next) {
    db.pages.findOne({ name: 'home' }, function(err, doc) {
        if (err) {
            return next(err);
        } 
        app.locals.user = req.user ? req.user.username : undefined;
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
        return res.json(400, 'must provide a body for the page');
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
    console.error(err);
    res.render('500');
});

app.listen(process.env.PORT || 1337);

exports.app = app;