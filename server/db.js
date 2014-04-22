var mongojs = require('mongojs');
var dbName = process.env.NODE_ENV === 'test' ? 'omnitest' : 'omniclopse';
console.log('using db: '+dbName);
var db = mongojs(dbName, ['pages']);
db.pages.ensureIndex( { 'name': 1 }, { unique: true });

module.exports = db;