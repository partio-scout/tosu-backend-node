const models = require('../../domain/models')
const verifyService = require('../../services/verifyService')
require('../handleTestDatabase')

var eventData
var scoutOwner
var scoutImposter
var event
var buffer
var activityInEvent
var activityInBuffer

beforeEach(async () => {
  scoutOwner = await models.Scout.create({ googleId: 'googleiidee', name: 'GoogleId' })
  scoutImposter = await models.Scout.create({ partioId: '1234', name: 'PartioId' })
  eventData = { 
    scoutId: scoutOwner.id, 
    startDate: '2500-10-10',
    endDate: '2501-10-10',
    startTime: '00:00',
    endTime: '00:00',
    title: 'Eventti',
    type: 'leiri',
    information: '',
  }
  event = await models.Event.create(eventData)
  buffer = await models.ActivityBuffer.create({ scoutId: scoutOwner.id })
  activityInEvent = await models.Activity.create({ guid:'monopoli', eventId: event.id })
  activityInBuffer = await models.Activity.create({ guid:'sp',  activityBufferId: buffer.id })
})


test('Verify scout owns activity through event', async () => {
  expect(await verifyService.scoutOwnsActivity(scoutOwner, activityInEvent.id)).toBe(true)
  expect(await verifyService.scoutOwnsActivity(scoutImposter, activityInEvent.id)).toBe(false)
})

test('Verify scout owns activity through buffer', async () => {
  expect(await verifyService.scoutOwnsActivity(scoutOwner, activityInBuffer.id)).toBe(true)
  expect(await verifyService.scoutOwnsActivity(scoutImposter, activityInBuffer.id)).toBe(false)
})

test('Verify scout does not own activity when scout or activity does not exist', async () => {
  const id = activityInEvent.id
  await activityInEvent.destroy()

  expect(await verifyService.scoutOwnsActivity(scoutOwner, id)).toBe(false)
  expect(await verifyService.scoutOwnsActivity(scoutOwner, null)).toBe(false)
  expect(await verifyService.scoutOwnsActivity(null, id)).toBe(false)
  expect(await verifyService.scoutOwnsActivity(null, null)).toBe(false)
})

test('Verify scout owns event', async () => {
  expect(await verifyService.scoutOwnsEvent(scoutOwner, event.id)).toBe(true)
  expect(await verifyService.scoutOwnsEvent(scoutImposter, event.id)).toBe(false)
})

test('Verify scout does not own event when scout or event does not exist', async () => {
  const id = event.id
  await event.destroy()

  expect(await verifyService.scoutOwnsEvent(scoutOwner, id)).toBe(false)
  expect(await verifyService.scoutOwnsEvent(scoutOwner, null)).toBe(false)
  expect(await verifyService.scoutOwnsEvent(null, id)).toBe(false)
  expect(await verifyService.scoutOwnsEvent(null, null)).toBe(false)
})


test('Verify scout owns the plan through activity through event', async () => {
  const plan = await models.Plan.create({
    title: 'Quaint plan',
    guid: 'jgkdflhgjfkld',
    content: 'Do this and that',
    activityId: activityInEvent.id
  })

  expect(await verifyService.scoutOwnsPlan(scoutOwner, plan.id)).toBe(true)
  expect(await verifyService.scoutOwnsPlan(scoutImposter, plan.id)).toBe(false)
})

test('Verify scout owns the plan through activity through buffer', async () => {
  const plan = await models.Plan.create({
    title: 'Quaint plan',
    guid: 'jgkdflhgjfkld',
    content: 'Do this and that',
    activityId: activityInBuffer.id
  })

  expect(await verifyService.scoutOwnsPlan(scoutOwner, plan.id)).toBe(true)
  expect(await verifyService.scoutOwnsPlan(scoutImposter, plan.id)).toBe(false)
})


test('Verify the scout does not own the plan when the scout or the plan does not exist', async () => {
  const plan = await models.Plan.create({
    title: 'Quaint plan',
    guid: 'jgkdflhgjfkld',
    content: 'Do this and that',
    activityId: activityInEvent.id
  })
  const planId = plan.id

  expect(await verifyService.scoutOwnsPlan(scoutOwner, planId)).toBe(true)
  await plan.destroy()
  expect(await verifyService.scoutOwnsPlan(scoutOwner, planId)).toBe(false)
  expect(await verifyService.scoutOwnsPlan(scoutOwner, null)).toBe(false)
  expect(await verifyService.scoutOwnsPlan(null, plan.id)).toBe(false)
  expect(await verifyService.scoutOwnsPlan(null, null)).toBe(false)
  const scoutId=scoutOwner.id
  await scoutOwner.destroy()
  expect(await verifyService.scoutOwnsPlan({id: scoutId}, planId)).toBe(false)
})
  

test('Scout is logged in (found in database)', async () => {
  const scout = await models.Scout.create({ partioId: '12345', name: 'PartioId' })
  expect(await verifyService.isLoggedIn(scout)).toBe(true)
})

test('Scout is logged in (not found in database)', async () => {
  const scout = await models.Scout.create({ partioId: '123', name: 'PartioId' })
  await scout.destroy()
  expect(await verifyService.isLoggedIn(scout)).toBe(false)
})

test('Scout is logged in (scout is null)', async () => {
  const scout = null
  expect(await verifyService.isLoggedIn(scout)).toBe(false)
})
