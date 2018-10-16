const models = require('../../domain/models')
const eventService = require('../../services/eventService')
require('../handleTestDatabase')

var scout
var event

beforeEach(async () => {
  scout = await models.Scout.create()
  event = await models.Event.create({ scoutId: scout.id })
})

test('Get all events', async () => {
  const events = await eventService.getAllEvents(scout.id)
  expect(events.length).toBe(1)
  expect(events[0].id).toBe(event.id)
})

test('Get all events returns activities assigned to events', async () => {
  const events = await eventService.getAllEvents(scout.id)
  expect(events.length).toBe(1)
  expect(events[0].id).toBe(event.id)
})

test('Create an event', async () => {
  const newEvent = await eventService.createEvent(scout.id, {title:'Asdf'})
  expect(newEvent.title).toBe('Asdf')
  const dbEvent = await models.Event.findById(newEvent.id)
  expect(dbEvent.id).toBe(newEvent.id)
  expect(dbEvent.title).toBe('Asdf')
})

test('Update an event', async () => {
  const updatedEvent = await eventService.updateEvent(event.id, {title: 'Asdf'})
  expect(updatedEvent.id).toBe(event.id)
  expect(updatedEvent.title).toBe('Asdf')
  const dbEvent = await models.Event.findById(event.id)
  expect(dbEvent.title).toBe('Asdf')
})

test('Add activity to an event', async () => {
  const activity = await eventService.addActivityToEvent(event.id, {guid: 'asgasg'})
  const dbActivity = await models.Activity.findById(activity.id)
  expect(activity.eventId).toBe(event.id)
  expect(activity.guid).toBe('asgasg')
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



test('Prepare an event front-end friendly', async () => {
  await models.Activity.create({eventId: event.id})
  await models.Activity.create({eventId: event.id})
  await models.Activity.create({eventId: event.id})
  const result = await eventService.prepareEvent(event)
  expect(result.activities.length).toBe(3)
})


test('Prepare an array of events front-end friendly', async () => {
  await models.Activity.create({eventId: event.id})
  await models.Activity.create({eventId: event.id})
  await models.Activity.create({eventId: event.id})
  await models.Activity.create({eventId: event.id})
  const result = await eventService.prepareEvents([event])
  expect(result[0].activities.length).toBe(4)
})
