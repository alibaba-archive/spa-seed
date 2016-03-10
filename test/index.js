'use strict'
/*global describe, it, after */

const thunk = require('thunks')()
const supertest = require('supertest')
const server = require('..')

const request = supertest(server)
const user = {
  id: 'abc',
  name: 'test',
  email: 'test@teambition.com'
}

describe('SPA Seed', function () {
  after(function *() {
    yield thunk.delay(1000)
    process.exit()
  })

  it('get index view', function *() {
    yield request.get('')
      .expect(200)
  })

  it('get favicon.ico', function *() {
    yield request.get('/favicon.ico')
      .expect(200)
  })

  it('get /api/info', function *() {
    yield request.get('/api/info')
      .expect(200)
      .expect('content-type', /application\/json/)
  })

  it('post /api/echo', function *() {
    yield request.post('/api/echo')
      .send(user)
      .expect(200)
      .expect('content-type', /application\/json/)
      .expect(user)
  })
})
