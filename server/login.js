var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var db = require('./db').db;
var ObjectId = require('./db').ObjectId;

var bcrypt = require('bcrypt');

module.exports.localStrategy = new LocalStrategy(function(username, password, done) {
  db.users.findOne({ username: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }

    bcrypt.compare(password, user.password, function(err, isMatch) {
      if (err) { return done(err); }
      if (isMatch) {
        return done(null, user);
      }
      return done(null, false, { message: 'Incorrect password.' });
    });
  });
});

//only need to serialize the user id
module.exports.serializeUser = function(user, done) {
  done(null, user._id);
};

// used to deserialize the user
module.exports.deserializeUser = function(id, done) {
  db.users.findOne({_id:ObjectId(id)}, function(err, user) {
    done(err, user);
  });
};