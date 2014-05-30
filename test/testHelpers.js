var request = require('supertest');
var expect = require('chai').expect;

module.exports.getLoggedInAgent = function(db, server, agent, done) {
	db.users.remove({username:'test'}, function() {
    var users = require('../server/users')(db);
    users.create('test', 'test', function(result) {
    expect(result).to.equal('user created');
    
    agent
      .post('/login')
      .send({ username: 'test', password: 'test' })
      .end(function(err, res) {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.equal('/');
        done();
      });
    });
  });
}