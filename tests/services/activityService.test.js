const models = require('../../domain/models')
const activityService = require('../../services/activityService')
require('../handleTestDatabase')

var scout
var buffer
var eventData
var event
var activityWithEventId

beforeEach(async () => {
  scout = await models.Scout.create()
  buffer = await models.ActivityBuffer.create({ scoutId: scout.id })
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
  activityWithEventId = await models.Activity.create({ guid: 'asjd', eventId: event.id })
})

test('Delete activity', async () => {
  await activityService.deleteActivity(activityWithEventId.id)
  const result = await models.Activity.findById(activityWithEventId.id)
  expect(result).toBeNull()
})

test('Move activity from event to buffer', async () => {
  const movedActivity = await activityService.moveActivityFromEventToBuffer(activityWithEventId.id, scout)
  // Returned activity is correct
  expect(movedActivity.id).toBe(activityWithEventId.id)
  expect(movedActivity.activityBufferId).toBe(buffer.id)
  expect(movedActivity.eventId).toBe(null)
  // Activity is correct in the database
  await activityWithEventId.reload()
  expect(activityWithEventId.activityBufferId).toBe(buffer.id)
  expect(activityWithEventId.eventId).toBe(null)
})

test('Move activity from event to buffer keeps and returns the plans of the activity', async () => {
  const plan = await models.Plan.create({
    title: "Quaint plan",
    guid: "jgkdflhgjfkld",
    content: "Do this and that",
    activityId: activityWithEventId.id
  })
  const movedActivity = await activityService.moveActivityFromEventToBuffer(activityWithEventId.id, scout)

  expect(movedActivity.plans.length).toBe(1)
  expect(movedActivity.plans[0].id).toBe(plan.id)
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
  const activity = await models.Activity.create({ guid: 'giug', activityBufferId: buffer.id })

  const movedActivity = await activityService.moveActivityFromBufferToEvent(activity.id, event.id)
  // Returned activity is correct
  expect(movedActivity.id).toBe(activity.id)
  expect(movedActivity.activityBufferId).toBe(null)
  expect(movedActivity.eventId).toBe(event.id)
  // Activity is correct in the database
  await activity.reload()
  expect(activity.activityBufferId).toBe(null)
  expect(activity.eventId).toBe(event.id)
})

test('Move activity from buffer to event keeps and returns the plans of the activity', async () => {
  const activity = await models.Activity.create({ guid: 'diud', activityBufferId: buffer.id })
  const plan = await models.Plan.create({
    title: "Quaint plan",
    guid: "jgkdflhgjfkld",
    content: "Do this and that",
    activityId: activity.id
  })
  const movedActivity = await activityService.moveActivityFromBufferToEvent(activity.id, event.id)

  expect(movedActivity.plans.length).toBe(1)
  expect(movedActivity.plans[0].id).toBe(plan.id)
})

test('Do not move activity from buffer to event when activity does not exist', async () => {
  const activity = await models.Activity.create({ guid:'epweir', activityBufferId: buffer.id })
  await activity.destroy()
  
  const result = await activityService.moveActivityFromBufferToEvent(activity.id, event.id)
  expect(result.error).not.toBeNull()
  expect(result.error).not.toBeUndefined()
})

test('Do not move activity from buffer to event when event does not exist', async () => {
  const activity = await models.Activity.create({ guid: 'wehr', activityBufferId: buffer.id })
  await event.destroy()

  const result = await activityService.moveActivityFromBufferToEvent(activity.id, event.id)
  expect(result.error).not.toBeNull()
  expect(result.error).not.toBeUndefined()
})

test('Do not move activity from buffer to event when buffer does not exist', async () => {
  const activity = await models.Activity.create({  guid: 'osieaj', activityBufferId: buffer.id })
  await buffer.destroy()

  const result = await activityService.moveActivityFromBufferToEvent(activity.id, event.id)
  expect(result.error).not.toBeNull()
  expect(result.error).not.toBeUndefined()
})
