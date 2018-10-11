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
  var buffer = await findByScout(scout)
  // Create buffer if not found
  if (!buffer) {
    buffer = await createBufferForScout(scout)
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

// Creates a buffer for scout
async function createBufferForScout(scout) {
  return await models.ActivityBuffer.create({ scoutId: scout.id })
}

// Returns a frontend-friendly version of the buffer
// with activities and lower case attributes.
async function prepareBuffer(sequelizeBuffer) {
  const buffer = await models.ActivityBuffer.findById(sequelizeBuffer.id, {
    include: [models.Activity]
  })

  return {
    id: buffer.id,
    activities: buffer.Activities, // change to lower case
  }
}

module.exports = {
  addActivityToBuffer,
  findByScout,
  createBufferForScout,
  prepareBuffer,
}
