const models = require('../../domain/models')
const verifyService = require('../../services/verifyService')
require('../handleTestDatabase')

test('Verify scout owns activity through event', async () => {
  const scoutOwner = await models.Scout.create()
  const scoutImposter = await models.Scout.create()
  const event = await models.Event.create({ scoutId: scoutOwner.id })
  const activity = await models.Activity.create({ eventId: event.id })

  expect(await verifyService.scoutOwnsActivity(scoutOwner, activity.id)).toBe(true)
  expect(await verifyService.scoutOwnsActivity(scoutImposter, activity.id)).toBe(false)
})

test('Verify scout owns activity through buffer', async () => {
  const scoutOwner = await models.Scout.create()
  const scoutImposter = await models.Scout.create()
  const buffer = await models.ActivityBuffer.create({ scoutId: scoutOwner.id })
  const activity = await models.Activity.create({ activityBufferId: buffer.id })

  expect(await verifyService.scoutOwnsActivity(scoutOwner, activity.id)).toBe(true)
  expect(await verifyService.scoutOwnsActivity(scoutImposter, activity.id)).toBe(false)
})

test('Verify scout does not own activity when scout or activity does not exist', async () => {
  const scout = await models.Scout.create()
  const activity = await models.Activity.create()
  const id = activity.id
  await activity.destroy()

  expect(await verifyService.scoutOwnsActivity(scout, id)).toBe(false)
  expect(await verifyService.scoutOwnsActivity(scout, null)).toBe(false)
  expect(await verifyService.scoutOwnsActivity(null, id)).toBe(false)
  expect(await verifyService.scoutOwnsActivity(null, null)).toBe(false)
})



test('Verify scout owns event', async () => {
  const scoutOwner = await models.Scout.create()
  const scoutImposter = await models.Scout.create()
  const event = await models.Event.create({ scoutId: scoutOwner.id })

  expect(await verifyService.scoutOwnsEvent(scoutOwner, event.id)).toBe(true)
  expect(await verifyService.scoutOwnsEvent(scoutImposter, event.id)).toBe(false)
})

test('Verify scout does not own event when scout or event does not exist', async () => {
  const scout = await models.Scout.create()
  const event = await models.Event.create()
  const id = event.id
  await event.destroy()
  
  expect(await verifyService.scoutOwnsEvent(scout, id)).toBe(false)
  expect(await verifyService.scoutOwnsEvent(scout, null)).toBe(false)
  expect(await verifyService.scoutOwnsEvent(null, id)).toBe(false)
  expect(await verifyService.scoutOwnsEvent(null, null)).toBe(false)
})
