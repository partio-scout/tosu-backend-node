const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

test('Backend works', async () => {
  await api
    .get('/api/pof')
    .expect(200)
})

afterAll(() => {
  server.close()
})