var SALT_WORK_FACTOR = 10;

var bcrypt = require('bcrypt');
var Promise = require('bluebird');

var genSalt = Promise.promisify(bcrypt.genSalt);
var genHash = Promise.promisify(bcrypt.hash);

module.exports = function(db) {
    var users = Promise.promisifyAll(db.users);

  return {
    create: function(username, password, callback) {
        var hashPassword = function() {
            return genSalt(SALT_WORK_FACTOR).then(function(salt) {
                return genHash(password, salt);
            });
        };

        var persistUser = function(hashedPassword) {
            return users.saveAsync({
                    username:username,
                    password:hashedPassword
            });
        };

        hashPassword()
        .then(persistUser)
        .then(function() {
            callback('user created');
        }).error(function (e) {
            callback(e.message);
        });
    },
    serializeUser: function(user, done) {
      done(null, user._id);
    },
    deserializeUser: function(id, done) {
      db.users.findOne({_id:db.ObjectId(id)}, function(err, user) {
        done(err, user);
      });
    }
  };
};