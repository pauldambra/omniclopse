var request = require('supertest');
var server;

beforeEach(function() {
    process.env.NODE_ENV = 'test';  
    //server = proxyquire('./../server', { 'mongojs': dbStub }).app;
    //everything works fine if I use the below
    server = require('../server').app;
});

describe('GET /admin', function(){
  it('respond with html', function(done){
    request(server)
      .get('/admin')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });
  it('should redirect to login if not logged in');
});