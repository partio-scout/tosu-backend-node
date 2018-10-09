const supertest = require('supertest')
const { app, server } = require('../../index')
const api = supertest(app)

test('Pof backend works', async () => {
  await api
    .get('/filledpof')
    .expect(200)
})

afterAll(() => {
  server.close()
})
