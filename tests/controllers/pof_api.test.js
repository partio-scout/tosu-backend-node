const supertest = require('supertest')
const { app, server } = require('../../index')
const api = supertest(app)

test('Pof backend works', async () => {
  await api
    .get('/filledpof')
    .expect(200)
})

test('Backend returns JSON', async () => {
  await api
    .get('/filledpof/tarppo')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('Backend returns tarpojat data', async () => {
  const response = await api
    .get('/filledpof/tarppo')
  expect(response.body.title).toBe('Tarpojat (12-15v.)')
})

afterAll(() => {
  server.close()
})
