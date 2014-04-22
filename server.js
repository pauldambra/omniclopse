var express = require('express');
var app = express();
var partials = require('express-partials');

var db = require('./server/db');

app.use(express.json());
app.use('/libs', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));
app.use(partials());

app.set('view engine', 'ejs');

app.get('/', function(req, res, next) {
    db.pages.findOne({ name: 'home' }, function(err, doc) {
        if (err) {
            return next(err);
        } 
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

app.get('/admin', function(req, res) {
    res.render('admin', {layout:false});
});

app.use(function(err, req, res, next){
    console.log('handling error');
    console.log(err);
    res.render('500');
});

app.listen(process.env.PORT || 1337);

exports.app = app;