const supertest = require('supertest')
const mockSession = require('mock-session')
const Keygrip = require("keygrip")
const { app, server } = require('../../index')
const api = supertest(app)

const models = require('../../domain/models')
require('../handleTestDatabase')

test('Login', async (done) => {
  api
    .post('/scouts')
    .send({ Authorization: 'foo' })
    .then((result) => {
      expect(result.body.googleId).toBe('foo')
      done()
    })
})
