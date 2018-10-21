const supertest = require('supertest')
const { app, server } = require('../../index')
const api = supertest(app)

test('Pof backend works', async () => {
  await api
    .get('/filledpof')
    .expect(200)
})

test('Pof generation starts', async () => {
  await api
    .get('/filledpof/tarppo')
    .expect(409)
  const response = await api
    .get('/filledpof')
  expect(response.body.makingPof).toBe(true)
})

afterAll(() => {
  server.close()
})
