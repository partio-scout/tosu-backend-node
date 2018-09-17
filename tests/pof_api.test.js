const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

test('Backend works', async () => {
  await api
    .get('/api/pof')
    .expect(200)
})

test('POF is returned as json', async () => {
  await api
    .get('/api/pof/full')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(() => {
  server.close()
})