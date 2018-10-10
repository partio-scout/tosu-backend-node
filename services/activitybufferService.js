const models = require('../domain/models')

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
  var buffer = await models.ActivityBuffer.findByScout(scout)
  // Create buffer if not found
  if (!buffer) {
    buffer = await models.ActivityBuffer.create({ scoutId: scout.id })
  }

  // Add activity to buffer
  await activity.update({ activityBufferId: buffer.id })
  await activity.update({ eventId: null })

  return activity
}

// Finds the scout's buffer and returns it
async function findByScout(scout) {
  return await models.ActivityBuffer.findByScout(scout)
}

module.exports = {
  addActivityToBuffer,
  findByScout,
}
