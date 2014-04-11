var mongojs = require('mongojs');
var db = mongojs('omniclopse', ['pages']);

module.exports.get = function(pageName, res) {
    db.pages.findOne({ name: pageName }, function(err, doc) {
        if (err) {
            res.send(500, err);
        } 
        if (doc) {
            res.render('home', doc);
        } else {
            res.render('home', {carouselImages:[], panels:[]});
        }
    });
};