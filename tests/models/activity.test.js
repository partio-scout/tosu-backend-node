const supertest = require('supertest')
const sequelize = require('sequelize')
const models = require('../../domain/models')
require('../handleTestDatabase')

test('Activity can be created', async () => {
  // Create Activity with attributes
  const activity = await models.Activity.create({ guid: 'ghdfjkghdfjk' })
  expect(activity.guid).toBe('ghdfjkghdfjk')
  expect(Number.isInteger(activity.id)).toBe(true) // Is assigned an ID
})

test('Activity cannot be created without guid', async () => {
  await expect(models.Activity.create()).rejects.toThrow(sequelize.SequelizeValidationError)
})

test('Activity cannot be created with invalid guid', async () => {
  await expect(models.Activity.create({guid: '   '})).rejects.toThrow(sequelize.SequelizeValidationError)
})

test('Activity can be assigned to Event', async () => {
  const event = await models.Event.create({
    title: 'Let\'s go fishing!',
    startDate: '2018-09-23',
    endDate: '2018-09-23',
    startTime: '17:46:22.33',
    endTime: '18:44:05.795',
    type: 'Retki',
    information: 'Fishing fish',
  })
  const activity = await models.Activity.create({ guid: 'gfdjgfdgd', eventId: event.id })
  expect(activity.eventId).toBe(event.id)
})

test('Activity can be assigned to ActivityBuffer', async () => {
  const buffer = await models.ActivityBuffer.create()
  const activity = await models.Activity.create({ guid: 'gfdjgfdgd', activityBufferId: buffer.id })

  // Fetch Activity from database, and include its buffer
  const retrievedActivity = await models.Activity.findById(activity.id, {
    include: [models.ActivityBuffer]
  })

  expect(activity.activityBufferId).toBe(buffer.id)
  expect(retrievedActivity.ActivityBuffer.id).toBe(buffer.id) // Access included buffer (Note capitalization)
})

test('Activity can be assigned plans', async () => {
  const activity = await models.Activity.create({ guid: 'ghdfjkghdfjk' })

  // Assign Plan to Activity during creation
  const plan1 = await models.Plan.create({
    title: 'plan1',
    guid: 'gdfgdf',
    content: 'masterplan',
    activityId: activity.id
  })

  const plan2 = await models.Plan.create({ title: 'plan2', guid: 'fsdfdsfds', content: 'masterplan' })

  // Assign Plan to Activity after creation
  await plan2.update({ activityId: activity.id })

  // Find Activity's plans
  const retrievedActivity = await models.Activity.findById(activity.id, { include: [models.Plan] })
  expect(retrievedActivity.Plans.length).toBe(2)
  expect(retrievedActivity.Plans[0].content).toBe('masterplan')
})

test('Activities can be searched by event id', async () => {
  const event = await models.Event.create({
    title: 'Let\'s go fishing!',
    startDate: '2018-09-23',
    endDate: '2018-09-23',
    startTime: '17:46:22.33',
    endTime: '18:44:05.795',
    type: 'Retki',
    information: 'Fishing fish',
  })
  const activity1 = await models.Activity.create({ guid: 'gfdjgfdgd', eventId: event.id })
  const activity2 = await models.Activity.create({ guid: 'gfasg12', eventId: event.id })
  const events = await models.Activity.findByEvent(event)
  expect(events.length).toBe(2)
  if (events[0].id === activity1.id) {
    expect(events[0].id).toBe(activity1.id)
    expect(events[1].id).toBe(activity2.id)
  } else {
    expect(events[1].id).toBe(activity1.id)
    expect(events[0].id).toBe(activity2.id)
  }
})
