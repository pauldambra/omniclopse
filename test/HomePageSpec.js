var request = require('supertest');
var expect = require('chai').expect;
var server;
var agent;

beforeEach(function(done) {
    process.env.NODE_ENV = 'test';  
    db = require('../server/db').db;
    server = require('../server').app;
    agent = request.agent(server);
    require('./testHelpers.js').getLoggedInAgent(db, server, agent, done);
});

describe('the home page', function() {
  describe('GET /', function(){
    it('respond with html', function(done){
      agent
        .get('/')
        .set('Accept', 'text/html')
        .expect('Content-Type', /html/)
        .expect(200, done);
    });
  });

  describe('for logged in users', function() {
    it('should have the users name in the navbar', function(done){
      agent
        .get('/')
        .set('Accept', 'text/html')
        .expect('Content-Type', /html/)
        .expect(200)
        .end(function(err, res) {
          expect(res.text).not.to.contain('<a href="/login">Login</a>');
          done();
        });
    });
  });
});