const supertest = require('supertest')
const mockSession = require('mock-session')
const Keygrip = require("keygrip")
const { app, server } = require('../../index')
const api = supertest(app)

const models = require('../../domain/models')
require('../handleTestDatabase')

test('Logout works', async () => {
  await api
    .post('/scouts/logout')
    .expect(200)
})
