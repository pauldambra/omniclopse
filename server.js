var express = require('express');
var app = express();
var partials = require('express-partials');
var pages = require('./server/pages');

app.use('/libs', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));
app.use(partials());

app.set('view engine', 'ejs');

app.get('/', function(req, res){
    pages.get('home', res);
});

app.get('/admin', function(req, res) {
	res.render('admin', {layout:false});
});

app.listen(process.env.PORT || 1337);

exports.app = app;