const models = require('../domain/models')
const prepareService = require('./prepareService')

// Creates an activity from the given data and adds it to scout's buffer,
// or creates a new buffer if none found.
// Returns new activity.
async function addActivityToBuffer(activityData, scout) {
  if (!scout) {
    return { error: 'Scout is null' }
  }

  // TODO: validate activity (add validation to model)

  // Create activity
  const activity = await models.Activity.create(activityData)
  // Find buffer
  var buffer = await findByScout(scout)
  // Create buffer if not found
  if (!buffer) {
    buffer = await createBufferForScout(scout)
  }

  // Add activity to buffer
  await activity.update({ activityBufferId: buffer.id })
  await activity.update({ eventId: null })

  return await prepareService.prepareActivity(activity)
}

// Finds the scout's buffer and returns it
async function findByScout(scout) {
  return await prepareService.prepareBuffer(await models.ActivityBuffer.findByScout(scout))
}

// Creates a buffer for scout
async function createBufferForScout(scout) {
  return await prepareService.prepareBuffer(await models.ActivityBuffer.create({ scoutId: scout.id }))
}

module.exports = {
  addActivityToBuffer,
  findByScout,
  createBufferForScout,
}
