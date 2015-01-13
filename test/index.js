'use strict';

/*global describe, it, before, after, beforeEach, afterEach*/
/*jshint -W124 */

var supertest = require('supertest');
var server = require('../app');

var request = supertest(server);
var user = {
  id: 'abc',
  name: 'test',
  email: 'test@teambition.com'
};

describe('SPA Seed', function() {

  after(function() {
    setTimeout(function() {
      process.exit();
    }, 1000);
  });

  it('get index view', function(done) {
    request.get('')
      .expect(200)
      .end(done);
  });

  it('get favicon.ico', function(done) {
    request.get('/favicon.ico')
      .expect(200)
      .end(done);
  });

  it('get /api/info', function(done) {
    request.get('/api/info')
      .expect(200)
      .expect('content-type', /application\/json/)
      .end(done);
  });

  it('post /api/echo', function(done) {
    request.post('/api/echo')
      .send(user)
      .expect(200)
      .expect('content-type', /application\/json/)
      .expect(user)
      .end(done);
  });
});
