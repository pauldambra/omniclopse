//a script to allow adding users to database
//run like node userCreator --test --username=paul --password=password
//or like node userCreator --username=paul --password=password

var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var opts = require("nomnom")
            .options({
                username: {
                    abbr:'u'
                },
                password: {
                    abbr:'p'
                },
                test: {
                    abbr:'t',
                    flag:true
                }
            })
            .parse();

if(opts.test) {
    process.env.NODE_ENV = 'test'; 
}

var db = require('./server/db').db;
var ObjectId = require('./server/db').ObjectId;

if (!opts.username) {
    console.log('must provide a username');
    return;
}
if (!opts.password) {
    console.log('must provide a password');
    return;
}

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) {
            console.log(err);
            return;
        }
        // hash the password using our new salt
        bcrypt.hash(opts.password, salt, function(err, hash) {
            if (err) {
                console.log(err);
                return;
            }
            db.users.save({
                username:opts.username,
                password:hash
            });
            return;
        });
    });