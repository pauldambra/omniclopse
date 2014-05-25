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
    it('should 401 if not logged in');
    it('should 400 when no body', function(done) {
        request(server)
          .put('/pages/newPage')
          .set('Accept', 'text/json')
          .expect('Content-Type', /json/)
          .expect(400, done);
    });

    describe('with a new page name', function(){
      beforeEach(function() {
        db.pages.remove({}, false, function(err, doc) {});
      });

      it('should respond with 201 status', function(done){
        request(server)
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

      it('should respond with 200 status', function(done){
        request(server)
          .put('/pages/existingPage')
          .send({name:'existingPage', url:'/somewhereElse'})
          .set('Accept', 'text/json')
          .expect('Content-Type', /json/)
          .expect('location', '/somewhereElse')
          .expect(200, done);
      });

    });
});