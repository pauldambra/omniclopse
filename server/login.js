var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Promise = require('bluebird');

var db = require('./db').db;
var ObjectId = require('./db').ObjectId;

var bcrypt = require('bcrypt');

var users = Promise.promisifyAll(db.users);
var compare = Promise.promisify(bcrypt.compare);

// Create a new object, that prototypally inherits from the Error constructor.
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
    return compare(password, user.password);
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