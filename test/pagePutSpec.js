var request = require('supertest');
//var should = require('should');
var expect = require('chai').expect;
var server;
var db;
var serverRequest;

beforeEach(function() {
    //set environment to test and init things
    process.env.NODE_ENV = 'test'; 
    db = require('../server/db').db;
    server = require('../server').app;
    serverRequest = request(server);
});

describe('PUTing pages', function() {
  describe('as an anonymous user', function() {
    it('should 401 if not logged in', function(done) {
      serverRequest
        .put('/pages/newPage')
        .set('Accept', 'text/json')
        .expect('Content-Type', /json/)
        .expect(401, done);
    });
  });

  describe('as a logged in user', function() {
    var loginCookie;

    beforeEach(function(done) {
      db.users.remove({username:'test'}, function() {
        var users = require('../server/users')(db);
        users.create('test', 'test', function(result) {
        expect(result).to.equal('user created');
        
        serverRequest
          .post('/login')
          .send({ username: 'test', password: 'test' })
          .end(function(err, res) {
            expect(res.status).to.equal(302);
            expect(res.header.location).to.equal('/');
            loginCookie = res.header['set-cookie'];
            done();
          });
        });
      });
    });

    describe('with a new page name', function(){
      beforeEach(function() {
        db.pages.remove({}, false, function(err, doc) {});
      });

      it('should 400 when no body', function(done) {
        serverRequest
          .put('/pages/newPage')
          .set('Cookie', loginCookie)
          .set('Accept', 'text/json')
          .expect('Content-Type', /json/)
          .expect(400, done);
      });

      it('should respond with 201 status', function(done){
        serverRequest
          .put('/pages/newPage')
          .set('Cookie', loginCookie)
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
          serverRequest
            .put('/pages/existingPage')
            .set('Cookie', loginCookie)
            .set('Accept', 'text/json')
            .expect('Content-Type', /json/)
            .expect(400, done);
      });

      it('should respond with 200 status', function(done){
        serverRequest
          .put('/pages/existingPage')
          .set('Cookie', loginCookie)
          .send({name:'existingPage', url:'/somewhereElse'})
          .set('Accept', 'text/json')
          .expect('Content-Type', /json/)
          .expect('location', '/somewhereElse')
          .expect(200, done);
      });
    });
  });
});