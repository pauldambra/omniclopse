var request = require('supertest');
var server = require('../server').app;
var should = require('should');

describe('GET unknown route sends 404 status', function(){
  it('respond with 404 html', function(done){
    request(server)
      .get('/never-exists')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect(404, done);
  });
});

describe('GET known route with no data sends 404 page with 200 status', function(){
  it('respond with 404 html', function(done){
    request(server)
      .get('/')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect(200, done)
      .end(function(err, res) {
        if (err) return done(err);
        res.text.should.include("Dang! That doesn't seem to exist.");
        done();
      });
  });
});