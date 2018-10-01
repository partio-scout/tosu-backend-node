const supertest = require('supertest')
const { app, server } = require('../../index')
var session = require('supertest-session')
// const api = supertest(app)
const api = session(app)
const models = require('../../domain/models')
require('../testDatabase')

var authenticatedSession
var authScout

beforeEach( async (done) => {
  api
    .post('/scouts')
    .send({ Authorization: 'foo' })
    .then((result) => {
      authenticatedSession = api
      authScout = result.body
      done()
    })
})

test('Login', async () => {
  expect(authScout.googleId).toBe('foo')
})

// test('Session has scout', async (done) => {
//   api
//     .get('/scouts/session')
//     .then((result) => {
//       expect(result.body).toEqual(authScout)
//       done()
//     })
// })

afterAll(() => {
  server.close()
})
