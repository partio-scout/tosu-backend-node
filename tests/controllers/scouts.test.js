const supertest = require('supertest')
const mockSession = require('mock-session')
const Keygrip = require("keygrip")
const { app, server } = require('../../index')
const api = supertest(app)

const models = require('../../domain/models')
require('../handleTestDatabase')

test('Login with GoogleIdToken returns Scout', async (done) => {
  api
    .post('/scouts')
    .send({ Authorization: 'foo' })
    .then((result) => {
      // TODO: Check for actual Scout once login implemented
      expect(result.body.googleId).toBe('foo')
      done()
    })
})
