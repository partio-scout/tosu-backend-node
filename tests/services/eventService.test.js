const models = require('../../domain/models')
const eventService = require('../../services/eventService')
require('../handleTestDatabase')

var scout
var eventData
var event

beforeEach(async () => {
  scout = await models.Scout.create({ googleId: 'googleiidee', name: 'GoogleId' })
  eventData = { 
    scoutId: scout.id, 
    startDate: '2500-10-10',
    endDate: '2501-10-10',
    startTime: '00:00',
    endTime: '00:00',
    title: 'Eventti',
    type: 'leiri',
    information: '',
  }
  event = await models.Event.create(eventData)
})

test('Get all events', async () => {
  const events = await eventService.getAllEvents(scout.id)
  expect(events.length).toBe(1)
  expect(events[0].id).toBe(event.id)
})

test('getAllEvents returns the activities of the event and the plans of the activities', async () => {
  const activity = await models.Activity.create({  guid: 'justiinsa', eventId: event.id})
  const plan = await models.Plan.create({
    title: 'Quaint plan',
    guid: 'jgkdflhgjfkld',
    content: 'Do this and that',
    activityId: activity.id
  })
  const events = await eventService.getAllEvents(scout.id)
  expect(events.length).toBe(1)
  expect(events[0].activities.length).toBe(1)
  expect(events[0].activities[0].id).toBe(activity.id)
  expect(events[0].activities[0].plans.length).toBe(1)
  expect(events[0].activities[0].plans[0].id).toBe(plan.id)
})

test('Create an event', async () => {
  eventData.title='Asdf'
  const newEvent = await eventService.createEvent(scout.id, eventData)
  expect(newEvent.title).toBe('Asdf')
  expect(newEvent.activities.length).toBe(0)
  const dbEvent = await models.Event.findById(newEvent.id)
  expect(dbEvent.id).toBe(newEvent.id)
  expect(dbEvent.title).toBe('Asdf')
})

test('Update an event', async () => {
  eventData.title='Asdf'
  const updatedEvent = await eventService.updateEvent(event.id, eventData)
  expect(updatedEvent.id).toBe(event.id)
  expect(updatedEvent.title).toBe('Asdf')
  const dbEvent = await models.Event.findById(event.id)
  expect(dbEvent.title).toBe('Asdf')
})

test('updateEvent returns the activities of the event and the plans of the activities', async () => {
  const activity = await models.Activity.create({ guid: 'kauha', eventId: event.id})
  const plan = await models.Plan.create({
    title: 'Quaint plan',
    guid: 'jgkdflhgjfkld',
    content: 'Do this and that',
    activityId: activity.id
  })
  const updatedEvent = await eventService.updateEvent(event.id, {title: 'Asdf'})
  expect(updatedEvent.activities.length).toBe(1)
  expect(updatedEvent.activities[0].id).toBe(activity.id)
  expect(updatedEvent.activities[0].plans.length).toBe(1)
  expect(updatedEvent.activities[0].plans[0].id).toBe(plan.id)
})

test('Add activity to an event', async () => {
  const activity = await eventService.addActivityToEvent(event.id, {guid: 'asgasg'})
  const dbActivity = await models.Activity.findById(activity.id)
  expect(activity.eventId).toBe(event.id)
  expect(activity.guid).toBe('asgasg')
  expect(activity.plans.length).toBe(0)
  expect(dbActivity.eventId).toBe(event.id)
  expect(dbActivity.guid).toBe('asgasg')
})

test('Do not add activity to an event when the event does not exist', async () => {
  const result = await eventService.addActivityToEvent(-555, {guid: 'asgasg'})
  expect(result.error).not.toBeNull()
  expect(result.error).not.toBeUndefined()
})


test('Delete an event', async () => {
  const result = await eventService.deleteEvent(event.id)
  expect(result).toBe(true)
  expect(await models.Event.findById(event.id)).toBeNull()
})


