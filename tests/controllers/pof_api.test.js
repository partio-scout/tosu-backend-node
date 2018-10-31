const supertest = require('supertest')
const { app, server } = require('../../index')
const api = supertest(app)

test('Pof backend works', async () => {
  await api
    .get('/filledpof')
    .expect(200)
  const response = await api
    .get('/filledpof')
  expect(response.body.makingPof).toBe(false)
})

test('Get tarpojaohjelma', async () => {
  const response = await api
    .get('/filledpof/test')
    .expect(200)
  expect(response.body.title).toBe('Tarpojat (12-15v.)')
})

test('Get from cache', async () => {
  const response = await api
    .get('/filledpof/tarppo')
    .expect(200)
  expect(response.body.title).toBe('Tarpojat (12-15v.)')
})

test('Get details', async () => {
  const response = await api
    .get('/filledpof/tarppo')
    .expect(200)
  expect(response.body.taskgroups[0].tasks[0].type).toBe('task')
})

test('Get suggestions', async () => {
  const response = await api
    .get('/filledpof/tarppo')
    .expect(200)
  expect(response.body.taskgroups[0].tasks[0].suggestions_details.length > 1).toBe(true)
})

afterAll(() => {
  server.close()
})
