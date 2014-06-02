var request = require('supertest');
var expect = require('chai').expect;

var server;
var db;
var login;
var serverRequest;

beforeEach(function() {
    //set environment to test and init things
    process.env.NODE_ENV = 'test'; 
    db = require('../server/db').db;
    server = require('../server').app;
    serverRequest = request(server);
});

describe('GET request to /login',function() {
  it('should send back the login page', function() {
    serverRequest
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
});

describe('logging in by POSTing to /login', function() {
  it('without valid username cannot login', function(done) {
    serverRequest
      .post('/login')
      .send({ username: 'not a real user', password: 'password' })
      .end(function(err, res) {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.equal('/login');
         serverRequest
          .get(res.header.location)
          .set('Cookie', res.header['set-cookie'])
          .expect(200)
          .end(function(err, res){
            expect(res.text).to.contain('Incorrect username.');
            done();
          })
      });
  });
  it('without valid password cannot login', function(done) {
    db.users.remove({username:'test'}, function() {
      var users = require('../server/users')(db);
      users.create('test', 'test', function(result) {
        expect(result).to.equal('user created');
        serverRequest
        .post('/login')
        .send({ username: 'test', password: 'not a password' })
        .end(function(err, res) {
          expect(res.status).to.equal(302);
          expect(res.header.location).to.equal('/login');
          serverRequest
            .get(res.header.location)
            .set('Cookie', res.header['set-cookie'])
            .expect(200)
            .end(function(err, res){
              expect(res.text).to.contain('Incorrect password.');
              done();
            });
        });
      });
    });
  });
  it('with valid credentials can login', function(done) {
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
            serverRequest
              .get(res.header.location)
              .set('Cookie', res.header['set-cookie'])
              .expect(200)
              .end(function(err, res){
                expect(res.text).to.contain('<a href="/logout">Logged in as test - Log out</a>');
                done();
              });
            });
      });
    });
  });
});

describe('logging out by GETing /logout', function() {
  it('should log out the logged in user', function(done) {
    db.users.remove({username:'test'}, function() {
      var users = require('../server/users')(db);
      users.create('test', 'test', function(result) {
        expect(result).to.equal('user created');
         request(server)
          .post('/login')
          .send({ username: 'test', password: 'test' })
          .end(function(err, res) {
            serverRequest
              .get('/logout')
              .set('Cookie', res.header['set-cookie'])
              .expect(302)
              .end(function(err,res) {
                expect(res.header.location).to.equal('/');
                done();
              });
          });
      });
    });
  });

  it('should throw no errors if there is no user logged in', function(done) {
    serverRequest
      .get('/logout')
      .expect(302)
      .end(function(err,res) {
        expect(res.header.location).to.equal('/');
        done();
      });
  });
});