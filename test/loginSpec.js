var request = require('supertest');
var expect = require('chai').expect;

var server;
var agent;
var db;
var login;

beforeEach(function() {
    //set environment to test and init things
    process.env.NODE_ENV = 'test'; 
    db = require('../server/db').db;
    server = require('../server').app;
    agent = request.agent(server);
});

describe('getting /login',function() {
  it('should send back the login page', function() {
        request(server)
          .get('/login')
          .set('Accept', 'text/html')
          .expect('Content-Type', /html/)
          .expect(200)
          .end(function(err,res) {
            expect(res.text.indexOf('form')).to.be.above(-1);
            expect(res.text.indexOf('username')).to.be.above(-1);
            expect(res.text.indexOf('password')).to.be.above(-1);
          });
  });
  it('should follow 302 when login is invalid and show flash');//how?!
});

describe('posting to /login', function() {
    it('without valid username cannot login', function(done) {
        agent
          .post('/login')
          .send({ username: 'not a real user', password: 'password' })
          .end(function(err, res) {
            expect(res.status).to.equal(302);
            expect(res.header.location).to.equal('/login');
            done();
          });
    });
    it('without valid password cannot login', function(done) {
        agent
          .post('/login')
          .send({ username: 'paul', password: 'not a password' })
          .end(function(err, res) {
            expect(res.status).to.equal(302);
            expect(res.header.location).to.equal('/login');
            done();
          });
    });
    it('with credentials can login', function(done) {
        agent
          .post('/login')
          .send({ username: 'paul', password: 'password' })
          .end(function(err, res) {
            expect(res.status).to.equal(302);
            expect(res.header.location).to.equal('/');
            done();
          });
    });
});