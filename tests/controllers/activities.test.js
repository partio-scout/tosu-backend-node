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

test('Delete activity', async () => {
  const activity = await models.Activity.create()
  await api.delete('/activities/' + activity.id)
  const found = await models.Activity.findById(activity.id)
  expect(found).toBe(null)
})

test('Move Activity from event to buffer', async () => {
  const scout = authScout
  const buffer = await models.ActivityBuffer.create({ scoutId: scout.id })
  const event = await models.Event.create()
  const activity = await models.Activity.create({ eventId: event.id })

  await authenticatedSession.get('/activities/' + activity.id + '/tobuffer')
    .then((result) => {
      // Returned activity is correct
      expect(result.body.activityBufferId).toBe(buffer.id)
      expect(result.body.eventId).toBe(null)
    })

  // Activity is correct in the database
  await activity.reload()
  expect(activity.activityBufferId).toBe(buffer.id)
  expect(activity.eventId).toBe(null)
})

afterAll(() => {
  server.close()
})
