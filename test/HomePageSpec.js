var request = require('supertest');
var server;

beforeEach(function() {
    process.env.NODE_ENV = 'test'; 
    server = require('../server').app;
});

describe('the home page', function() {
  describe('GET /', function(){
    it('respond with html', function(done){
      request(server)
        .get('/')
        .set('Accept', 'text/html')
        .expect('Content-Type', /html/)
        .expect(200, done);
    });
  });
});