const { app, server } = require('../../index')
const supertest = require('supertest')
const api = supertest(app)
const models = require('../../domain/models')
const testUtils = require('../testUtils')
require('../handleTestDatabase')

var scout
var cookie
var eventData
var tosu

beforeEach(async () => {
  await models.Scout.remove({})
  await models.Event.remove({})
  await models.Tosu.remove({})
  scout = await models.Scout.create({
    googleId: 'googleiidee',
    name: 'GoogleId'
  })
  tosu = await models.Tosu.create({ scoutId: scout.id, name: 'tarpojat' })
  cookie = testUtils.createScoutCookieWithId(scout.id)
  eventData = {
    tosuId: tosu.id,
    startDate: '2500-10-10',
    endDate: '2501-10-10',
    startTime: '12:11:54',
    endTime: '15:18:11',
    title: 'Eventti',
    type: 'leiri',
    information: 'kgeqwg aogqa olgao e'
  }
})

test('Test get events', async () => {
  await models.Event.create(eventData)
  await models.Event.create(eventData)

  await api
    .get(`/events/${tosu.id}`)
    .set('cookie', [cookie])
    .expect('Content-Type', /json/)
    .then(result => {
      expect(result.body.length).toBe(2)
      expect(result.body[0].tosuId).toBe(tosu.id)
      expect(result.body[1].tosuId).toBe(tosu.id)
      expect(result.body[0].title).toBe(eventData.title)
      expect(result.body[1].title).toBe(eventData.title)
    })
})

test('Test that no event are returned on get events when there are none.', async () => {
  await api
    .get(`/events/${tosu.id}`)
    .set('cookie', [cookie])
    .expect('Content-Type', /json/)
    .then(result => {
      expect(result.body.length).toBe(0)
    })
})

test('Create an event', async () => {
  const result = await api
    .post('/events')
    .send(eventData)
    .set('cookie', [cookie])
    .expect('Content-Type', /json/)
    .expect(201)
  expect(result.body.title).toBe(eventData.title)
  expect(result.body.startDate).toBe(eventData.startDate)
  expect(result.body.startTime).toBe(eventData.startTime)
  expect(result.body.endDate).toBe(eventData.endDate)
  expect(result.body.endTime).toBe(eventData.endTime)
  expect(result.body.type).toBe(eventData.type)
  expect(result.body.information).toBe(eventData.information)
  expect(result.body.tosuId).toBe(tosu.id)
  const eventId = result.body.id

  const dbEvent = await models.Event.findById(eventId)

  expect(dbEvent.title).toBe(eventData.title)
  expect(dbEvent.startDate).toBe(eventData.startDate)
  expect(dbEvent.endDate).toBe(eventData.endDate)
  expect(dbEvent.startTime).toBe(eventData.startTime)
  expect(dbEvent.endTime).toBe(eventData.endTime)
  expect(dbEvent.type).toBe(eventData.type)
  expect(dbEvent.information).toBe(eventData.information)
  expect(dbEvent.tosuId).toBe(tosu.id)
})

test('Cannot get events when not logged in', async () => {
  await api.post('/events').expect(403)
})

