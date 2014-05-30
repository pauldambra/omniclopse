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
  users.findOneAsync({ username: username }).bind({})
    .then(function(user){
    if(!user) {
      throw new NoMatchedUserError();
    }
    this.user = user;
    return compare(password, this.user.password);
  })
  .then(function(passwordsMatch) {
    return passwordsMatch
      ? this.user
      : false;//, { message: 'Incorrect password.' });
  })
  .catch(NoMatchedUserError, function() {
    return false;//, { message: 'Incorrect username.' });
  }) 
  .error(function(err) {
    return err;
  })
  .nodeify(done);
});