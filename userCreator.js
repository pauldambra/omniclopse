//a script to allow adding users to database
//run like node userCreator --test --username=paul --password=password
//or like node userCreator --username=paul --password=password

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

if (!opts.username) {
    console.log('must provide a username');
    return;
}
if (!opts.password) {
    console.log('must provide a password');
    return;
}

var db = require('./server/db').db;
    
var users = require('./server/users')(db);
users.create(username, password, function(result) {
    console.log(result);
})