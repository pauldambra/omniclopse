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
  users.findOneAsync({ username: username })
    .bind([])
    .then(function(user){
      if(!user) {
        throw new NoMatchedUserError();
      }
      this[0] = user;
      return compare(password, user.password);
    })
    .then(function(passwordsMatch) {
      if (!passwordsMatch) {
        return [false, 'Incorrect password.'];
      }
      return this;
    })
    .catch(NoMatchedUserError, function() {
      return [false, 'Incorrect username.'];
    })
    .nodeify(done, {spread:true});
});