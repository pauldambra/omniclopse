var request = require('supertest');
var should = require('should');

var server;
var db;

beforeEach(function() {
    process.env.NODE_ENV = 'test'; 
    db = require('../server/db');
    server = require('../server').app;
});

describe('PUTing pages', function() {
    it('should 400 when no body', function(done) {
        request(server)
          .put('/pages/newPage')
          .set('Accept', 'text/json')
          .expect('Content-Type', /json/)
          .expect(400, done);
    });

    describe('with new name', function(){
      beforeEach(function() {
        //delete so we know it's new
        db.pages.remove({}, false, function(err, doc) {});
      });

      it('respond with 201 status', function(done){
        request(server)
          .put('/pages/newPage')
          .send({name:'newPage', url:'/somewhere'})
          .set('Accept', 'text/json')
          .expect('Content-Type', /json/)
          .expect('location', '/somewhere')
          .expect(201, done);
      });

    });

    describe('with existing name', function(){
      beforeEach(function() {
        db.pages.remove({}, false, function(err, doc) {});
        db.pages.insert({name:'existingPage'}, function(err, docs){});
      });

      it('respond with 200 status', function(done){
        request(server)
          .put('/pages/existingPage')
          .send({name:'existingPage', url:'/somewhere'})
          .set('Accept', 'text/json')
          .expect('Content-Type', /json/)
          .expect('location', '/somewhere')
          .expect(200, done);
      });

    });
});