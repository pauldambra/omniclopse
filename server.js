var express = require('express');
var app = express();
var partials = require('express-partials');

app.use('/libs', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));
app.use(partials());

app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('home');
});

app.get('/admin', function(req, res) {
	res.render('admin', {layout:false});
});

app.listen(process.env.PORT || 1337);

exports.app = app;