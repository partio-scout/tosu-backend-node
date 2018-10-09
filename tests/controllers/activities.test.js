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
  cookie = testUtils.createScoutCookieWithId(scout.id)
})

// DELETE /activities/id

test('Delete activity', async () => {
  const event = await models.Event.create({ scoutId: scout.id })
  const activity = await models.Activity.create({ eventId: event.id }) // Scout owns activity

  await api
    .delete('/activities/' + activity.id)
    .set('cookie', [cookie])
    .expect(200)

  const found = await models.Activity.findById(activity.id)
  expect(found).toBe(null)
})

test('Cannot delete an activity that scout does not own', async () => {
  const otherScout = await models.Scout.create()
  const event = await models.Event.create({ scoutId: otherScout.id })
  const activity = await models.Activity.create({ eventId: event.id })

  await api
    .delete('/activities/' + activity.id)
    .set('cookie', [cookie])
    .expect(403)

  expect(await models.Activity.findById(activity.id)).not.toBe(null)
})

test('Invalid (noninteger) id is handled when trying to delete', async () => {
  await api
    .delete('/activities/hu4hlgd43kf')
    .set('cookie', [cookie])
    .expect(404)
})

// PUT /activities/id/tobuffer

test('Move activity from event to buffer', async () => {
  const buffer = await models.ActivityBuffer.create({ scoutId: scout.id })
  const event = await models.Event.create({ scoutId: scout.id })
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

test('Cannot move activity that scout does not own to buffer', async () => {
  const otherScout = await models.Scout.create()
  const buffer = await models.ActivityBuffer.create({ scoutId: scout.id })
  const event = await models.Event.create({ scoutId: otherScout.id })
  const activity = await models.Activity.create({ eventId: event.id })

  await api.put('/activities/' + activity.id + '/tobuffer')
    .set('cookie', [cookie])
    .expect(403)

  // Activity is correct in the database (nothing changed)
  await activity.reload()
  expect(activity.activityBufferId).toBe(null)
  expect(activity.eventId).toBe(event.id) // Still in otherScout's event, not stolen D:
})

test('Invalid (noninteger) id is handled when trying to move activity to buffer', async () => {
  await api
    .put('/activities/fjhsu4t8unv4dr/tobuffer')
    .set('cookie', [cookie])
    .expect(404)
})

// PUT /activities/id/toevent

test('Move activity from buffer to event', async () => {
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

test('Cannot move activity from buffer to event when scout does not own the buffer', async () => {
  const randomScout = await models.Scout.create()
  const buffer = await models.ActivityBuffer.create({ scoutId: scout.id })
  const randomScoutsBuffer = await models.ActivityBuffer.create({ scoutId: randomScout.id })
  const event = await models.Event.create()
  const activity = await models.Activity.create({ activityBufferId: randomScoutsBuffer.id })

  await api.put('/activities/' + activity.id + '/toevent/' + event.id)
    .set('cookie', [cookie])
    .expect(403)

  // Activity is correct in the database (nothing changed)
  await activity.reload()
  expect(activity.activityBufferId).toBe(randomScoutsBuffer.id)
  expect(activity.eventId).toBe(null)
})

test('Cannot move activity from buffer to event when event does not exist', async () => {
  const buffer = await models.ActivityBuffer.create({ scoutId: scout.id })
  const event = await models.Event.create()
  const deletedEventId = event.id
  await event.destroy()
  const activity = await models.Activity.create({ activityBufferId: buffer.id })

  await api.put('/activities/' + activity.id + '/toevent/' + deletedEventId)
    .set('cookie', [cookie])
    .expect(500)

  // Activity is correct in the database (nothing changed)
  await activity.reload()
  expect(activity.activityBufferId).toBe(buffer.id)
  expect(activity.eventId).toBe(null)
})

test('Invalid (noninteger) id is handled when trying to move activity to event', async () => {
  const buffer = await models.ActivityBuffer.create({ scoutId: scout.id })
  const event = await models.Event.create()
  const activity = await models.Activity.create({ activityBufferId: buffer.id })

  await api
    .put('/activities/jfsom48m/toevent/fhsu3')
    .set('cookie', [cookie])
    .expect(404)

  await api
    .put('/activities/' + activity.id + '/toevent/fhsu3')
    .set('cookie', [cookie])
    .expect(404)

  await api
    .put('/activities/gs4gf/toevent/' + buffer.id)
    .set('cookie', [cookie])
    .expect(404)
})

// POST /activities/id/plan

test('Add plan to activity', async () => {
  const event = await models.Event.create({ scoutId: scout.id })
  const activity = await models.Activity.create({ eventId: event.id }) // Scout owns activity
  const plan = {
    title: 'Plänni',
    guid: 'gfjggrdgd',
    content: 'semmosta ja tämmöstä'
  }

  await api.post('/activities/' + activity.id + '/plan')
    .set('cookie', [cookie])
    .send(plan)
    .expect(200)
    .then((result) => {
      // Returned plan is correct
      expect(result.body.title).toBe('Plänni')
      expect(result.body.guid).toBe('gfjggrdgd')
      expect(result.body.content).toBe('semmosta ja tämmöstä')
    })
})

test('Does not add plan to activity scout does not own', async () => {
  const otherScout = await models.Scout.create()
  const event = await models.Event.create({ scoutId: otherScout.id })
  const activity = await models.Activity.create({ eventId: event.id }) // Scout does not own activity
  const plan = {
    title: 'Plänni',
    guid: 'gfjggrdgd',
    content: 'semmosta ja tämmöstä'
  }

  await api.post('/activities/' + activity.id + '/plan')
    .set('cookie', [cookie])
    .send(plan)
    .expect(403)
})

test('Invalid (noninteger) id is handled when trying to add plan to activity', async () => {
  await api
    .post('/activities/gd5ybfhf7ik/plan')
    .set('cookie', [cookie])
    .expect(404)
})
