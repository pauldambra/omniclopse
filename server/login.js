var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Promise = require('bluebird');
var bcrypt = require('bcrypt');
var db = require('./db').db;

var users = Promise.promisifyAll(db.users);
var compare = Promise.promisify(bcrypt.compare);

function NoMatchedUserError(message) {
  this.name = "NoMatchedUserError";
  this.message = message || "Incorrect username.";
}
NoMatchedUserError.prototype = new Error();
NoMatchedUserError.prototype.constructor = NoMatchedUserError;

module.exports.localStrategy = new LocalStrategy(function(username, password, done) {
  var matchedUser;

  var comparePassword = function(user){
    if(!user) {
      throw new NoMatchedUserError();
    }
    matchedUser = user;
    return compare(password, matchedUser.password);
  };

  users.findOneAsync({ username: username })
    .then(comparePassword)
    .then(function(isMatch) {
      return isMatch
        ? done(null, matchedUser)
        : done(null, false, { message: 'Incorrect password.' });
    })
    .catch(NoMatchedUserError, function() {
      return done(null, false, { message: 'Incorrect username.' });
    }) 
    .error(function(err) {
      return done(err);
    });
});