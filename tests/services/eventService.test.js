const models = require('../../domain/models')
const eventService = require('../../services/eventService')
require('../handleTestDatabase')

var scout
var event

beforeEach(async () => {
  scout = await models.Scout.create()
  event = await models.Event.create({ scoutId: scout.id })
})

test('Test getAllEvents', async () => {
  const events = await eventService.getAllEvents(scout.id)
  expect(events.length).toBe(1)
  expect(events[0].id).toBe(event.id)
})

test('Test create event', async () => {
  const newEvent = await eventService.createEvent(scout.id, {title:'Asdf'})
  expect(newEvent.title).toBe('Asdf')
  const dbEvent = await models.Event.findById(newEvent.id)
  expect(dbEvent.id).toBe(newEvent.id)
  expect(dbEvent.title).toBe('Asdf')
})

test('Test update event', async () => {
  const updatedEvent = await eventService.updateEvent(event.id, {title: 'Asdf'})
  expect(updatedEvent.id).toBe(event.id)
  expect(updatedEvent.title).toBe('Asdf')
  const dbEvent = await models.Event.findById(event.id)
  expect(dbEvent.title).toBe('Asdf')
})

test('Test add activity to event', async () => {
  const activity = await eventService.addActivityToEvent(event.id, {guid: 'asgasg'})
  const dbActivity = await models.Activity.findById(activity.id)
  expect(activity.eventId).toBe(event.id)
  expect(activity.guid).toBe('asgasg')
  expect(dbActivity.eventId).toBe(event.id)
  expect(dbActivity.guid).toBe('asgasg')
})


test('Delete event', async () => {
  const result = await eventService.deleteEvent(event.id)
  expect(result).toBe(true)
  expect(await models.Event.findById(event.id)).toBeNull()
})
