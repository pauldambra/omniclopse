var request = require('supertest');
var server;

beforeEach(function() {
    process.env.NODE_ENV = 'test';  
    //server = proxyquire('./../server', { 'mongojs': dbStub }).app;
    //everything works fine if I use the below
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

  describe('for logged in users', function() {
    it('should have the users name in the navbar');
    it('should have three panels marked contenteditable');
  });
});