test('Update event', async () => {
  const event = await models.Event.create(eventData)
  const result = await api
    .put('/events/' + event.id)
    .send({
      title: 'EGasg',
      startDate: '2018-10-19',
      startTime: '15:12:42',
      endDate: '2018-10-20',
      endTime: '21:51:33',
      type: 'Retki',
      information: 'eHGAOSGaoe gaEGo',
      tosuId: tosu.id
    })
    .set('cookie', [cookie])
    .expect('Content-Type', /json/)
    .expect(200)
  expect(result.body.title).toBe('EGasg')
  expect(result.body.startDate).toBe('2018-10-19')
  expect(result.body.startTime).toBe('15:12:42')
  expect(result.body.endDate).toBe('2018-10-20')
  expect(result.body.endTime).toBe('21:51:33')
  expect(result.body.type).toBe('Retki')
  expect(result.body.information).toBe('eHGAOSGaoe gaEGo')
  expect(result.body.tosuId).toBe(tosu.id)
  expect(result.body.activities.length).toBe(0)
  const eventId = result.body.id

  const dbEvent = await models.Event.findById(eventId)
  expect(dbEvent.title).toBe('EGasg')
  expect(dbEvent.startDate).toBe('2018-10-19')
  expect(dbEvent.endDate).toBe('2018-10-20')
  expect(dbEvent.startTime).toBe('15:12:42')
  expect(dbEvent.endTime).toBe('21:51:33')
  expect(dbEvent.type).toBe('Retki')
  expect(dbEvent.information).toBe('eHGAOSGaoe gaEGo')
  expect(dbEvent.tosuId).toBe(tosu.id)
})

test('Cannot update an event that is not owned', async () => {
  const anotherScout = await models.Scout.create({
    partioId: '1234',
    name: 'PartioId'
  })
  const anotherTosu = await models.Tosu.create({
    scoutId: anotherScout.id,
    name: 'Sudarit'
  })
  eventData.tosuId = anotherTosu.id
  const event = await models.Event.create(eventData)
  await api
    .put('/events/' + event.id)
    .send({
      title: 'EGasg'
    })
    .set('cookie', [cookie])
    .expect(403)
})

test('Cannot update event when not logged in', async () => {
  await api.put('/events/4').expect(403)
})

test('Test add activity to event', async () => {
  const event = await models.Event.create(eventData)
  const result = await api
    .post('/events/' + event.id + '/activities')
    .set('cookie', [cookie])
    .send({
      guid: 'asgas'
    })
    .expect(200)
  expect(result.body.eventId).toBe(event.id)
  expect(result.body.guid).toBe('asgas')
  const dbActivity = await models.Activity.findById(result.body.id)
  expect(dbActivity.eventId).toBe(event.id)
  expect(dbActivity.guid).toBe('asgas')
})

test('Cannot add activity to a event that is not owned', async () => {
  const anotherScout = await models.Scout.create({
    partioId: '1234',
    name: 'PartioId'
  })
  const anotherTosu = await models.Tosu.create({
    scoutId: anotherScout.id,
    name: 'sudarit'
  })
  eventData.tosuId = anotherTosu.id
  const event = await models.Event.create(eventData)
  await api
    .post('/events/' + event.id + '/activities')
    .set('cookie', [cookie])
    .send({
      guid: 'asgas'
    })
    .expect(403)
})

test('Delete event', async () => {
  const event = await models.Event.create(eventData)

  const result = await api
    .delete('/events/' + event.id)
    .set('cookie', [cookie])
    .expect(200)
  expect(result.body.id).toBe(event.id)
  expect(result.body.title).toBe(event.title)

  const dbEvent = await models.Event.findById(event.id)
  expect(dbEvent).toBe(null)
})

test('Cannot delete an event that is not owned', async () => {
  const anotherScout = await models.Scout.create({
    partioId: '1234',
    name: 'PartioId'
  })
  const anotherTosu = await models.Tosu.create({
    scoutId: anotherScout.id,
    name: 'Sudarit'
  })
  eventData.tosuId = anotherTosu.id
  const event = await models.Event.create(eventData)

  await api
    .delete('/events/' + event.id)
    .send({
      title: 'EGasg'
    })
    .set('cookie', [cookie])
    .expect(403)
})

test('Cannot delete event when not logged in', async () => {
  await api.delete('/events/456').expect(403)
})

test('Invalid (noninteger) event id is handled properly when trying to update', async () => {
  await api
    .put('/events/asgGShG!')
    .send({
      title: 'EGasg'
    })
    .set('cookie', [cookie])
    .expect(400)
})

