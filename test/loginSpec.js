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
})

describe('GET request to /login',function() {
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

describe('logging in by POSTing to /login', function() {
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
    it('with valid credentials can login', function(done) {
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
    });
});

describe('logging out by GETing /logout', function() {
  it('should log out the logged in user', function(done) {
        db.users.remove({username:'test'}, function() {
          var users = require('../server/users')(db);
          users.create('test', 'test', function(result) {
            expect(result).to.equal('user created');
             agent
              .post('/login')
              .send({ username: 'test', password: 'test' })
              .end(function(err, res) {
                agent
                  .get('/logout')
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
    agent
      .get('/logout')
      .expect(302)
      .end(function(err,res) {
        expect(res.header.location).to.equal('/');
        done();
      });
  });
});