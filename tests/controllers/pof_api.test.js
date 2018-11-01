const supertest = require('supertest')
const { app, server } = require('../../index')
const api = supertest(app)
var response

beforeAll( async () => {
  jest.setTimeout(30000)
  response = await api.get('/filledpof/test')
})

test('Pof backend works', async () => {
  await api
    .get('/filledpof')
    .expect(200)
  const response = await api
    .get('/filledpof')
  expect(response.body.makingPof).toBe(false)
})

test('Get tarpojaohjelma', async () => {
  expect(response.body.title).toBe('Tarpojat (12-15v.)')
})

test('Get from cache', async () => {
  const cache = await api
    .get('/filledpof/tarppo')
    .expect(200)
  expect(cache.body.title).toBe('Tarpojat (12-15v.)')
})

test('Get details', async () => {
  expect(response.body.taskgroups[0].tasks[0].type).toBe('task')
})

test('Get suggestions', async () => {
  expect(response.body.taskgroups[0].tasks[0].suggestions_details.length > 1).toBe(true)
})

test('Get paussit', async () => {
  expect(response.body.taskgroups[1].taskgroups[0].taskgroups[0].tasks[0].task_term.name).toBe('paussi')
})

afterAll(() => {
  server.close()
})
