var express = require('express');
var app = express();
var exp3hbs  = require('express3-handlebars');

app.use('/libs', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));
app.engine('handlebars', exp3hbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
  res.render('home');
});

app.listen(process.env.PORT || 1337);

exports.app = app;