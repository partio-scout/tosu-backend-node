const supertest = require('supertest')
const mockSession = require('mock-session')
const Keygrip = require("keygrip")
const { app, server } = require('../../index')
const api = supertest(app)

const models = require('../../domain/models')
require('../handleTestDatabase')

test('Logging in with invalid token returns 403', async () => {
  await api
    .post('/scouts')
    .send({ Authorization: 'foo' })
    .expect(403)
})

test('Logout works', async () => {
  await api
    .post('/scouts/logout')
    .expect(200)
})
