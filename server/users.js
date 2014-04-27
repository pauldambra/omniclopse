
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

module.exports = function(db) {
  return {
    create: function(username, password, callback) {
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) {
                callback(err);
                return;
            }
            // hash the password using our new salt
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) {
                    callback(err);
                    return;
                }
                db.users.save({
                    username:username,
                    password:hash
                }, function(err, result) {
                    if(err) {
                        callback(err.err);
                    } else {
                        callback('user created');
                    }
                });
            });
        });
    }
  }
}


