const supertest = require('supertest')
const { app, server } = require('../../index')
const api = supertest(app)

const models = require('../../domain/models')
const testUtils = require('../testUtils')
require('../handleTestDatabase')

var scout
var cookie

beforeEach(async () => {
  scout = await models.Scout.create()
  cookie = testUtils.createCookie({ "scout": { "id": scout.id } })
})

test('Delete activity', async () => {
  const activity = await models.Activity.create()
  await api.delete('/activities/' + activity.id)
  const found = await models.Activity.findById(activity.id)
  expect(found).toBe(null)
})

test('Move Activity from event to buffer', async () => {
  const buffer = await models.ActivityBuffer.create({ scoutId: scout.id })
  const event = await models.Event.create()
  const activity = await models.Activity.create({ eventId: event.id })

  await api.put('/activities/' + activity.id + '/tobuffer')
    .set('cookie', [cookie])
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

test('Move Activity from buffer to event', async () => {
  const buffer = await models.ActivityBuffer.create({ scoutId: scout.id })
  const event = await models.Event.create()
  const activity = await models.Activity.create({ activityBufferId: buffer.id })

  await api.put('/activities/' + activity.id + '/toevent/' + event.id)
    .set('cookie', [cookie])
    .then((result) => {
      // Returned activity is correct
      expect(result.body.activityBufferId).toBe(null)
      expect(result.body.eventId).toBe(event.id)
    })

  // Activity is correct in the database
  await activity.reload()
  expect(activity.activityBufferId).toBe(null)
  expect(activity.eventId).toBe(event.id)
})
