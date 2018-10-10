const models = require('../../domain/models')
const activityService = require('../../services/activityService')
require('../handleTestDatabase')

var scout
var buffer
var event
var activityWithEventId

beforeEach(async () => {
  scout = await models.Scout.create()
  buffer = await models.ActivityBuffer.create({ scoutId: scout.id })
  event = await models.Event.create({ scoutId: scout.id })
  activityWithEventId = await models.Activity.create({ eventId: event.id })
})

test('Delete activity', async () => {
  await activityService.deleteActivity(activityWithEventId.id)
  const result = await models.Activity.findById(activityWithEventId.id)
  expect(result).toBeNull()
})

test('Move activity from event to buffer', async () => {
  await activityService.moveActivityFromEventToBuffer(activityWithEventId.id, scout)

  // Activity is correct in the database
  await activityWithEventId.reload()
  expect(activityWithEventId.activityBufferId).toBe(buffer.id)
  expect(activityWithEventId.eventId).toBe(null)
})

test('Do not move activity from event to buffer when activity does not exist', async () => {
  await activityWithEventId.destroy()

  const result = await activityService.moveActivityFromEventToBuffer(activityWithEventId.id, scout)
  expect(result.error).not.toBeNull()
  expect(result.error).not.toBeUndefined()
})

test('Do not move activity from event to buffer when buffer does not exist', async () => {
  await buffer.destroy()

  const result = await activityService.moveActivityFromEventToBuffer(activityWithEventId.id, scout)
  expect(result.error).not.toBeNull()
  expect(result.error).not.toBeUndefined()
})

/*
test('Do not move activity from event to buffer when event does not exist', async () => {
  const event = await models.Event.create()
  const activity = await models.Activity.create()
  await event.destroy()

  const result = await activityService.moveActivityFromEventToBuffer(activity.id, scout)
  expect(result.error).not.toBeNull()
  expect(result.error).not.toBeUndefined()
})
*/

test('Move activity from buffer to event', async () => {
  const activity = await models.Activity.create({ activityBufferId: buffer.id })

  await activityService.moveActivityFromBufferToEvent(activity.id, event.id)

  // Activity is correct in the database
  await activity.reload()
  expect(activity.activityBufferId).toBe(null)
  expect(activity.eventId).toBe(event.id)
})

test('Do not move activity from buffer to event when activity does not exist', async () => {
  const activity = await models.Activity.create({ activityBufferId: buffer.id })
  await activity.destroy()
  
  const result = await activityService.moveActivityFromBufferToEvent(activity.id, event.id)
  expect(result.error).not.toBeNull()
  expect(result.error).not.toBeUndefined()
})

test('Do not move activity from buffer to event when event does not exist', async () => {
  const event = await models.Event.create()
  const activity = await models.Activity.create({ activityBufferId: buffer.id })
  await event.destroy()

  const result = await activityService.moveActivityFromBufferToEvent(activity.id, event.id)
  expect(result.error).not.toBeNull()
  expect(result.error).not.toBeUndefined()
})

test('Do not move activity from buffer to event when buffer does not exist', async () => {
  const activity = await models.Activity.create({ activityBufferId: buffer.id })
  await buffer.destroy()

  const result = await activityService.moveActivityFromBufferToEvent(activity.id, event.id)
  expect(result.error).not.toBeNull()
  expect(result.error).not.toBeUndefined()
})
