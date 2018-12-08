const models = require('../../domain/models')
const prepareService = require('../../services/prepareService')
require('../handleTestDatabase')



var scout
var eventData
var event

beforeEach(async () => {
  scout = await models.Scout.create()
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
  buffer = await models.ActivityBuffer.create({ scoutId: scout.id })
})

test('Prepare a buffer to be front-end friendly returns activities', async () => {
  await models.Activity.create({ guid:'kattila', activityBufferId: buffer.id})
  await models.Activity.create({ guid:'paistinpannu', activityBufferId: buffer.id})
  await models.Activity.create({ guid:'tosu', activityBufferId: buffer.id})
  const result = await prepareService.prepareBuffer(buffer)
  expect(result.activities.length).toBe(3)
})

test('Prepare a buffer to be front-end friendly returns plans', async () => {
  const activity = await models.Activity.create({ guid:'joulukuusi', activityBufferId: buffer.id})
  await models.Plan.create({
    title: 'Quaint plan',
    guid: 'jgkdflhgjfkld',
    content: 'Do this and that',
    activityId: activity.id
  })
  await models.Plan.create({
    title: 'Quaint plan',
    guid: 'jgkdflhgjfkld',
    content: 'Do this and that',
    activityId: activity.id
  })
  await models.Plan.create({
    title: 'Quaint plan',
    guid: 'jgkdflhgjfkld',
    content: 'Do this and that',
    activityId: activity.id
  })
  await models.Plan.create({
    title: 'Quaint plan',
    guid: 'jgkdflhgjfkld',
    content: 'Do this and that',
    activityId: activity.id
  })
  const result = await prepareService.prepareBuffer(buffer)
  expect(result.activities.length).toBe(1)
  expect(result.activities[0].plans.length).toBe(4)
})

test('Prepare a buffer to be front-end returns null when buffer is null', async () => {
  const result = await prepareService.prepareBuffer(null)
  expect(result).toBeNull()
})


test('Prepare activity to be front-end friendly', async () => {
  const activity = await models.Activity.create({guid: 'lahja'})
  await models.Plan.create({
    title: 'Quaint plan',
    guid: 'jgkdflhgjfkld',
    content: 'Do this and that',
    activityId: activity.id
  })
  await models.Plan.create({
    title: 'Quaint plan',
    guid: 'jgkdflhgjfkld',
    content: 'Do this and that',
    activityId: activity.id
  })
  const result = await prepareService.prepareActivity(activity)
  expect(result.plans.length).toBe(2)
})


test('Prepare an activity to be front-end returns null when activity is null', async () => {
  const result = await prepareService.prepareActivity(null)
  expect(result).toBeNull()
})


test('Prepare an event front-end friendly returns activities', async () => {
  await models.Activity.create({ guid:'paketti', eventId: event.id})
  await models.Activity.create({ guid:'joulupukki', eventId: event.id})
  await models.Activity.create({ guid:'joulumaa', eventId: event.id})
  const result = await prepareService.prepareEvent(event)
  expect(result.activities.length).toBe(3)
})

test('Prepare an event to be front-end friendly returns plans', async () => {
  const activity = await models.Activity.create({ guid:'test', eventId: event.id})
  await models.Plan.create({
    title: 'Quaint plan',
    guid: 'jgkdflhgjfkld',
    content: 'Do this and that',
    activityId: activity.id
  })
  await models.Plan.create({
    title: 'Quaint plan',
    guid: 'jgkdflhgjfkld',
    content: 'Do this and that',
    activityId: activity.id
  })
  const result = await prepareService.prepareEvent(event)
  expect(result.activities.length).toBe(1)
  expect(result.activities[0].plans.length).toBe(2)
})


test('Prepare an array of events to be front-end friendly works', async () => {
  await models.Activity.create({ guid:'yhteismaa', eventId: event.id})
  await models.Activity.create({ guid:'sattuma', eventId: event.id})
  await models.Activity.create({ guid:'vankila', eventId: event.id})
  await models.Activity.create({ guid:'maali', eventId: event.id})
  const result = await prepareService.prepareEvents([event])
  expect(result[0].activities.length).toBe(4)
})


test('Prepare an event to be front-end returns null when event is null', async () => {
  const result = await prepareService.prepareEvent(null)
  expect(result).toBeNull()
})