test('Invalid (noninteger) event id is handled properly when trying add an activity to event', async () => {
  await api
    .post('/events/GSGaghhq/activities')
    .send({
      guid: 'EGasg'
    })
    .set('cookie', [cookie])
    .expect(400)
})

test('Invalid (noninteger) event id is handled properly when trying to delete', async () => {
  await api
    .delete('/events/GSGaghhq')
    .set('cookie', [cookie])
    .expect(400)
})

// GET /events returns a list of users events
// Check that the activities of the events and the the plans for the activities are also returned
test('Activities and the plans of activities are returned on GET /events', async () => {
  const event = await models.Event.create(eventData)
  const activity = await models.Activity.create({
    guid: 'spagetti',
    eventId: event.id
  })
  const plan = await models.Plan.create({
    title: 'Quaint plan',
    guid: 'jgkdflhgjfkld',
    content: 'Do this and that',
    activityId: activity.id
  })
  const result = await api
    .get(`/events/${tosu.id}`)
    .set('cookie', [cookie])
    .expect('Content-Type', /json/)
    .expect(200)
  expect(result.body.length).toBe(1)
  expect(result.body[0].activities.length).toBe(1)
  expect(result.body[0].activities[0].id).toBe(activity.id)
  expect(result.body[0].activities[0].plans.length).toBe(1)
  expect(result.body[0].activities[0].plans[0].id).toBe(plan.id)
})

// PUT /events/:eventId edits an event and returns the edited event
// Check that the returned event has .activities
test('Activities and the plans of activities are returned on PUT /events/:eventId', async () => {
  const event = await models.Event.create(eventData)
  const activity = await models.Activity.create({
    guid: 'temppu',
    eventId: event.id
  })
  const plan = await models.Plan.create({
    title: 'Quaint plan',
    guid: 'jgkdflhgjfkld',
    content: 'Do this and that',
    activityId: activity.id
  })
  const result = await api
    .put('/events/' + event.id)
    .send({
      title: 'EGasg'
    })
    .set('cookie', [cookie])
    .expect('Content-Type', /json/)
    .expect(200)
  expect(result.body.activities.length).toBe(1)
  expect(result.body.activities[0].id).toBe(activity.id)
  expect(result.body.activities[0].plans.length).toBe(1)
  expect(result.body.activities[0].plans[0].id).toBe(plan.id)
})

// POST /events/:eventId/activities adds activity to an event and returns the activity
// test that there is a field for plans in the returned activity
test('Plans are returned on POST /events/:eventId/activities', async () => {
  const event = await models.Event.create(eventData)
  const activity = await models.Activity.create({
    guid: 'puuro',
    eventId: event.id
  })
  await models.Plan.create({
    title: 'Quaint plan',
    guid: 'jgkdflhgjfkld',
    content: 'Do this and that',
    activityId: activity.id
  })
  const result = await api
    .post('/events/' + event.id + '/activities')
    .send({ guid: 'asgas' })
    .set('cookie', [cookie])
    .expect('Content-Type', /json/)
    .expect(200)
  expect(result.body.plans.length).toBe(0)
})

// DELETE /events/:eventId deletes an activity
// test that the activities of the event are returned also
test('Plans are returned on DELETE /events/:eventId/activities', async () => {
  const event = await models.Event.create(eventData)
  const activity = await models.Activity.create({
    guid: 'nugetti',
    eventId: event.id
  })
  const plan = await models.Plan.create({
    title: 'Quaint plan',
    guid: 'jgkdflhgjfkld',
    content: 'Do this and that',
    activityId: activity.id
  })
  const result = await api
    .delete('/events/' + event.id)
    .set('cookie', [cookie])
    .expect('Content-Type', /json/)
    .expect(200)
  expect(result.body.activities.length).toBe(1)
  expect(result.body.activities[0].id).toBe(activity.id)
  expect(result.body.activities[0].plans.length).toBe(1)
  expect(result.body.activities[0].plans[0].id).toBe(plan.id)
})
