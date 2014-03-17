var express = require('express');
var app = express();
var exp3hbs  = require('express3-handlebars');

app.use('/libs', express.static(__dirname + '/bower_components'));
app.engine('handlebars', exp3hbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
  res.render('home');
});

app.listen(1337);

exports.app = app;