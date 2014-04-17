var express = require('express');
var app = express();
var partials = require('express-partials');
var mongojs = require('mongojs');

var dbName = process.env.NODE_ENV === 'test' ? 'omnitest' : 'omniclopse';
console.log('using db: '+dbName);

var db = mongojs(dbName, ['pages']);

app.use('/libs', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));
app.use(partials());

app.set('view engine', 'ejs');

app.get('/', function(req, res, next) {
    db.pages.findOne({ name: 'home' }, function(err, doc) {
        if (err) {
            next(err);
        } 
        if (doc) {
            res.render('home', doc);
        } else {
            res.render('404');
        }
    });
});

app.get('/admin', function(req, res) {
    res.render('admin', {layout:false});
});

app.use(function(err, req, res, next){
  res.render('500');
});
app.listen(process.env.PORT || 1337);

exports.app = app;