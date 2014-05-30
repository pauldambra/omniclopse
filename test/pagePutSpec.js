var request = require('supertest');
var should = require('should');

var server;
var db;

beforeEach(function() {
    //set environment to test and init things
    process.env.NODE_ENV = 'test'; 
    db = require('../server/db').db;
    server = require('../server').app;
});

describe('PUTing pages', function() {
  describe('as an anonymous user', function() {
    it('should 401 if not logged in', function(done) {
      request(server)
        .put('/pages/newPage')
        .set('Accept', 'text/json')
        .expect('Content-Type', /json/)
        .expect(401, done);
    });
  });

  describe('as a logged in user', function() {
    var agent = request.agent(server);

    beforeEach(function(done) {
      agent = request.agent(server);
      require('./testHelpers.js').getLoggedInAgent(db, server, agent, done);
    });

    describe('with a new page name', function(){
      beforeEach(function() {
        db.pages.remove({}, false, function(err, doc) {});
      });

      it('should 400 when no body', function(done) {
        agent
          .put('/pages/newPage')
          .set('Accept', 'text/json')
          .expect('Content-Type', /json/)
          .expect(400, done);
      });

      it('should respond with 201 status', function(done){
        agent
          .put('/pages/newPage')
          .send({name:'newPage', url:'/somewhere'})
          .set('Accept', 'text/json')
          .expect('Content-Type', /json/)
          .expect('location', '/somewhere')
          .expect(201, done);
      });

    });

    describe('with an existing page name', function(){
      beforeEach(function() {
        db.pages.remove({}, false, function(err, doc) {});
        db.pages.insert({name:'existingPage'}, function(err, docs){});
      });

      it('should 400 when no body', function(done) {
          agent
            .put('/pages/existingPage')
            .set('Accept', 'text/json')
            .expect('Content-Type', /json/)
            .expect(400, done);
      });

      it('should respond with 200 status', function(done){
        agent
          .put('/pages/existingPage')
          .send({name:'existingPage', url:'/somewhereElse'})
          .set('Accept', 'text/json')
          .expect('Content-Type', /json/)
          .expect('location', '/somewhereElse')
          .expect(200, done);
      });
    });
  });
});