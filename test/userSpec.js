var expect = require('chai').expect;

var db;

beforeEach(function() {
    //set environment to test and init things
    process.env.NODE_ENV = 'test'; 
    db = require('../server/db').db;
});

describe('creating users', function() {
  it('should be possible to create a user', function(done) {
    db.users.remove({username:'test'}, function() {
      var users = require('../server/users')(db);
      users.create('test', 'test', function(result) {
        expect(result).to.equal('user created');
        db.users.count({username:'test'}, function(err,count) {
          expect(count).to.equal(1);  
          done();
        })
      });
    });
  });
  it('should not be possible to create a duplicate user', function(done) {
    var users = require('../server/users')(db);
    users.create('test', 'test', function(result) {
      expect(result).to.contain('duplicate key error');
      db.users.count({username:'test'}, function(err,count) {
        expect(count).to.equal(1);  
        done();
      })
    });
  });
});