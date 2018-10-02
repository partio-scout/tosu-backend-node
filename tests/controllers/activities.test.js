const supertest = require('supertest')
const mockSession = require('mock-session')
const Keygrip = require("keygrip")
const { app, server } = require('../../index')
const api = supertest(app)

const models = require('../../domain/models')
require('../handleTestDatabase')

test('Delete activity', async () => {
  const activity = await models.Activity.create()
  await api.delete('/activities/' + activity.id)
  const found = await models.Activity.findById(activity.id)
  expect(found).toBe(null)
})

test('Move Activity from event to buffer', async () => {
  const scout = await models.Scout.create()
  const buffer = await models.ActivityBuffer.create({ scoutId: scout.id })
  const event = await models.Event.create()
  const activity = await models.Activity.create({ eventId: event.id })

  let cookie = mockSession('session', process.env.SECRET_KEY, {
    "scout": { "id": scout.id }
  })

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
