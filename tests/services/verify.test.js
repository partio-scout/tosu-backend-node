const models = require('../../domain/models')
const verifyService = require('../../services/verify')
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
