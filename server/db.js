var mongojs = require('mongojs');
var dbName = process.env.NODE_ENV === 'test' ? 'omnitest' : 'omniclopse';
console.log('using db: '+dbName);
var db = mongojs(dbName, ['pages', 'users']);
db.pages.ensureIndex({'name': 1}, { unique: true});
db.users.ensureIndex({'username': 1}, {unique: true});
module.exports.db = db;
module.exports.ObjectId = mongojs.ObjectId;
